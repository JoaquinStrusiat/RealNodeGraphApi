const ObjectTypeModel = require("./ObjectTypeModel");

const findTypesService = async (userKey, body) => {
    if (!Array.isArray(body)) {
        throw new Error("The body must be an array with 'Pipeline stages'")
    }

    body.unshift({ $match: { owner: { $eq: userKey } } })

    try {
        const items = await ObjectTypeModel.aggregate(body);
        const count = await ObjectTypeModel.countDocuments(body);
        return { items, count };
    } catch (err) {
        throw err;
    }
};

const createTypeService = async (userKey, body) => {
    if (Object.prototype.toString.call(body) !== '[object Object]') {
        throw new Error("The body must be an Array with object types")
    }

    if (body.schema) {
        if (Object.prototype.toString.call(body.schema) !== '[object Object]') {
            throw new Error(`The schema must be an Object`);
        }

        const validTypes = ["string", "number", "boolean", "date", "array", "object"];

        for (const key in body.schema) {
            const value = body.schema[key];
            if (typeof value !== "string" || !validTypes.includes(value)) {
                throw new Error(`The value for '${key}' is not a valid data type: Valid types are: ${validTypes.join(", ")}.`);
            }
        }
    }

    try {
        body.owner = userKey;
        const items = await ObjectTypeModel.create(body);
        return items;
    } catch (err) {
        throw err;
    }
}

const updateTypeService = async (userKey, body, _id) => {
    if (!_id) {
        throw new Error("The _id is required.");
    }

    if (Object.prototype.toString.call(body) !== '[object Object]') {
        throw new Error("The body must be an Object with valid attributes to update.");
    }

    const forbiddenFields = ['_id', 'owner'];
    for (const field of forbiddenFields) {
        if (field in body) {
            throw new Error(`The attribute '${field}' cannot be modified.`);
        }
    }

    try {
        const object = await ObjectTypeModel.findOne({ owner: userKey, _id });

        if (!object) {
            throw new Error(`Type '${_id}' not found`);
        }

        if (body.schema) {
            if (Object.prototype.toString.call(body.schema) !== '[object Object]') {
                throw new Error(`The schema must be an Object`);
            }

            const validTypes = ["string", "number", "boolean", "date", "array", "object"];

            for (const key in body.schema) {
                const value = body.schema[key];
                if (typeof value !== "string" || !validTypes.includes(value)) {
                    throw new Error(`The value for '${key}' is not a valid data type: Valid types are: ${validTypes.join(", ")}.`);
                }
            }
        }

        const item = await ObjectTypeModel.findByIdAndUpdate(_id, body, {
            new: true,              // devuelve el documento actualizado
            runValidators: true,    // valida el body contra el esquema de Mongoose
            context: 'query',       // necesario para algunas validaciones (por ej., validators personalizados)
            upsert: false           // NO crea un nuevo documento si no existe
        });

        return item;

    } catch (err) {
        throw err;
    }
};


module.exports = { findTypesService, createTypeService, updateTypeService }