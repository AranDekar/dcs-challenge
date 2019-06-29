'use strict';

const get = require('../../get');

module.exports = function capiPopularContentAgent(baseUrl, query, agent = get, cb) {
    let url;

    if (query.length === 0) {
        url = baseUrl;
    } else {
        url = `${baseUrl}?${query}`;
    }

    get(url, { 'Content-Type': 'application/json' }, (err, msg) => {
        if (err) {
            return cb(err);
        };

        try {
            const body = JSON.parse(msg.body);

            const result = {
                body: msg.body,
                headers: {}
            };

            if (msg.headers['x-cache']) {
                result.headers['X-Cache'] = msg.headers['x-cache'];
            }

            if (msg.headers['x-cache-tags']) {
                result.headers['X-Cache-Tags'] = msg.headers['x-cache-tags'];
            }

            return cb(null, result);
        } catch (err) {
            return cb(err);
        }
    });
};
