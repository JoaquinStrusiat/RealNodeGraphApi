const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const RelationModel = require("../models/RelationModel.js")

//Services
const services = require("../services/Services.js");

//Middlewares
const { addModelAndServicesMiddleware } = require("../../utils/middlewares.js");

router.post('/findRelations', addModelAndServicesMiddleware(RelationModel, services), findController);
router.post('/createRelation', addModelAndServicesMiddleware(RelationModel, services), createController);
router.put('/updateRelation/:id', addModelAndServicesMiddleware(RelationModel, services), updateController);
router.delete('/deleteRelation/:id', addModelAndServicesMiddleware(RelationModel, services), deleteController);

module.exports = router;