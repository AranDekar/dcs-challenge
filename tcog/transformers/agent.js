'use strict';

const get = require('./get'),
    logger = require('./../lib/logger');

module.exports = (url, cb) => {
    get(url, {}, (err, result) => {
        if (err) {
            logger.error('Error in agent!', { err: err });
            return cb(err);
        }

        let results;

        try {
            results = JSON.parse(result.body);
        } catch (err) {
            return cb(err);
        }

        cb(null, results);
    });
};
