const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const model = require("../models/RelationModel.js")

//Services
const services = require("../services/ObjectsServices.js");

//Middlewares
const handrail = require("../../middlewares/handrail.js");

router.post('/findRelations', handrail({model, services}), findController);
router.post('/createRelation', handrail({model, services}), createController);
router.put('/updateRelation/:id', handrail({model, services}), updateController);
router.delete('/deleteRelation/:id', handrail({model, services}), deleteController);

module.exports = router;