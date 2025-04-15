const mongoose = require('mongoose');
const { Schema } = mongoose;

const objectTypes = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    parent: { type: String, ref: "ObjectTypes", default: null },
    owner: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    tags: {
        type: Schema.Types.Mixed,
        default: [],
        validate: {
            validator: function (tags) {
                if (tags == null) return true;
                if (!Array.isArray(tags)) return false;
                return tags.every(tag => typeof tag === "string");
            },
            message: "Tags must be an array of strings or undefined/null (will default to [])"
        }
    },
    schema: {
        type: Map,
        of: Schema.Types.Mixed,
        default: {},
        validate: {
            validator: function (v) {
                if (!v || typeof v !== 'object') return true;
                const validTypes = ["string", "number", "boolean", "array", "object"];
                for (const key in v) {
                    const value = v[key];
                    const type = Array.isArray(value) ? "array" : typeof value;
                    if (!validTypes.includes(type)) {
                        return false;
                    }
                }
                return true;
            },
            message: "Schema properties must be valid types (string, number, boolean, array, object)."
        }
    }
}, {
    timestamps: true,
    strict: 'throw'
});

//owner: { type: String, ref: "Objects", required: true }

const ObjectTypeModel = mongoose.model('ObjectTypes', objectTypes);

module.exports = ObjectTypeModel;