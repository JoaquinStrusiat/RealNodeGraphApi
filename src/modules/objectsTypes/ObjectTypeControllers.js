const { findTypesService, createTypeService, updateTypeService } = require("./TypeService.js")

const findObjectsTypes = async (req, res) => {
    const { body, userKey } = req;

    try {
        const obj = await findTypesService(userKey, body);
        return res.send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const createObjectType = async (req, res) => {
    const { body, userKey } = req;

    try {
        const obj = await createTypeService(userKey, body);
        return res.status(201).send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const updateObjectType = async (req, res) => {
    const { body, userKey, params } = req;

    try {
        const obj = await updateTypeService(userKey, body, params.id);
        return res.status(201).send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const deleteObjectType = async (req, res) => {
    try {
        const { body, url } = req;
        const obj = { function: "deleteObjectsTypes", body, url };
        res.send(obj)
    } catch (err) {
        console.log("deleteObjectsTypes: ", err)
    }
}
module.exports = { findObjectsTypes, createObjectType, updateObjectType, deleteObjectType };