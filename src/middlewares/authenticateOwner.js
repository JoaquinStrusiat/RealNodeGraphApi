const jsonwebtoken = require('../utils/jsonWebToken'); 

const authenticateOwner = (req, res, next) => {
    const { path, method, headers: { authorization} } = req;
    const response = { path, method };

    if(!authorization) return res.status(401).send({error: { message: 'Authorization key not provided' }});

    try{
        const owner = jsonwebtoken.verifyToken(authorization);
        res.owner = owner._id;
        next()
    } catch(error){
        response.error = { title: 'Invalid Token or expired', message: error.message };
        return res.status(400).json(response);
    }
}

module.exports = authenticateOwner;