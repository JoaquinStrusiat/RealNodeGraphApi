const findService = async (model, userKey, body) => {
    if (!Array.isArray(body)) {
        throw new Error("The body must be an array with 'Pipeline stages'.")
    }

    body.unshift({ $match: { owner: { $eq: userKey } } })

    try {
        const items = await model.aggregate(body);
        return items;
    } catch (err) {
        if (err.name === 'ValidationError') {
            throw new Error(`Validation error: ${err.message}`);
        }
        if (err.name === 'CastError') {
            throw new Error(`Invalid data type for field: ${err.path}`);
        }
        throw err;
    }
};

const createService = async (model, userKey, body) => {
    if (Object.prototype.toString.call(body) !== '[object Object]') {
        throw new Error("The body must be an Object with valid attributes.")
    }

    const forbiddenFields = ['owner', 'createdAt', 'updatedAt', 'dateTime'];
    for (const field of forbiddenFields) {
        if (field in body) {
            throw new Error(`The attribute '${field}' cannot be modified.`);
        }
    }

    try {
        body.owner = userKey;
        const item = await model.create(body);
        return item;
    } catch (err) {
        if (err.name === 'ValidationError') {
            throw new Error(`Validation error: ${err.message}`);
        }
        if (err.name === 'CastError') {
            throw new Error(`Invalid data type for field: ${err.path}`);
        }
        throw err;
    }
}

const updateService = async (model, userKey, body, _id) => {
    if (!_id) throw new Error("The _id is required.");

    if (Object.prototype.toString.call(body) !== '[object Object]') {
        throw new Error("The body must be an Object with valid attributes.");
    }
    if (Object.keys(body).length === 0) {
        throw new Error("The body must be a non-empty.");
    }

    const forbiddenFields = ['_id', 'owner', 'createdAt', 'updatedAt'];
    for (const field of forbiddenFields) {
        if (field in body) {
            throw new Error(`The attribute '${field}' cannot be modified.`);
        }
    }

    try {
        const object = await model.findOne({ owner: userKey, _id });

        if (!object) throw new Error(`Type '${_id}' not found.`);

        const item = await model.findByIdAndUpdate(_id, { $set: body }, {
            new: true,              // devuelve el documento actualizado
            runValidators: true,    // valida el body contra el esquema de Mongoose
            context: 'query',       // necesario para algunas validaciones (por ej., validators personalizados)
            upsert: false,          // NO crea un nuevo documento si no existe
            optimisticConcurrency: true
        });

        return item;

    } catch (err) {
        if (err.name === 'ValidationError') {
            throw new Error(`Validation error: ${err.message}`);
        }
        if (err.name === 'CastError') {
            throw new Error(`Invalid data type for field: ${err.path}`);
        }
        throw err;
    }
};

const deleteService = async (model, userKey, _id) => {
    if (!_id) throw new Error("The _id is required.");

    try {
        const item = await model.findOneAndDelete({ owner: userKey, _id });
        if (!item) throw new Error(`Type '${_id}' not found.`);
        return item;
    } catch (err) {
        if (err.name === 'ValidationError') {
            throw new Error(`Validation error: ${err.message}`);
        }
        if (err.name === 'CastError') {
            throw new Error(`Invalid data type for field: ${err.path}`);
        }
        throw err;
    }
}

const services = { findService, createService, updateService, deleteService };

module.exports = services;
