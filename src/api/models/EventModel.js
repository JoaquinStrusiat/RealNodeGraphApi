const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventsSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    owner: { type: String, required: true, index: true },
    reference: {
        type: String,
        index: true,
        default: null,
        ref: "Events",
        validate: {
            validator: async function (v) {
                if (v === null) return true;
                const doc = await mongoose.model("Events").findById(v);
                return doc !== null;
            },
            message: "Reference not found."
        }
    },
    type: {
        type: String,
        index: true,
        required: true,
        ref: "EventTypes",
        validate: {
            validator: async function (v) {
                if (v === null) return true;
                const doc = await mongoose.model("EventTypes").findById(v);
                return doc !== null;
            },
            message: "Types not found."
        }
    },
    status: {
        type: String,
        index: true,
        enum: {
            values: ["pending", "inProgress", "finished", "cancelled"],
            message: "The status can only be one of the following values: 'pending', 'inProgress', 'finished', or 'cancelled'."
        },
        default: "pending"
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
                const eventType = await mongoose.model("EventTypes").findById(this.type);
                if (!eventType) throw new Error("EventType not found.");

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
    },
    duration: {
        start: {
            type: Date,
            default: null
        },
        end: {
            type: Date,
            default: null
        }
    }
}, {
    timestamps: true,
    strict: 'throw'
});

const EventTypeModel = mongoose.model('Events', EventsSchema);
module.exports = EventTypeModel;

