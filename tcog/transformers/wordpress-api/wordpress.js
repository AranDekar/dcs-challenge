'use strict';

const queryString = require('query-string'),
    interpret = require('./template-interpreter'),
    get = require('../get');

module.exports = function wordpressHTMLMiddleware(baseUrl, contentType, agent = get) {
    return function(req, res, next) {
        const sppAPIUrl = interpret(baseUrl, req);
        const url = `${sppAPIUrl}?${queryString.stringify(res.locals.query)}`;
        const headers = {
            ndmesidebug: '654321',
            'Accepts': contentType,
            'Content-Type': contentType
        };

        agent(url, headers, (err, msg) => {
            if (err) {
                return next(err);
            };

            try {
                const body = msg.body;

                if (msg.headers['x-cache']) {
                    res.locals.headers['X-Cache'] = msg.headers['x-cache'];
                }

                if (msg.headers['x-cache-tags']) {
                    res.locals.headers['X-Cache-Tags'] = msg.headers['x-cache-tags'];
                }

                res.locals.data = body;

                next();
            } catch (err) {
                return next(err);
            }
        });
    };
};
