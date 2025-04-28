const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const model = require("../models/EventModel.js")

//Services
const { findTypesService, findObjectsService: findService, ...res } = require("../services/Services.js");
const services = { findService, ...res };

//Middlewares
const handrail = require("../../middlewares/handrail.js");

router.post('/findEvents', handrail({model, services}), findController);
router.post('/createEvent', handrail({model, services}), createController);
router.put('/updateEvent/:id', handrail({model, services}), updateController);
router.delete('/deleteEvent/:id', handrail({model, services}), deleteController);

module.exports = router;