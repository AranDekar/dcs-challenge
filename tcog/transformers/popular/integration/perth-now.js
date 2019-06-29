'use strict';

const conf = require('./../../../conf'),
    perthNow = require('./agent'),
    logger = require('./../../../lib/logger');

module.exports = (cb) => {
    perthNow(conf.api.resource.perthNow, '', undefined, (err, result) => {
        if (err) {
            logger.error('Could not call to PerthNow for popular results.');
            return cb(err);
        }

        const popularArticles = JSON.parse(result.body);

        return cb(null, popularArticles);
    });
};
