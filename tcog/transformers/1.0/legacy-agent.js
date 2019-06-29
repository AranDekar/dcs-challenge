'use strict';

const _ = require('lodash'),
    config = require('../../conf'),
    get = require('../get'),
    getRetry = require('../getRetry'),
    opsgenie = require('../../lib/opsgenie'),
    queryString = require('query-string'),
    logger = require('../../lib/logger');

_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

module.exports = function agentMiddleware(initialUrl, requestData, doMerge) {
    doMerge = (doMerge == null);

    return function(req, res, next) {
        let agentRequest = { query: res.locals.query || req.query, params: req.params },
            mergeObject = doMerge ? agentRequest : {};

        let url;

        if (requestData) {
            agentRequest = _.merge(mergeObject, _.cloneDeepWith(requestData, function(item) {
                if (typeof item === 'string') { return _.template(item)(req); }
            }));
        }

        if (~initialUrl.indexOf('{{')) {
            url = _.template(initialUrl)(req);
        } else {
            url = initialUrl;
        }

        if (req.tcog && req.tcog.product) {
            agentRequest.tcogProductName = req.tcog.product.name;
        }

        if (agentRequest.params.id) {
            url = `${url}${agentRequest.params.id}`;
        } else if (agentRequest.params['0']) {
            url = `${url}${agentRequest.params['0']}`;
        }

        url = url + '?' + queryString.stringify(agentRequest.query);

        get(url, {}, (err, response) => {
            getRetry(url, {}, { api_key: config.v2BackupKey }, opsgenie, err, response, (err, response) => {
                if (err) {
                    return next(err);
                };

                let body;

                try {
                    body = JSON.parse(response.body);
                } catch (err) {
                    const trimmedBody = response.body.substring(0, 300);
                    logger.error('Could not parse JSON: ', { url: url, err: err, result: trimmedBody, upstreamStatusCode: response.statusCode });
                }

                res.locals.data = body;

                if (response.headers['x-cache-tags']) {
                    res.locals.headers['X-Cache-Tags'] = response.headers['x-cache-tags'];
                }

                if (response.headers['x-cache']) {
                    res.locals.headers['X-Cache'] = response.headers['x-cache'];
                }

                if (requestData && requestData.scope) {
                    res.locals.data[requestData.scope] = body;
                    return next();
                }

                next();
            });
        });
    };
};
