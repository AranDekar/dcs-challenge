'use strict';

const _ = require('lodash'),
    get = require('../get'),
    crypto = require('crypto');

_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

module.exports = function agentMiddleware(urlTemplate) {
    return function(req, res, next) {
        const url = _.template(urlTemplate)(req),
            id = crypto.createHash('md5').update(req.path).digest('hex');

        res.locals.headers['X-Cache-Tags'] = `R:${id}`;

        get(url, {}, (err, data) => {
            if (err) {
                return next(err);
            }

            try {
                const body = JSON.parse(data.body);
                res.locals.data = body;

                next();
            } catch (err) {
                return next(err);
            }
        });
    };
};
