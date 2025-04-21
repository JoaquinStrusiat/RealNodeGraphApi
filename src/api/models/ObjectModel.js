const mongoose = require('mongoose');
const { Schema } = mongoose;

const ObjectsSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    owner: { type: String, required: true },
    reference: {
        type: String,
        default: null,
        ref: "Objects",
        validate: {
            validator: async function (v) {
                if (v === null) return true;
                const doc = await mongoose.model("Objects").findById(v);
                return doc !== null;
            },
            message: "Reference not found."
        }
    },
    type: {
        type: String,
        required: true,
        ref: "ObjectTypes",
        validate: {
            validator: async function (v) {
                if (v === null) return true;
                const doc = await mongoose.model("ObjectTypes").findById(v);
                return doc !== null;
            },
            message: "Types not found."
        }
    },
    status: { 
        type: String, 
        enum: { 
            values: ["active", "inactive"], 
            message: "The status can only be 'active' or 'inactive'." 
        }, 
        default: "active" 
    },
    tags: {
        type: Schema.Types.Mixed,
        default: [],
        required: true,
        validate: {
            validator: function (tags) {
                if (tags == null) return true;
                if (!Array.isArray(tags)) return false;
                return tags.every(tag => typeof tag === "string");
            },
            message: "Tags must be an array of strings."
        }
    },
    props: {
        type: Map,
        of: Schema.Types.Mixed,
        default: {},
        required: true,
        validate: {
            validator: async function (propsMap) {
                const eventType = await mongoose.model("ObjectTypes").findById(this.type);
                if (!eventType) throw new Error("ObjectTypes not found.");

                const schemaDefinition = eventType.schema;
                for (const [propName, propValue] of propsMap) {
                    if (!schemaDefinition.has(propName)) {
                        throw new Error(`Property "${propName}" is not defined in the schema of Type.`);
                    }

                    const expectedType = schemaDefinition.get(propName);
                    const actualType = Array.isArray(propValue) ? "array" : typeof propValue;

                    if (expectedType === "array" && !Array.isArray(propValue)) {
                        throw new Error(`"${propName}" must be an array.`);
                    } else if (expectedType !== "array" && actualType !== expectedType) {
                        throw new Error(`"${propName}" must be of type ${expectedType}.`);
                    }
                }
                return true;
            },
            message: props => props.reason.message
        }
    }
}, {
    timestamps: true,
    strict: 'throw'
});

const ObjectsModel = mongoose.model('Objects', ObjectsSchema);
module.exports = ObjectsModel;
