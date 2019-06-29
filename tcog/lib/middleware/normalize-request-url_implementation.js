/**
 * @function implementation
 * Factory for creating a the normalizeUrlMiddleware middleware
 *
 * @returns {Function}    http middleware
 */

module.exports = function implementation() {
    /**
     * @ngdoc function
     * @name normalizeRequestUrlMiddleware
     *
     * @description
     * Normalises the request url appending request headers which should
     * be used as part of the cache key generation
     *
     * @param {object}      req   Standard HTTP/Express request object
     * @param {object}      res   Standard HTTP/Express response object
     * @param {function}    next  Callback
     *
     */

    return function normalizeRequestUrlMiddleware(req, res, next) {
        var params = [],
            badRequest = req.headers['x-tcog-product'] && ~req.url.indexOf('t_product') ||
                         req.headers['x-tcog-template'] && ~req.url.indexOf('t_template');

        if (badRequest) {
            res.statusCode = 400;
            return res.end(
                'Ambigious parameter usage: use either x-tcog-headers or query params, not both'
            );
        }

        if (req.headers['x-tcog-product']) {
            params.push('t_product=' + req.headers['x-tcog-product']);
        }

        if (req.headers['x-tcog-template']) {
            params.push('t_template=' + req.headers['x-tcog-template']);
        }

        // flag that this request came via akamai and we have a
        // valid product so that it can be enforced.
        if (req.isAkamai && req.headers['x-tcog-product']) {
            params.push('t_trouter=true');
            res.locals.config.trouter = true;
        }

        if (params.length) {
            req.url += ~req.url.indexOf('?') ? '&' : '?';
            req.url += params.join('&');
        }

        next();
    };
};
