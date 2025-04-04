const router = require('express').Router();
const { findObjectsTypes, createObjectTypes, updateObjectTypes, deleteObjectTypes } = require("./ObjectTypeControllers.js")

router.post('/findObjectsTypes', findObjectsTypes);
router.post('/createObjectTypes', createObjectTypes);
router.put('/updateObjectTypes', updateObjectTypes);
router.delete('/deleteObjectTypes', deleteObjectTypes);

module.exports = router;