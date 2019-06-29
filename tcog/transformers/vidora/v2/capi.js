'use strict';

const get = require('../../get'),
    logger = require('../../../lib/logger');

module.exports = (data, cb) => {
    const url = `${data.url}/?api_key=${data.capiV2APIKey}`;

    get(url, {}, (err, result) => {
        if (err) {
            logger.error('Could not call to CAPI for article.');
            return cb(err);
        }

        const article = JSON.parse(result.body);
        return cb(null, article);
    });
};
