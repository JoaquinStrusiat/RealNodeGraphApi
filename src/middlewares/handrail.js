const handrail = (obj) => (req, res, next) => {
    Object.assign(req, obj);
    next();
};

module.exports = handrail;