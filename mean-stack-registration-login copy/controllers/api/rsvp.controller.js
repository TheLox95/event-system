var config = require('config.json');
var express = require('express');
var router = express.Router();
var eventService = require('services/rsvp.service');

// routes
router.get('/invitations/:user_id', invitations);
router.post('/invitate', invitate);
router.put('/response', response);


module.exports = router;


function invitations(req, res) {
    eventService.intitations(req.params)
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
    eventService.invitate(req.body)
        .then(function () {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: false, success: true, body: 'user invitated' });
        })
        .catch(function (err) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: true, success: false, body:err });
        });
}

function response(req, res) {
    eventService.responseInvitation(req.body)
        .then(function () {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: false, success: true, body: 'response to event maded' });
        })
        .catch(function (err) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: true, success: false, body:err });
        });
}