'use strict';

module.exports = function(json = JSON) {
    /**
     * @ngdoc function
     * @name toJSON
     *
     * @description
     * Ensure that local data is transformed to JSON since S3 does not
     * return the correct content-type
     *
     * @param {object}   req   standard express/http request object
     * @param {object}   res   standard express/http response object
     * @param {function} next  Callback to continue chain
     *
     */
    return function(req, res, next) {
        var data = res.locals.data;

        if (data && typeof data === 'object' || !data) {
            return next();
        }

        try {
            res.locals.data = json.parse(res.locals.data);
        } catch (err) {
            return next(err);
        }

        next();
    };
};
