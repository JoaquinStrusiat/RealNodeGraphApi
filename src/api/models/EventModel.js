const mongoose = require('mongoose');
const { Schema } = mongoose;

const dateTimeSchema = new mongoose.Schema({
    timestamp: { type: Number, default: null},
    year: { type: Number, default: null },
    month: { type: Number, default: null },
    day: { type: Number, default: null },
    time: {
        type: String,
        required: true,
        validate: {
            validator: v => /^\d{2}:\d{2}:\d{2}$/.test(v),
            message: props => `${props.value} no tiene formato hh:mm:ss`
        }
    }
}, { _id: false, strict: 'throw' });


const getNowDateTime = () => {
    const now = new Date();
    return {
        timestamp: now.getTime(),
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        time: now.toTimeString().split(" ")[0]
    };
}

const EventsSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    reference: {
        type: String,
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
    owner: { type: String, required: true },
    status: {
        type: String,
        enum: {
            values: ["pending", "inProgress", "finished", "cancelled"],
            message: "The status can only be one of the following values: 'pending', 'inProgress', 'finished', or 'cancelled'."
        },
        default: "pending"
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
    dateTime: {
        type: dateTimeSchema,
        default: getNowDateTime,
        required: true
    },
    duration: {
        start: {
            type: dateTimeSchema,
            default: null
        },
        end: {
            type: dateTimeSchema,
            default: null
        }
    }
}, {
    timestamps: true,
    strict: 'throw'
});

const EventTypeModel = mongoose.model('Events', EventsSchema);
module.exports = EventTypeModel;
