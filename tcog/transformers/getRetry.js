const parse = require('url').parse,
    get = require('./get'),
    logger = require('../lib/logger'),
    qs = require('querystring'),
    CAPI_LIMIT_MESSAGE = '<h1>Developer Over Rate</h1>';

const getRetry = (url, headers, query, opsgenie, err, response, cb) => {
    if (response && response.statusCode === 403 && response.body.includes(CAPI_LIMIT_MESSAGE)) {
        const urlObj = parse(url);
        const queryObj = qs.parse(urlObj.query);
        const queryOverrideObj = Object.assign(queryObj, query);
        urlObj.query = qs.encode(queryOverrideObj);

        const options = {
            product: 'tcog',
            template: 'none',
            url: url
        };

        opsgenie({ message: `API key over quota: ${queryObj.api_key}` }, options, (opsGenieError) => {
            if (opsGenieError) {
                logger.error('Failed to send OpsGenie alert: ', { err: opsGenieError, upstreamError: err });
            }
        });

        get(`${urlObj.protocol}//${urlObj.host}${urlObj.pathname}?${urlObj.query}`, headers, cb);
    } else {
        cb(err, response);
    }
};

module.exports = getRetry;
