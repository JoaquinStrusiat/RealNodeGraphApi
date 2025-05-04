const mongoose = require('mongoose');
const { Schema } = mongoose;

const UsersSchema = new Schema({
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true, index: true },
    name: { type: String, required: true },
    last_name: { type: String, required: true },
    image: { type: String, default: "" },
    birthdate: { type: Date, default: null},
    phone: { type: String, default: "" },
    status: { 
        type: String,
        index: true,
        enum: {
            values: ["active", "inactive"],
            message: "The status can only be 'active' or 'inactive'."
        },
        default: "active"
    },
},{
    timestamps: true,
    strict: 'throw'
});

const UserModel = mongoose.model('Users', UsersSchema);
module.exports = UserModel;