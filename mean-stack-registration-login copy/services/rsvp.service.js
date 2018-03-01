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

var service = {};

service.invitate = invitate;
service.intitations = getInvitationsByUsername;

module.exports = service;


function getInvitationsByUsername(invitationParam) {
    var deferred = Q.defer();

    db.rsvp.find({ user_id: invitationParam.user_id }).toArray(function(err, result) {
        if (err) deferred.reject(err);
        const arr = result.map((rsvp) => {
            return userService.getById(rsvp.user_id).then(user => {
                rsvp.user = user
                return eventService.getById(rsvp.event_id).then(event => {
                    rsvp.event = event;
                    rsvp = _.omit(rsvp, "user_id");
                    rsvp = _.omit(rsvp, "event_id");
                    return rsvp;
                });
            });

        });
        Promise.all(arr).then(function(results) {
            deferred.resolve(results);
        })
    });

    return deferred.promise;
}

function invitate(invitationParam) {
    var deferred = Q.defer();

    db.rsvp.findOne(
        { user_id: invitationParam.user_id },
        function (err, event) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (event) {
                // username already exists
                deferred.reject('User already invited to this event');
            } else {
                doinvitation();
            }
        });

    function doinvitation(){
        db.rsvp.insert(
            invitationParam,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);
    
                deferred.resolve();
            });
    }

    return deferred.promise;
}