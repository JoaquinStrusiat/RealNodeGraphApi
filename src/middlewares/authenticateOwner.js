const jsonwebtoken = require('../utils/jsonWebToken');
const ErrorState = require('../utils/ErrorState');

const authenticateOwner = (req, res, next) => {
    const { path, method, headers: { authorization } } = req;
    const response = { path, method };

    try {
        if (!authorization) throw new ErrorState(401, 'Unauthorized','Missing authorization header, please login first')

        const owner = jsonwebtoken.verifyToken(authorization);

        req.owner = owner._id;
        next()
    } catch (error) {
        if(error.name === "ErrorState") {
            response.error = error.toResponse()
            return res.status(error.statusCode).json(response);
        } else {
            response.error = { title: 'Unauthorized', message: error.message, statusCode: 401 };
            return res.status(400).json(response);
        }
    }
}

module.exports = authenticateOwner;