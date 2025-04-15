const { findTypesService, createTypeService, updateTypeService, deleteTypeService } = require("../services/TypesServices.js")

const findTypes = async (req, res) => {
    const { body, userKey, model } = req;

    try {
        const obj = await findTypesService(model, userKey, body);
        return res.send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const createType = async (req, res) => {
    const { body, userKey, model} = req;

    try {
        const obj = await createTypeService(model, userKey, body);
        return res.status(201).send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const updateType = async (req, res) => {
    const { body, userKey, params: { id }, model } = req;

    try {
        const obj = await updateTypeService(model, userKey, body, id);
        return res.status(200).send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const deleteType = async (req, res) => {
    const { userKey, params: { id }, model } = req;

    try {
        const obj = await deleteTypeService(model, userKey, id);
        return res.status(200).send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

module.exports = { findTypes, createType, updateType, deleteType };