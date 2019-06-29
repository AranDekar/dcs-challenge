'use strict';

const _ = require('lodash');

module.exports = function(products) {
    // get a list of valid domains from products, these will be used to determine
    // if varients based on environments are also valid

    const allowedDomains = Object.keys(products).filter(function(product) {
        return products[product].domain;
    }).map(function(product) {
        return products[product].domain;
    });

    /**
     * @ngdoc function
     * @name domainGuardMiddleware
     *
     * @description
     * Guards the request ensuring we have a valid domain which is allowed
     * to fetch content
     *
     * @param {object}      req   Standard HTTP/Express request object
     * @param {object}      res   Standard HTTP/Express response object
     * @param {function}    next  Callback
     *
     */

    return function domainGuardMiddleware(req, res, next) {
        const productDomain = res.locals.product.domain,
            overrideDomain = res.locals.config.domain,
            domain = overrideDomain || productDomain,

            // normalise the domain value for compare, this is to allow
            // effective comparison of domains minus un-needed info

            isValid = domain &&
                      domain.replace(/^(www|m|mobile|dev|sit|sit2|uat|ls|alpha|beta)\./, '')
                          .replace(/(dev|sit|sit2|uat|ls|alpha|beta)\b/, '');

        if (!allowedDomains.includes(isValid)) {
            res.writeHead(400);
            return res.end('A valid domain is required.');
        }

        // make domain value available to subsequent
        // middleware

        res.locals.config.domain = domain;

        next();
    };
};
