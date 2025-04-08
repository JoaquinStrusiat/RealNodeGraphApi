const router = require('express').Router();
const { findObjectsTypes, createObjectType, updateObjectType, deleteObjectType } = require("./ObjectTypeControllers.js")

router.post('/findObjectsTypes', findObjectsTypes);
router.post('/createObjectType', createObjectType);
router.put('/updateObjectType/:id', updateObjectType);
router.delete('/deleteObjectType/:id', deleteObjectType);

module.exports = router;