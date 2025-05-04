const jwt = require('jsonwebtoken');

const generateToken = (payload, expiresIn = '1h') => {
    const TOKEN = process.env.JWTSECRET;
    return jwt.sign(payload, TOKEN, { expiresIn });
};

const verifyToken = (token) => {
    const TOKEN = process.env.JWTSECRET;
    return jwt.verify(token, TOKEN);
};

module.exports = { generateToken, verifyToken };
