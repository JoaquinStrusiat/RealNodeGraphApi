const authenticateUser = require('../../utils/authenticateUser');

const findController = async (req, res) => {
    const { body, model, path, method, services: { findService }, headers: { authorization } } = req;
    const obj = { path, method };
    let owner;

    try {
        if (authorization) owner = await authenticateUser(authorization);

        const items = await findService(model, owner, body);
        obj.items = items;
        return res.send(obj);
    } catch (error) {
        obj.error = error.toResponse();
        return res.status(error.statusCode).send(obj);
    }
}

const createController = async (req, res) => {
    const { body, model, path, method, services: { createService }, headers: { authorization } } = req;
    const obj = { path, method };

    try {
        const owner = await authenticateUser(authorization);

        const item = await createService(model, owner, body);
        obj.item = item;
        return res.status(201).send(obj);
    } catch (error) {
        obj.error = error.toResponse();
        return res.status(error.statusCode).send(obj);
    }
}

const updateController = async (req, res) => {
    const { body, params: { id }, model, path, method, services: { updateService }, headers: { authorization } } = req;
    const obj = { path, method };

    try {
        const owner = await authenticateUser(authorization);

        const item = await updateService(model, owner, body, id);
        obj.item = item;
        return res.status(200).send(obj);
    } catch (error) {
        obj.error = error.toResponse();
        return res.status(error.statusCode).send(obj);
    }
}

const deleteController = async (req, res) => {
    const { params: { id }, model, path, method, services: { deleteService }, headers: { authorization } } = req;
    const obj = { path, method };

    try {
        const owner = await authenticateUser(authorization);

        const item = await deleteService(model, owner, id);
        obj.item = item;
        return res.status(200).send(obj);
    } catch (error) {
        obj.error = error.toResponse();
        return res.status(error.statusCode).send(obj);
    }
}

module.exports = { findController, createController, updateController, deleteController };