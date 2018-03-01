var config = require('../config.json');
var rsvpService = require('./rsvp.service.js');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('events');

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
            return rsvpService.getByEvent(event._id).then(invitations => {
                event.invitations = invitations;
                return event;
            });
        });
        Promise.all(arr).then(function(results) {
            deferred.resolve(results);
        })
    });

    return deferred.promise;
}

function create(eventParam) {
    var deferred = Q.defer();

    // validation
    db.events.findOne(
        { event_name: eventParam.event_name },
        function (err, event) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (event) {
                // username already exists
                deferred.reject('Event name "' + eventParam.event_name + '" is already taken');
            } else {
                createEvent();
            }
        });

    function createEvent() {

        db.events.insert(
            eventParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, userParam) {
    var deferred = Q.defer();

    // validation
    db.events.findById(_id, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            db.events.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });

    function updateUser() {
        // fields to update
        var set = {
            firstName: userParam.firstName,
            lastName: userParam.lastName,
            username: userParam.username,
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        db.events.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

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