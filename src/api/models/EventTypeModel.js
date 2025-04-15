const mongoose = require('mongoose');
const { Schema } = mongoose;

const dateTimeSchema = new mongoose.Schema({
    timestamp: { type: Number },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
    time: {
        type: String,
        validate: {
            validator: v => /^\d{2}:\d{2}:\d{2}$/.test(v),
            message: props => `${props.value} no tiene formato hh:mm:ss`
        }

    }
}, { _id: false });


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

const eventSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    parent: { type: String, ref: "EventTypes", default: null },
    owner: { type: String },
    status: {
        type: String,
        enum: {
            values: ["pending", "inProgress", "finished", "cancelled"],
            message: "Status must be one of the following values: 'pending', 'inProgress', 'finished', or 'cancelled'"
        },
        default: "pending",
        required: true
    },
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
    },
    dateTime: {
        type: dateTimeSchema,
        default: getNowDateTime
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

const EventTypeModel = mongoose.model('EventTypes', eventSchema);
module.exports = EventTypeModel;
