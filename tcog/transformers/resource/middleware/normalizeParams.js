'use strict';

module.exports = function(resources = require('../../../conf').api.resource) {
    /**
     * @ngdoc function
     * @name normalizeParams
     *
     * @description
     * Determines if the requested resource needs to be handled differently
     * based upon its the path.
     *
     * The first part of the path may map to a custom url which needs to be used
     * to fetch the remote JSON.
     *
     * eg:
     *
     * 		/<type>/foo/test/index.json
     * 		/cs/foo/test/index.json
     *
     * cs = http://some.com.au/remote/
     *
     * @param {object}   req   standard express/http request object
     * @param {object}   res   standard express/http response object
     * @param {function} next  Callback to continue chain
     *
     */
    return function(req, res, next) {
        var defaultResource = 'cs';

        var path = req.params &&
                    req.params[0] &&
                    req.params[0].replace(/^\//, '').split('/') || [],
            type = path.shift(),
            resource = resources[type];

        if (!resource) {
            path.unshift(type);
            resource = resources[defaultResource];
        }

        // update type parameter to reflect
        // current request

        req.params.resource = resource.url || resource;
        req.params.path = path.join('/');
        req.params.contentType = resource.contentType;

        next();
    };
};
