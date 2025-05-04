const findController = async (req, res) => {
    const { body, owner, model, path, method, services: { findService } } = req;
    const obj = { path, method };

    try {
        const items = await findService(model, owner, body);
        obj.items = items;
        return res.send(obj);
    } catch (error) {
        obj.error = error.toResponse();
        return res.status(error.statusCode).send(obj);
    }
}

const createController = async (req, res) => {
    const { body, owner, model, path, method, services: { createService } } = req;
    const obj = { path, method };

    try {
        const item = await createService(model, owner, body);
        obj.item = item;
        return res.status(201).send(obj);
    } catch (error) {
        obj.error = error.toResponse();
        return res.status(error.statusCode).send(obj);
    }
}

const updateController = async (req, res) => {
    const { body, owner, params: { id }, model, path, method, services: { updateService } } = req;
    const obj = { path, method };

    try {
        const item = await updateService(model, owner, body, id);
        obj.item = item;
        return res.status(200).send(obj);
    } catch (error) {
        obj.error = error.toResponse();
        return res.status(error.statusCode).send(obj);
    }
}

const deleteController = async (req, res) => {
    const { owner, params: { id }, model, path, method, services: { deleteService } } = req;
    const obj = { path, method };

    try {
        const item = await deleteService(model, owner, id);
        obj.item = item;
        return res.status(200).send(obj);
    } catch (error) {
        obj.error = error.toResponse();
        return res.status(error.statusCode).send(obj);
    }
}

module.exports = { findController, createController, updateController, deleteController };