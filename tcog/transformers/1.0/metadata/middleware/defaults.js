// Add our tcog defaults
module.exports = function(req, res, next) {
    if (!req.query.appBundleId) { req.query.appBundleId = 'tcog.core'; }

    if (!req.query.appVersion) { req.query.appVersion = '0.1.0'; }

    if (req.query.key && !req.query.appPart) { req.query.appPart = req.query.key; }

    delete req.query.key;

    next();
};
