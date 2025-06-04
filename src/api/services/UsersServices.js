const ErrorState = require('../../utils/ErrorState');
const { Types } = require('mongoose');
const { toFind, toCreate, toMutate } = require('../../utils/resolveAccess')

const findService = async (model, owner, body) => {
    if (!Array.isArray(body)) throw new ErrorState(400, 'Bad Request', 'The body must be an array with "Pipeline stages".')

    try {
        const formatedPipline = body.map(stage => {
            if (stage.$match && stage.$match._id && typeof stage.$match._id.$eq === 'string') {
                return {
                    ...stage,
                    $match: {
                        ...stage.$match,
                        _id: {
                            $eq: new Types.ObjectId(stage.$match._id.$eq)
                        }
                    }
                };
            }
            return stage;
        });

        formatedPipline.push({ $project: { "password": false } });
        const items = await model.aggregate(formatedPipline);
        return items;
    } catch (error) {
        if (error.name === 'ValidationError') throw new ErrorState(400, 'ValidationError', error.message);
        if (error.name === 'CastError') throw new ErrorState(400, 'Invalid data type for field', error.message);
        if (error.name === 'ErrorState') throw error;
        throw new ErrorState(500, 'Internal Server Error', error.message);
    }
};

// No se usa
const createService = async (model, owner, body) => {
    if (Object.prototype.toString.call(body) !== '[object Object]') throw new ErrorState(400, 'Bad Request', 'The body must be an Object with valid attributes.')

    const forbiddenFields = ['_id', 'createdAt', 'updatedAt'];
    for (const field of forbiddenFields) {
        if (field in body) throw new ErrorState(400, 'Bad Request', `The attribute '${field}' cannot be modified.`);
    }

    try {
        if (!body.owner) body.owner = owner;
        
        if(!body.type) throw new ErrorState(400, 'Bad Request', 'The type is required.');

        const access = await toCreate(owner, body);
        if (!access) throw new ErrorState(403, 'Forbidden', 'You do not have permission to create this object.');

        const item = await model.create(body);
        return item;
    } catch (error) {
        if (error.name === 'ValidationError') throw new ErrorState(400, 'ValidationError', error.message);
        if (error.name === 'CastError') throw new ErrorState(400, 'Invalid data type for field', error.message);
        if (error.name === 'ErrorState') throw error;
        throw new ErrorState(500, 'Internal Server Error', error.message);
    }
}

const updateService = async (model, owner, body, _id) => {
    if (!_id) throw new ErrorState(400, 'Bad Request', 'The _id is required.');
    if (Object.prototype.toString.call(body) !== '[object Object]') throw new ErrorState(400, 'Bad Request', 'The body must be an Object with valid attributes.');
    if (Object.keys(body).length === 0) throw new ErrorState(400, 'Bad Request', 'The body must be a non-empty.');

    try {
        const user = await model.findById(_id);
        if (!user) throw new ErrorState(404, 'Not Found', `User with _id '${_id}' not found.`);

        if(user._id.toString() !== owner ) throw new ErrorState(403, 'Forbidden', 'You do not have permission to modify this user.');

        const forbiddenFields = ['_id', 'email', 'status', 'createdAt', 'updatedAt'];
        for (const field of forbiddenFields) {
            if (field in body) throw new ErrorState(400, 'Bad Request', `The attribute '${field}' cannot be modified.`);
        }

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

// No se usa
const deleteService = async (model, owner, _id) => {
    if (!_id) throw new ErrorState(400, 'Bad Request', 'The _id is required.');

    try {
        const object = await model.findById(_id);
        if (!object) throw new ErrorState(404, 'Not Found', `Object with _id '${_id}' not found.`);

        const access = await toMutate(owner, object, 'delete');
        if (!access) throw new ErrorState(403, 'Forbidden', 'You do not have permission to delete this object.');

        const item = await model.findByIdAndDelete(_id);
        return item;
    } catch (error) {
        if (error.name === 'ValidationError') throw new ErrorState(400, 'ValidationError', error.message);
        if (error.name === 'CastError') throw new ErrorState(400, 'Invalid data type for field', error.message);
        if (error.name === 'ErrorState') throw error;
        throw new ErrorState(500, 'Internal Server Error', error.message);
    }
}

const services = { findService, createService, updateService, deleteService };
module.exports = services;