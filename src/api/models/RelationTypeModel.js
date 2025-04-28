const mongoose = require('mongoose');
const { Schema } = mongoose;

const RelationTypeSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    owner: { type: String, required: true, index: true },
    status: { 
        type: String,
        index: true, 
        enum: { 
            values: ["active", "inactive"], 
            message: "The status can only be 'active' or 'inactive'." 
        }, 
        default: "active" 
    },
    parent: {
        type: String,
        index: true,
        default: null,
        ref: "RelationTypes",
        validate: {
            validator: async function (v) {
                if (v === null) return true;
                const doc = await mongoose.model("RelationTypes").findById(v);
                return doc !== null;
            },
            message: "Parent not found."
        }
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
    schema: {
        type: Map,
        of: String,
        default: {},
        required: true,
        validate: {
            validator: function (schemaMap) {
                const allowedTypes = ["string", "number", "boolean", "array", "object"];
                
                for (const [propertyName, type] of schemaMap) {
                    if (!allowedTypes.includes(type)) {
                        throw new Error(`The type "${type}" on "${propertyName}" is an invalid type. Valid types: ${allowedTypes.join(", ")}`);
                    }
                    if (!/^[a-z0-9_]+$/.test(propertyName)) {
                        throw new Error(`The name: "${propertyName}" is an invalid name. Valid names must only contain lowercase letters, numbers, and underscores.`);
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

const RelationTypeModel = mongoose.model('RelationTypes', RelationTypeSchema);
module.exports = RelationTypeModel;