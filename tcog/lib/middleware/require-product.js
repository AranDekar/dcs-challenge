module.exports = function(req, res, next) {
    if (!res.locals.product || !res.locals.product.name) {
        res.statusCode = 403;
        return res.end('Missing or invalid product identifier.');
    }

    next();
};
