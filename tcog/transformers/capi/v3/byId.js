'use strict';

const capi = require('./capi'),
    conf = require('./../../../conf'),
    middleware = require('./../../../lib/middleware');

module.exports = (resource, path) => {
    const resourceFn = (req, res, next) => {
        path = (path && path.replace(':id', req.params.id)) || `/v3/${resource}/${req.params.id}`;

        const data = {
            query: {
                api_key: conf.products[res.locals.product.name].capiV3APIKey || conf.capiV3APIKey
            },
            url: conf.capiV3API + path
        };

        capi(data, (err, result) => {
            if (err) return next(err);

            res.locals.data = result.data;
            res.locals.statusCode = result.statusCode;

            for (const header of Object.keys(result.headers)) {
                const value = result.headers[header];

                if (value) {
                    res.setHeader(header, value);
                }
            }

            next();
        });
    };

    return [middleware.product, resourceFn, middleware.templateHandler('default')];
};
