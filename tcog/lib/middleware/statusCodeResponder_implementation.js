module.exports = function(logger) {
    /**
     * @ngdoc function
     * @name statusCodeResponder
     *
     * @description
     * Creates a middleware for a specified status code, with optional support
     * for a template to also be returned.
     *
     * @param {number} statusCode    The HTTP status code
     * @param {object} template      Object represending template options
     *
     * @return {function}
     *
     */

    function statusCodeResponder(statusCode, template) {
        if (!statusCode && typeof statusCode !== 'number') {
            throw new Error('A numerical status code is required');
        }

        return function statusCodeResponderMiddleware(/* err, req, res */) {
            var alen = arguments.length,
                errArg = alen === 4,
                level = errArg ? 'fatal' : 'trace',

                req = !errArg ? arguments[0] : arguments[1],
                res = !errArg ? arguments[1] : arguments[2],
                msg = req.path,

                detail;

            // object containing detail to pass
            // through to the logger

            detail = {
                req: req,
                tcogProduct: (res.locals && res.locals.product
                    ? res.locals.product.name : null)
            };

            // we have an error argument available,
            // push this on object

            if (errArg) {
                detail.err = arguments[0] && arguments[0].stack;
            }

            // we have an error argument available,
            // push this on object

            logger[level](detail, statusCode + ' ' +
                (errArg ? (detail.err && detail.err.message ||
                    'Unknown error.') : msg));

            // Don't respond if the request has already ended (pixel)
            if (res.finished) {
                return;
            }

            res.status(statusCode);

            // This status code should return a template

            if (!template) {
                return res.end();
            }

            res.sendFile(template.path, {
                root: template.root
            });
        };
    }

    return statusCodeResponder;
};
