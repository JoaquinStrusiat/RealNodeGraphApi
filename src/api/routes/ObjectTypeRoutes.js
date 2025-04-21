const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const ObjectTypeModel = require("../models/ObjectTypeModel.js")

//Services
const services = require("../services/Services.js");

//Middlewares
const { addModelAndServicesMiddleware } = require("../../utils/middlewares.js");

router.post('/findObjectsTypes', addModelAndServicesMiddleware(ObjectTypeModel, services), findController);
router.post('/createObjectType', addModelAndServicesMiddleware(ObjectTypeModel, services), createController);
router.put('/updateObjectType/:id', addModelAndServicesMiddleware(ObjectTypeModel, services), updateController);
router.delete('/deleteObjectType/:id', addModelAndServicesMiddleware(ObjectTypeModel, services), deleteController);

module.exports = router;