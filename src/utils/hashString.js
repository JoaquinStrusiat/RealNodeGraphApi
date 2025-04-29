const crypto = require('crypto');

const hashString = async (text) => {
    return crypto.createHash('sha256').update(text).digest('hex');
}

module.exports = hashString;