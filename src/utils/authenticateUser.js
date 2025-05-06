const jsonwebtoken = require('./jsonWebToken');
const ErrorState = require('./ErrorState');

const authenticateUser = async (jwt) => {
    try {
        if (!jwt) throw new ErrorState(401, 'Unauthorized','Missing authorization header, please login first');
        const owner = jsonwebtoken.verifyToken(jwt);
        return owner._id;
    } catch (error) {
        if(error.name === "ErrorState") throw error;
        throw new ErrorState(401, 'Unauthorized', error.message);
    }
}

module.exports = authenticateUser;