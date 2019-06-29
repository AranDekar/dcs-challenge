const dcsAgent = require('agent'),
    devNull = require('dev-null'),
    request = require('request');

const get = (url, headers, cb) => {
    const defaultHeaders = { 'User-Agent': 'DCS-TCOG/5.0 (+dl-dcs@news.com.au)' };

    dcsAgent._agent(request)(url, Object.assign(defaultHeaders, headers), devNull(), cb);
};

module.exports = get;
