'use strict';

const config = require('../../../conf'),
    get = require('../../get'),
    queryString = require('query-string'),
    getRetry = require('../../getRetry'),
    opsgenie = require('../../../lib/opsgenie'),
    _ = require('lodash');

const filterParams = (params) => {
    const copy = _.clone(params);
    const paramKeys = Object.keys(params);

    const capiKeys = _.each(paramKeys, (key) => {
        if (/t(d|c)?_/.test(key)) {
            delete copy[key];
        }
    });

    return copy;
};

module.exports = (data, cb) => {
    const url = data.url + '?' + queryString.stringify(filterParams(data.query));

    get(url, {}, (err, response) => {
        getRetry(url, {}, { api_key: config.capiV3BackupAPIKey }, opsgenie, err, response, (err, response) => {
            let json;

            try {
                json = JSON.parse(response.body);
            } catch (err) {
                cb(new Error(err));
            }

            cb(undefined, {
                data: json,
                headers: { 'X-Cache-Tags': response.headers['x-cache-tags'] },
                statusCode: response.statusCode
            });
        });
    });
};
