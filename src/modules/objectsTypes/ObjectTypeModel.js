const mongoose = require('mongoose');
const { Schema } = mongoose;

const objectsTypes = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    parent: { type: String, ref: "ObjectsTypes", default: null },
    owner: { type: String },
    schema: { type: Object, default: {} }
}, { 
    timestamps: true,
    strict: 'throw'
});

//owner: { type: String, ref: "Objects", required: true }

const ObjectTypeModel = mongoose.model('ObjectsTypes', objectsTypes);

module.exports = ObjectTypeModel;