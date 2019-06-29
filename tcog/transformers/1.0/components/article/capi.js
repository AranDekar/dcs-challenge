'use strict';

const _ = require('lodash'),
    get = require('../../../get'),
    getRetry = require('../../../getRetry'),
    config = require('../../../../conf'),
    opsGenieLib = require('../../../../lib/opsgenie'),
    constructUrl = require('./constructUrl');

_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

module.exports = (initialUrl, requestData, doMerge, opsgenie = opsGenieLib) => {
    const agentMiddleware = (req, res, next) => {
        const url = constructUrl(req, res, initialUrl, requestData);

        get(url, {}, (err, response) => {
            getRetry(url, {}, { api_key: config.v2BackupKey }, opsgenie, err, response, (err, response) => {
                if (err) {
                    return next(err);
                }

                try {
                    res.locals.data = JSON.parse(response.body);
                } catch (err) {
                    return next(err);
                }

                if (response.headers['x-cache-tags']) {
                    res.locals.headers['X-Cache-Tags'] = response.headers['x-cache-tags'];
                }

                if (response.headers['x-cache']) {
                    res.locals.headers['X-Cache'] = response.headers['x-cache'];
                }

                return next();
            });
        });
    };

    return agentMiddleware;
};
