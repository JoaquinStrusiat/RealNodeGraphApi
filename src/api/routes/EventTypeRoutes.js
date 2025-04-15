const router = require('express').Router();

//Controllers
const { findTypes, createType, updateType, deleteType } = require("../controllers/TypesControllers.js")

//Model
const EventTypeModel = require("../models/EventTypeModel.js")

//Middlewares
const { injectModelMiddleware } = require("../../utils/middlewares.js");

router.post('/findEventsTypes', injectModelMiddleware(EventTypeModel), findTypes);
router.post('/createEventType', injectModelMiddleware(EventTypeModel), createType);
router.put('/updateEventType/:id', injectModelMiddleware(EventTypeModel), updateType);
router.delete('/deleteEventType/:id', injectModelMiddleware(EventTypeModel), deleteType);

module.exports = router; 