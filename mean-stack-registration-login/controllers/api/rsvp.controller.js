﻿var config = require('config.json');
var express = require('express');
var router = express.Router();
var rsvpService = require('services/rsvp.service');

// routes
router.get('/invitations/:user_id', invitations);
router.post('/invitate', invitate);
router.put('/response', response);
router.delete('/cancel/:id', cancel);


module.exports = router;


function invitations(req, res) {
    rsvpService.intitations(req.params)
        .then(function (rsvps) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: false, success: true, body: rsvps });
        })
        .catch(function (err) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: true, success: false, body:err });
        });
}

function invitate(req, res) {
    rsvpService.invitate(req.body)
        .then(function (invitation) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: false, success: true, body: invitation });
        })
        .catch(function (err) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: true, success: false, body:err });
        });
}

function response(req, res) {
    rsvpService.responseInvitation(req.body)
        .then(function () {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: false, success: true, body: 'response to event maded' });
        })
        .catch(function (err) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: true, success: false, body:err });
        });
}

function cancel(req, res) {
    rsvpService.cancelInvitation(req.params.id)
        .then(function () {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: false, success: true, body: 'response cancelled' });
        })
        .catch(function (err) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: true, success: false, body:err });
        });
}