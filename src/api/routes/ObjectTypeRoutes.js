const router = require('express').Router();

//Controllers
const { findTypes, createType, updateType, deleteType } = require("../controllers/TypesControllers.js")

//Model
const ObjectTypeModel = require("../models/ObjectTypeModel.js")

//Middlewares
const { injectModelMiddleware } = require("../../utils/middlewares.js");

router.post('/findObjectsTypes', injectModelMiddleware(ObjectTypeModel), findTypes);
router.post('/createObjectType', injectModelMiddleware(ObjectTypeModel), createType);
router.put('/updateObjectType/:id', injectModelMiddleware(ObjectTypeModel), updateType);
router.delete('/deleteObjectType/:id', injectModelMiddleware(ObjectTypeModel), deleteType);

module.exports = router;