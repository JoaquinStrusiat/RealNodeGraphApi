const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const ObjectModel = require("../models/ObjectModel.js")

//Services
const services = require("../services/Services.js");

//Middlewares
const { addModelAndServicesMiddleware } = require("../../utils/middlewares.js");

router.post('/findObjects', addModelAndServicesMiddleware(ObjectModel, services), findController);
router.post('/createObject', addModelAndServicesMiddleware(ObjectModel, services), createController);
router.put('/updateObject/:id', addModelAndServicesMiddleware(ObjectModel, services), updateController);
router.delete('/deleteObject/:id', addModelAndServicesMiddleware(ObjectModel, services), deleteController);

module.exports = router;