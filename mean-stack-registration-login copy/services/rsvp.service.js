var config = require('../config.json');
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
        deferred.resolve(result);
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