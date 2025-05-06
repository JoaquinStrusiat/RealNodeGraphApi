const ErrorState = require('./ErrorState');
const UserModel = require('../api/models/UserModel');

const validateAdmin = async (owner) => {
    const EMAIL = process.env.EMAIL;
    try{
        if (!EMAIL) throw new ErrorState(500, 'Internal Server Error', 'The value "EMAIL" is required in the .env file')
        const user = await UserModel.findById(owner)
        if (!user) throw new ErrorState(404, 'Not Found', 'The user was not found');
        if (user.email !== EMAIL) throw new ErrorState(403, 'Forbidden', 'You do not have permission to perform this action.');
    } catch(error){
        if(error.name === 'ErrorState') throw error;
        throw new ErrorState(500, 'Internal Server Error', error.message);
    }
}

module.exports = validateAdmin;