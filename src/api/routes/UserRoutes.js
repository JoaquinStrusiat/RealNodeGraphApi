const router = require('express').Router();

//Controllers
const { findController, createController, updateController, deleteController } = require("../controllers/Controllers.js")

//Model
const model = require("../models/UserModel.js")

//Services
const services = require("../services/UsersServices.js");

//Middlewares
const handrail = require("../../middlewares/handrail.js");

router.post('/findUsers', handrail({model, services}), findController);
//router.post('/createObject', handrail({model, services}), createController);
router.put('/updateUser/:id', handrail({model, services}), updateController);
//router.delete('/deleteUser/:id', handrail({model, services}), deleteController);

module.exports = router;