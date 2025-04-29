const bodyFormatVerificate = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: "Body JSON inválido" });
    }
    next(); 
};

module.exports = bodyFormatVerificate;