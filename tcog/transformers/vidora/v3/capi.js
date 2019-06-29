'use strict';

const get = require('../../get'),
    logger = require('../../../lib/logger');

module.exports = (data, cb) => {
    const url = `${data.url}/?api_key=${data.capiV3APIKey}`;

    get(url, {}, (err, result) => {
        if (err) {
            logger.error('Could not call to CAPI for article.');
            return cb(err);
        }

        let article;

        try {
            article = JSON.parse(result.body);
        } catch (err) {
            return cb(err);
        }

        return cb(null, article);
    });
};
