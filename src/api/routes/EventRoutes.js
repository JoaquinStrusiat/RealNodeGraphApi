const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const EventTypeModel = require("../models/EventModel.js")

//Services
const services = require("../services/Services.js");

//Middlewares
const { addModelAndServicesMiddleware } = require("../../utils/middlewares.js");

router.post('/findEvents', addModelAndServicesMiddleware(EventTypeModel, services), findController);
router.post('/createEvent', addModelAndServicesMiddleware(EventTypeModel, services), createController);
router.put('/updateEvent/:id', addModelAndServicesMiddleware(EventTypeModel, services), updateController);
router.delete('/deleteEvent/:id', addModelAndServicesMiddleware(EventTypeModel, services), deleteController);

module.exports = router;