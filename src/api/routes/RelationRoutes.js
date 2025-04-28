const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const model = require("../models/RelationModel.js")

//Services
const { findTypesService, findObjectsService: findService, ...res } = require("../services/Services.js");
const services = { findService, ...res };

//Middlewares
//const { addModelAndServicesMiddleware } = require("../../utils/middlewares.js");
const handrail = require("../../middlewares/handrail.js");

router.post('/findRelations', handrail({model, services}), findController);
router.post('/createRelation', handrail({model, services}), createController);
router.put('/updateRelation/:id', handrail({model, services}), updateController);
router.delete('/deleteRelation/:id', handrail({model, services}), deleteController);

module.exports = router;