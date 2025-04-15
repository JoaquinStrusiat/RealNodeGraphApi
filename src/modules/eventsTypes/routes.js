const router = require('express').Router();
const { findEventsTypes, createEventType, updateEventType, deleteEventType } = require("./EventTypeControllers")

router.post('/findEventsTypes', findEventsTypes);
router.post('/createEventType', createEventType);
router.put('/updateEventType/:id', updateEventType);
router.delete('/deleteEventType/:id', deleteEventType);

module.exports = router;