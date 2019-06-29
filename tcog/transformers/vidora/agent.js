'use strict';

const conf = require('../../conf'),
    agentWrapper = require('agent'),
    request = require('request'),
    devNull = require('dev-null');

const defaultAgent = agentWrapper._agent(request);

module.exports = (agent = defaultAgent) => {
    return (url, cb) => {
        agent(url, { 'User-Agent': 'DCS-TCOG/5.0 (+dl-dcs@news.com.au)' }, devNull(), (err, result) => {
            if (err) {
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
};
