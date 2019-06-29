'use strict';

module.exports = function(npath = require('path')) {
    /**
     * @ngdoc function
     * @name guard
     *
     * @description
     * Ensure only a document of type JSON is allowed to be requested
     *
     * @param {object}   req   standard express/http request object
     * @param {object}   res   standard express/http response object
     * @param {function} next  Callback to continue chain
     *
     */
    return function(req, res, next) {
        if (req.params.contentType === 'application/json') {
            return next();
        }

        var path = req.params && req.params.path,
            ext = path && npath.extname(path),
            isJSON = ext && ext === '.json';

        if (isJSON) {
            return next();
        }

        if (!res.ended) {
            // If a json document is not specified, return a 400
            res.writeHead(400);
            res.end('You must specify a ".json" document.');
        }
    };
};
