var config = require('../config.json');
var userService = require('./user.service.js');
var eventService = require('./event.service.js');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('rsvp');
db.bind('events');
db.bind('users');

var service = {};

service.invitate = invitate;
service.intitations = getInvitationsByUsername;
service.responseInvitation = response;
service.cancelInvitation = cancel;

module.exports = service;

function cancel(invitationId) {
    var deferred = Q.defer();

    db.rsvp.remove(
        { _id: mongo.helper.toObjectID(invitationId) },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function response(responseFromUser) {
    var deferred = Q.defer();

    db.rsvp.update(
        { _id: mongo.helper.toObjectID(responseFromUser.id) },
        { $set: {is_going: responseFromUser.res } },
        function (err, doc) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}


function getInvitationsByUsername(invitationParam) {
    var deferred = Q.defer();

    db.rsvp
      .find({ user_id: invitationParam.user_id })
      .toArray(function(err, result) {
        if (err) deferred.reject(err);
        const arr = result.map(rsvp => {
          return new Promise((resolve, rejected) => {
            _getEvent(rsvp.event_id).then(event => {
              rsvp.event = event;

              _getUser(rsvp.user_id).then(user => {
                rsvp.user = user;
                resolve(rsvp);
              });
            });
          });
        });

        Promise.all(arr).then(function(results) {
            deferred.resolve(results);
          });
      });

    return deferred.promise;
}

function _getEvent(id){
    return new Promise((resolve, rejected) => {
        db.events.findById(id, function(err, event) {
            if(err){
                rejected(err);
            }

            resolve(event);
        });
    });
}

function _getUser(id){
    return new Promise((resolve, rejected) => {
        db.users.findById(id,(err, user) => {
            if (err) {
              rejected(err);
            }
            resolve(user);
          });
    });
}

function invitate(invitationParam) {
    var deferred = Q.defer();

    db.events.findById(invitationParam.event_id, (err, event) => {
        if(event.user_id === invitationParam.user_id){
            deferred.reject('You cannot invite yourself');
            return;
        }

        db.rsvp.findOne(
            { user_id: invitationParam.user_id, event_id: invitationParam.event_id },
            function (err, event) {
                if (err) deferred.reject(err.name + ': ' + err.message);
    
                if (event) {
                    // username already exists
                    deferred.reject('User already invited to this event');
                } else {
                    doinvitation();
                }
            });
    });

    function doinvitation(){
        db.rsvp.insert(
            invitationParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
    
                deferred.resolve(doc.ops[0]);
            });
    }

    return deferred.promise;
}