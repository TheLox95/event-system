var config = require('config.json');
var express = require('express');
var router = express.Router();
var eventService = require('services/event.service');

// routes
router.get('/:user_id', getByUserId);
router.post('/new', createEvent);
router.put('/update', updateEvent);
router.delete('/delete', deleteEvent);

module.exports = router;

function getByUserId(req, res) {
    eventService.getByUser(req.params)
        .then(function (events) {
            console.log(events);
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: false, success: true, body: events});
        })
        .catch(function (err) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: true, success: false, body:err });
        });
}


function createEvent(req, res) {
    eventService.create(req.body)
        .then(function () {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: false, success: true, body: 'event created' });
        })
        .catch(function (err) {
            res.setHeader('Content-Type', 'application/json');
            res.send({ error: true, success: false, body:err });
        });
}

function updateEvent(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    }

    eventService.update(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteEvent(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only delete own account
        return res.status(401).send('You can only delete your own account');
    }

    eventService.delete(userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}