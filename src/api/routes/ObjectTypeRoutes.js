const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const model = require("../models/ObjectTypeModel.js")

//Services
const services = require("../services/TypesServices.js");

//Middlewares
const handrail = require("../../middlewares/handrail.js");

router.post('/findObjectsTypes', handrail({model, services}), findController);
router.post('/createObjectType', handrail({model, services}), createController);
router.put('/updateObjectType/:id', handrail({model, services}), updateController);
router.delete('/deleteObjectType/:id', handrail({model, services}), deleteController);

module.exports = router;