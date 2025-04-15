const verifyBodyMiddleware = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: "Body JSON inválido" });
    }
    next(); // Pasar el error al siguiente middleware si no es un error de parsing del body
};

const keyAuthMiddleware = (req, res, next) => {
    const apiKey = req.headers['api-key'];
    if (!apiKey) {
        return res.status(401).send({
            err: 'API Key not provided',
            details: "Include the API Key in the header: 'api-key'"
        })
    } else {
        req.userKey = apiKey;
        next()
    }
}

const injectModelMiddleware = (model) => (req, res, next) => {
    if (!model) {
      return res.status(500).json({ error: 'Model not provided' });
    }
    req.model = model;
    next();
  };


module.exports = { verifyBodyMiddleware, keyAuthMiddleware, injectModelMiddleware };