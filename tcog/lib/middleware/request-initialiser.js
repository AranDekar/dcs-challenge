var logger = require('../logger'),
    url = require('url');

module.exports = function requestInitialiser(req, res, next) {
    req.query = req.query || url.parse(req.url, true).query;

    next();
};
