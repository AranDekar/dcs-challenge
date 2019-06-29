module.exports = function(JSON, npath, logger, loader, helpers, responder) {
    /**
    * @ngdoc function
    * @name render
    *
    * @description
    * Facade used for loading templates.
    *
    * @param {object}   req    The HTTP request, as represented by express
    * @param {object}   res    The HTTP response, as represented by express
    * @param {function} next   The express-provided callback for signalling
    *                          that the next middleware in the stack should be
    *                          executed.
    *
    * @param {string}   view   The template requested to be used for rendering
    * @param {object}   data   The data to be applied to the view for rendering
    *
    * @returns  {null}  null
    *
    */

    var self = function render(req, res, next, view, data) {
        var format = res.locals &&
                     res.locals.config &&
                     res.locals.config['output'] || 'html',

            defaultViewPath,
            sendPayload,
            parseError;

        // bypass render cycle for valid raw JSON responses

        if (format === 'json') {
            sendPayload = self.sendPayload(req, res, next, 'JSON');

            try {
                data = JSON.stringify(data);
            } catch (err) {
                parseError = err;
            }

            return sendPayload(parseError, data);
        }

        // process normal views, which will likely return a html response
        defaultViewPath = npath.join(__dirname, '../../views/common');
        sendPayload = self.sendPayload(req, res, next, view);

        loader(defaultViewPath, view, data, sendPayload);
    };

    /**
    * @ngdoc function
    * @name sendPayload
    *
    * @description
    * Send a payload, caching if necessary.
    *
    * @param {object}   req         The HTTP request, as represented by express
    * @param {object}   res         The HTTP response, as represented by express
    * @param {function} next        The express-provided callback for signalling
    *                               that the next middleware in the stack should be
    *                               executed.
    * @param {string}   view        The name of the view
    *
    * @param {object}   err         Standard error oject
    * @param {string}   payload     HTML or JSON string
    *
    * @returns  {null}  null
    *
    */

    self.sendPayload = function(req, res, next, view) {
        return function(err, payload) {
            if (err) {
                logger.error({
                    'error': err.message,
                    'url': req.url,
                    'tcogProduct': res.locals &&
                                   res.locals.product ? res.locals.product.name : null
                }, 'Failed to render playload.');

                return next(err);
            }

            helpers.cacheIfOk(req.url, res.statusCode, payload);
            helpers.responder.respond(req, res, payload, res.statusCode);
        };
    };

    return self;
};
