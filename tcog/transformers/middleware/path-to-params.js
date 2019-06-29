module.exports = function pathToParams(req, res, next) {
    req.params = {0: req.path};
    next();
};
