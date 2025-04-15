const { findTypesService, createTypeService, updateTypeService, deleteTypeService } = require("./EventTypeService")
const EventTypeModel = require("./EventTypeModel")

const findEventsTypes = async (req, res) => {
    const { body, userKey } = req;

    try {
        const obj = await findTypesService(EventTypeModel, userKey, body);
        return res.send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const createEventType = async (req, res) => {
    const { body, userKey } = req;

    try {
        const obj = await createTypeService(EventTypeModel, userKey, body);
        return res.status(201).send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const updateEventType = async (req, res) => {
    const { body, userKey, params: { id } } = req;

    try {
        const obj = await updateTypeService(EventTypeModel, userKey, body, id);
        return res.status(200).send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}

const deleteEventType = async (req, res) => {
    const { userKey, params: { id } } = req;

    try {
        const obj = await deleteTypeService(EventTypeModel, userKey, id);
        return res.status(200).send(obj);
    } catch (err) {
        return res.status(400).send({ err: err.message })
    }
}
module.exports = { findEventsTypes, createEventType, updateEventType, deleteEventType };