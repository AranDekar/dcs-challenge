'use strict';

const _ = require('lodash'),
    queryString = require('query-string'),
    config = require('../../../../conf');

function isAuthor(res) {
    return res.locals.query && res.locals.query.bustTime && res.locals.query.bustTime !== '0';
}

function getApiParams(res) {
    if (config.capiV2APIFacade) {
        const capiV3APIKey = _.get(config, ['products', _.get(res, ['locals', 'product', 'name']), 'capiV3APIKey']);
        const capiV3AuthoringKey = isAuthor(res) ? _.get(config, ['products', _.get(res, ['locals', 'product', 'name']), 'capiV3AuthoringKey']) : undefined;

        return { api_key: capiV3AuthoringKey || capiV3APIKey, includeFutureDated: isAuthor(res) };
    } else {
        const productCapiV2APIKey = _.get(res, ['locals', 'product', 'capiV2APIKey']);
        const defaultCapiV2APIKey = config.capiV2APIArticleKey;

        return { api_key: productCapiV2APIKey || defaultCapiV2APIKey };
    }
};

module.exports = function constructUrl(req, res, initialUrl, requestData, doMerge) {
    const apiParams = { query: getApiParams(res) };

    let agentRequest = {
        query: res.locals.query || req.query,
        params: req.params
    };

    let mergeObject = doMerge ? agentRequest : {},
        url;

    if (requestData) {
        agentRequest = _.merge(mergeObject, _.cloneDeepWith(requestData, function(item) {
            if (typeof item === 'string') {
                return _.template(item)(req);
            }
        }));
    }

    agentRequest = _.merge(apiParams, agentRequest);

    if (~initialUrl.indexOf('{{')) {
        url = _.template(initialUrl)(req);
    } else {
        url = initialUrl;
    }

    if (!res.locals.data) {
        res.locals.data = {};
    }

    if (agentRequest.params.id) {
        url = `${url}${agentRequest.params.id}`;
    } else if (agentRequest.params['0']) {
        url = `${url}${agentRequest.params['0']}`;
    }

    return url + '?' + queryString.stringify(agentRequest.query);
};
