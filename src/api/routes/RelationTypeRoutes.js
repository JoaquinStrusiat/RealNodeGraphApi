const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const model = require("../models/RelationTypeModel.js")

//Services
const services = require("../services/TypesServices.js");

//Middlewares
//const { addModelAndServicesMiddleware } = require("../../utils/middlewares.js");
const handrail = require("../../middlewares/handrail.js");

router.post('/findRelationsTypes', handrail({model, services}), findController);
router.post('/createRelationType', handrail({model, services}), createController);
router.put('/updateRelationType/:id', handrail({model, services}), updateController);
router.delete('/deleteRelationType/:id', handrail({model, services}), deleteController);

module.exports = router;