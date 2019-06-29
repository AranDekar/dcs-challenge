'use strict';

const capi = require('./capi'),
    conf = require('./../../../conf'),
    middleware = require('./../../../lib/middleware');

module.exports = (search) => {
    const searchFn = (req, res, next) => {
        const query = {
                api_key: conf.products[res.locals.product.name].capiV3APIKey || conf.capiV3APIKey
            },
            data = {
                query: Object.assign(req.query, query),
                url: `${conf.capiV3API}/v3/${search}`
            };

        capi(data, (err, result) => {
            if (err) return next(err);

            res.locals.data = result.data;

            for (const header of Object.keys(result.headers)) {
                res.setHeader(header, result.headers[header]);
            }

            next();
        });
    };

    return [middleware.product, searchFn, middleware.templateHandler('default')];
};
