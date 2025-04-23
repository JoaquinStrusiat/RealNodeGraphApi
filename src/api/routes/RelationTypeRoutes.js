const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const RelationTypeModel = require("../models/RelationTypeModel.js")

//Services
const services = require("../services/Services.js");

//Middlewares
const { addModelAndServicesMiddleware } = require("../../utils/middlewares.js");

router.post('/findRelationsTypes', addModelAndServicesMiddleware(RelationTypeModel, services), findController);
router.post('/createRelationType', addModelAndServicesMiddleware(RelationTypeModel, services), createController);
router.put('/updateRelationType/:id', addModelAndServicesMiddleware(RelationTypeModel, services), updateController);
router.delete('/deleteRelationType/:id', addModelAndServicesMiddleware(RelationTypeModel, services), deleteController);

module.exports = router;