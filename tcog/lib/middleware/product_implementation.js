module.exports = function(config, logger) {
    /**
     * @ngdoc function
     * @name productMiddleware
     *
     * @description
     * Determines if we have a valid product and if so assigns this to locals
     *
     * @param {object}      req   Standard HTTP/Express request object
     * @param {object}      res   Standard HTTP/Express response object
     * @param {function}    next  Callback
     *
     */

    return function productMiddleware(req, res, next) {
    // Let product analytics know we've looked for a product
        res.productScanned = true;

        var product,
            productName =
                req.query['t_product'] ||
                req.headers['x-tcog-product'] ||
                req.query['product'];

        if (!productName) {
            return next();
        }

        product = config.products[productName];

        if (!product) {
            return next();
        }

        product = Object.create(product);

        logger.debug('Product identified: ' + productName);

        res.locals.product = product;
        res.locals.product.name = productName;

        next();
    };
};
