const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const EventTypeModel = require("../models/EventTypeModel.js");

//Services
const services = require("../services/Services.js");

//Middlewares
const { addModelAndServicesMiddleware } = require("../../utils/middlewares.js");

router.post('/findEventsTypes', addModelAndServicesMiddleware(EventTypeModel, services), findController);
router.post('/createEventType', addModelAndServicesMiddleware(EventTypeModel, services), createController);
router.put('/updateEventType/:id', addModelAndServicesMiddleware(EventTypeModel, services), updateController);
router.delete('/deleteEventType/:id', addModelAndServicesMiddleware(EventTypeModel, services), deleteController);

module.exports = router; 