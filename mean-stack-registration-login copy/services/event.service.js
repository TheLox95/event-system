var config = require('../config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var imageService = require('./image.service');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('events');

var dbRSVP = mongo.db(config.connectionString, { native_parser: true });
dbRSVP.bind('rsvp');

var dbUSER = mongo.db(config.connectionString, { native_parser: true });
dbUSER.bind('users');

var service = {};

service.getById = getById;
service.getByUser = getByUser;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    db.events.findById(_id, function (err, event) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(event);        
    });

    return deferred.promise;
}

function getByUser(eventParam) {
    var deferred = Q.defer();

    db.events.find({user_id: eventParam.user_id}).toArray(function(err, result) {
        if (err) deferred.reject(err);

        
        const arr = result.map(event => {
            return new Promise((res, rej) =>{
                dbRSVP.rsvp.find({event_id: event._id.toString()}).toArray((err, invitations) => {
                    event.invitations = []

                    const user = invitations.map(invitation => {
                        return new Promise((resInside, rejInside) => {
                            dbUSER.users.findById(invitation.user_id, (err, user) => {
                                invitation.user = user;
                                resInside();
                            }); 
                        });                       
                    });

                    Promise.all(user).then(function(results) {
                        event.invitations = invitations;
                        res(event);
                    })
                });
            });
        });
        Promise.all(arr).then(function(results) {
            deferred.resolve(results);
        })
    });

    return deferred.promise;
}

function create(eventObj, image) {
    var deferred = Q.defer();
    

    // validation
    db.events.findOne(
        { event_name: eventObj.event_name },
        function (err, event) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (event) {
                // username already exists
                deferred.reject('Event name "' + event.event_name + '" is already taken');
                
            } 
            createEvent();
            
        });

    function createEvent() {

        db.events.insert(
            eventObj,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                console.log(doc);

                imageService.save(image, doc.ops[0]).then(() => {
                    deferred.resolve();
                }).catch(err => deferred.reject(err));         
                       

            });
    }

    return deferred.promise;
}

function update(eventParam, image) {
    var deferred = Q.defer();

    // validation
    db.events.findById(eventParam._id, function (err, event) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (event.event_name !== eventParam.event_name) {
            // username has changed so check if the new username is already taken
            db.events.findOne(
                { username: eventParam.event_name },
                function (err, event) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (event) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateEvent();
                    }
                });
        } else {
            updateEvent();
        }
    });

    function updateEvent() {

        const _id = eventParam._id;
        delete eventParam._id;
        delete eventParam.category;

        db.events.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: eventParam },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                if(image){
                    imageService.save(image, {_id});
                }

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.events.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}