const { findTypesService, createTypeService } = require("./TypeService.js")

const findObjectsTypes = async (req, res) => {
    const { body, userKey } = req;

    try {
        const obj = await findTypesService(userKey, body);
        return res.send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const createObjectTypes = async (req, res) => {
    const { body, userKey } = req;

    try {
        const obj = await createTypeService(userKey, body);
        return res.status(201).send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const updateObjectTypes = async (req, res) => {
    try {
        const { body, url } = req;
        const obj = { function: "updateObjectsTypes", body, url };
        res.send(obj)
    } catch (err) {
        console.log("updateObjectsTypes: ", err)
    }
}

const deleteObjectTypes = async (req, res) => {
    try {
        const { body, url } = req;
        const obj = { function: "deleteObjectsTypes", body, url };
        res.send(obj)
    } catch (err) {
        console.log("deleteObjectsTypes: ", err)
    }
}
module.exports = { findObjectsTypes, createObjectTypes, updateObjectTypes, deleteObjectTypes };