const ObjectTypeModel = require("./ObjectTypeModel");

const findTypesService = async (userKey, body) => {
    if(!Array.isArray(body)){
        throw new Error("The body must be an array with 'Pipeline stages'")
    } else {
        body.unshift({ $match: { owner: { $eq: userKey } } })
        try {
            const items = await ObjectTypeModel.aggregate(body);
            const count = await ObjectTypeModel.countDocuments(body);
            return { items, count };
        } catch (err) {
            throw err;
        }
    }
};

const createTypeService = async (userKey, body) => {
    if (Object.prototype.toString.call(body) !== '[object Object]') {
        throw new Error("The body must be an object")
    } else if (body.schema) {
        if (Object.prototype.toString.call(body.schema) !== '[object Object]') {
            throw new Error("The 'schema' must be an object.");
        } else {
            for (const key in body.schema) {
                const value = body.schema[key];
                if (typeof value !== "string" || !validTypes.includes(value)) {
                    throw new Error(`Error in '${key}': '${value}' is not a valid data type.`);
                }
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

/* Mejorar esto
const validateObjectInstance = (objectType, instanceData) => {
    for (const key in objectType.schema) {
        const expectedType = objectType.schema[key];
        const actualValue = instanceData[key];

        // Validar tipo real del dato
        if (expectedType === "array" && !Array.isArray(actualValue)) {
            throw new Error(`El campo '${key}' debe ser un array.`);
        }
        if (expectedType !== "array" && typeof actualValue !== expectedType) {
            throw new Error(`El campo '${key}' debe ser de tipo '${expectedType}', pero recibió '${typeof actualValue}'.`);
        }
    }
};
*/

const updateTypeService = async (userKey, body, _id) => {

    if (!_id) {
        throw new Error("The _id is required")
    } else if (Object.prototype.toString.call(body) !== '[object Object]') {
        throw new Error("The body must be an object")
    } else {   
        const objectType = await ObjectTypeModel.findById(_id);
        if (!objectType) {
            throw new Error("The object type does not exist");
        }
        if (objectType.owner !== userKey) {
            throw new Error("You are not the owner of this object type");
        }

        if (body.schema) {
            if (Object.prototype.toString.call(body.schema) === '[object Object]') {
                for (const key in body.schema) {
                    const value = body.schema[key];
                    if (typeof value !== "string" || !validTypes.includes(value)) {
                        throw new Error(`Error in '${key}': '${value}' is not a valid type. Valid types are: ${validTypes.join(", ")}`);
                    }
                }
            } else {
                throw new Error("The schema must be an object");
            }
        }

    }

}


module.exports = { findTypesService, createTypeService }