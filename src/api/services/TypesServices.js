const ErrorState = require('../../utils/ErrorState');
const validateAdmin = require('../../utils/validateAdmin')

const findService = async (model, owner, body) => {
    if (!Array.isArray(body)) throw new ErrorState(400, 'Bad Request', 'The body must be an array with "Pipeline stages".')

    try {
        const items = body.length === 0 ? await model.find() : await model.aggregate(body);
        return items;
    } catch (error) {
        if (error.name === 'ValidationError') throw new ErrorState(400, 'ValidationError', error.message);
        if (error.name === 'CastError') throw new ErrorState(400, 'Invalid data type for field', error.message);
        if (error.name === 'ErrorState') throw error;
        throw new ErrorState(500, 'Internal Server Error Aca', error.message);
    }
};

const createService = async (model, owner, body) => {
    await validateAdmin(owner);
    
    if (Object.prototype.toString.call(body) !== '[object Object]') throw new ErrorState(400, 'Bad Request', 'The body must be an Object with valid attributes.')

    const forbiddenFields = ['createdAt', 'updatedAt'];
    for (const field of forbiddenFields) {
        if (field in body) throw new ErrorState(400, 'Bad Request', `The attribute '${field}' cannot be modified.`);
    }

    try {
        const item = await model.create(body);
        return item;
    } catch (error) {
        if (error.name === 'ValidationError') throw new ErrorState(400, 'ValidationError', error.message);
        if (error.name === 'CastError') throw new ErrorState(400, 'Invalid data type for field', error.message);
        if (error.name === 'ErrorState') throw error;
        throw new ErrorState(500, 'Internal Server Error', error.message);
    }
};

const updateService = async (model, owner, body, _id) => {
    await validateAdmin(owner);

    if (!_id) throw new ErrorState(400, 'Bad Request', 'The _id is required.');
    if (Object.prototype.toString.call(body) !== '[object Object]') throw new ErrorState(400, 'Bad Request', 'The body must be an Object with valid attributes.');
    if (Object.keys(body).length === 0) throw new ErrorState(400, 'Bad Request', 'The body must be a non-empty.');

    const forbiddenFields = ['_id', 'createdAt', 'updatedAt'];
    for (const field of forbiddenFields) {
        if (field in body) throw new ErrorState(400, 'Bad Request', `The attribute '${field}' cannot be modified.`);
    }

    try {
        const object = await model.findById(_id);
        if (!object) throw new ErrorState(404, 'Not Found', `Object with _id '${_id}' not found.`);

        const item = await model.findByIdAndUpdate(_id, { $set: body }, {
            new: true,              // devuelve el documento actualizado
            runValidators: true,    // valida el body contra el esquema de Mongoose
            context: 'query',       // necesario para algunas validaciones (por ej., validators personalizados)
            upsert: false,          // NO crea un nuevo documento si no existe
            optimisticConcurrency: true
        });

        return item;
    } catch (error) {
        if (error.name === 'ValidationError') throw new ErrorState(400, 'ValidationError', error.message);
        if (error.name === 'CastError') throw new ErrorState(400, 'Invalid data type for field', error.message);
        if (error.name === 'ErrorState') throw error;
        throw new ErrorState(500, 'Internal Server Error', error.message);
    }
};

const deleteService = async (model, owner, _id) => {
    await validateAdmin(owner);

    if (!_id) throw new ErrorState(400, 'Bad Request', 'The _id is required.');

    try {
        const item = await model.findOneAndDelete({ _id });
        if (!item) throw new ErrorState(404, 'Not Found', `Object with _id '${_id}' not found.`);
        return item;
    } catch (error) {
        if (error.name === 'ValidationError') throw new ErrorState(400, 'ValidationError', error.message);
        if (error.name === 'CastError') throw new ErrorState(400, 'Invalid data type for field', error.message);
        if (error.name === 'ErrorState') throw error;
        throw new ErrorState(500, 'Internal Server Error', error.message);
    }
};

const services = { findService, createService, updateService, deleteService };
module.exports = services;