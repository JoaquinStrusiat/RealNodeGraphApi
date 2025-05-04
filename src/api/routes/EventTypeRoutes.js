const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const model = require("../models/EventTypeModel.js");

//Services
const services = require("../services/TypesServices.js");

//Middlewares
const handrail = require("../../middlewares/handrail.js");

router.post('/findEventsTypes', handrail({model, services}), findController);
router.post('/createEventType', handrail({model, services}), createController);
router.put('/updateEventType/:id', handrail({model, services}), updateController);
router.delete('/deleteEventType/:id', handrail({model, services}), deleteController);

module.exports = router; 