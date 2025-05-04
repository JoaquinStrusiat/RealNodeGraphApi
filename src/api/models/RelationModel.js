const mongoose = require('mongoose');
const { Schema } = mongoose;

const RelationSchema = new Schema({
    owner: { type: String, required: true, index: true },
    type: {
        type: String,
        index: true,
        required: true,
        ref: "RelationTypes",
        validate: {
            validator: async function (v) {
                if (v === null) return true;
                const doc = await mongoose.model("RelationTypes").findById(v);
                return doc !== null;
            },
            message: "Types not found."
        }
    },
    from:{
        type: String, 
        index: true, 
        required: true
    },
    to: {
        type: String, 
        index: true, 
        required: true
    },
    status: { 
        type: String,
        index: true, 
        enum: { 
            values: ["active", "inactive"], 
            message: "The status can only be 'active' or 'inactive'." 
        }, 
        default: "active" 
    },
    access: { 
        type: String,
        index: true,
        enum: {
            values: ["private", "public"],
            message: "The access can only be 'private' or 'public'."
        },
        default: "private"
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
                const eventType = await mongoose.model("RelationTypes").findById(this.type);
                if (!eventType) throw new Error("RelationTypes not found.");

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

const RelationModel = mongoose.model('Relations', RelationSchema);
module.exports = RelationModel;