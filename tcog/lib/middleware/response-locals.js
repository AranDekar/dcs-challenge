// TCOG needs this object set and used another middleware (requestInitialiser) to set it.
// That middleware has been deleted. We'll use this in the interests of being explicit.

module.exports = (req, res, next) => {
    res.locals = {
        headers: {},
        data: {},
        display: {},
        config: {},
        query: {}
    };
    next();
};
