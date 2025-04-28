const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const model = require("../models/ObjectModel.js")

//Services
const { findTypesService, findObjectsService: findService, ...res } = require("../services/Services.js");
const services = { findService, ...res };

//Middlewares
const handrail = require("../../middlewares/handrail.js");

router.post('/findObjects', handrail({model, services}), findController);
router.post('/createObject', handrail({model, services}), createController);
router.put('/updateObject/:id', handrail({model, services}), updateController);
router.delete('/deleteObject/:id', handrail({model, services}), deleteController);

module.exports = router;