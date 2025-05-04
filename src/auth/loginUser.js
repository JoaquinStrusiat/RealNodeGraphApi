const UserModel = require('../api/models/UserModel');
const hashPassword = require('../utils/hashString');
const jsonWebToken = require('../utils/jsonWebToken');

const loginUser = async (req, res) => {
    const { path, method, body } = req;
    const { email, password } = body;
    const response = { path, method };

    try{
        if (!email) throw new Error('Email is required');
        if (!password) throw new Error('Password is required');

        const hashedPassword = await hashPassword(password);

        const user = await UserModel.findOne({ email });
        if (!user) throw new Error('User not found');

        if (user.password !== hashedPassword) throw new Error('Incorrect password');

        const token = jsonWebToken.generateToken({ _id: user._id }, '7d');

        response.ok = {message: 'Login successful', token };
        return res.status(200).json(response);

    } catch (error){
        response.error = { message: error.message };
        return res.status(400).json(response);
    }
}

module.exports = loginUser 