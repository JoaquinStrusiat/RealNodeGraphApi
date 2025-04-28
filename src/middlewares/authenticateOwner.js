const authenticateOwner = (req, res, next) => {
    const key = req.headers.authorization;
    if (!key) {
        return res.status(401).send({
            err: 'Authorization key not provided',
            details: "Include the Authorization in the header: 'Authorization': 'your_api_key_here"
        })
    } else {
        req.owner = key;
        next()
    }
}

module.exports = authenticateOwner;