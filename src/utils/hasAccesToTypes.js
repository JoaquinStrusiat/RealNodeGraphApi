const EMAIL = process.env.EMAIL;
const ErrorState = require('./ErrorState');
const UserModel = require('../api/models/UserModel');

const hasAccessToTypes = async (owner) => {
    if (!EMAIL) throw new ErrorState(500, 'Internal Server Error', 'The value "EMAIL" is required in the .env file')
    
    try{
        const user = await UserModel.findById(owner)
        if (!user) throw new ErrorState(404, 'Not Found', 'The user was not found');
        
        if (user.email !== EMAIL) return false;
        
        return true;
    } catch(error){
        if(error.name === 'ErrorState') throw error;
        throw new ErrorState(500, 'Internal Server Error', error.message);
    }
}

module.exports = hasAccessToTypes;