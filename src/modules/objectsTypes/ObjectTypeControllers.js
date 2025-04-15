const { findTypesService, createTypeService, updateTypeService, deleteTypeService } = require("./ObjectTypeServices.js")
const ObjectTypeModel = require("./ObjectTypeModel");

const findObjectsTypes = async (req, res) => {
    const { body, userKey } = req;

    try {
        const obj = await findTypesService(ObjectTypeModel, userKey, body);
        return res.send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const createObjectType = async (req, res) => {
    const { body, userKey } = req;

    try {
        const obj = await createTypeService(ObjectTypeModel, userKey, body);
        return res.status(201).send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const updateObjectType = async (req, res) => {
    const { body, userKey, params: { id } } = req;

    try {
        const obj = await updateTypeService(ObjectTypeModel, userKey, body, id);
        return res.status(200).send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const deleteObjectType = async (req, res) => {
    const { userKey, params: { id } } = req;

    try {
        const obj = await deleteTypeService(ObjectTypeModel, userKey, id);
        return res.status(200).send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

module.exports = { findObjectsTypes, createObjectType, updateObjectType, deleteObjectType };