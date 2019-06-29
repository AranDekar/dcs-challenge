'use strict';

const request = require('request'),
    conf = require('./../../conf'),
    logger = require('../logger'),
    moment = require('moment');

module.exports = function(error, notificationData, cb) {
    let alias = notificationData.product + '_' +
        conf.env + '_' + // jshint ignore:line
        moment().format('YYYY-MM-DD') + '_' + // jshint ignore:line
        notificationData.template; // jshint ignore:line

    if (error && error.message) {
        alias = `${alias}_${error.message}`;
    } else {
        error = { message: 'Error is missing message' };
    }

    let productTeam, productApiKey;

    if (conf.products[notificationData.product]) {
        productTeam = conf.products[notificationData.product].opsgenieTeam;
    }

    if (!productTeam) {
        // this product has yet to configure an opsgenie team, stop here
        return cb();
    }

    productApiKey = conf.products[notificationData.product].opsgenieApiKey;

    if (!productApiKey) {
        // this product has yet to configure an opsgenie team, stop here
        return cb();
    }

    const message = `TCOG Template ${conf.env}-${notificationData.product}-${notificationData.template}`;

    const data = {
        message: message,
        responders: [
            {
                name: productTeam,
                type: 'team'
            }
        ],
        visibleTo: [
            {
                name: 'Platform_TCOG_team',
                type: 'team'
            }
        ],
        alias: alias,
        description: `${error.message} `,
        details: {
            product: notificationData.product,
            url: notificationData.url,
            template: notificationData.template,
            sentUTC: moment().utc().format()
        }
    };

    const args = {
        url: 'https://api.opsgenie.com/v2/alerts',
        headers: {
            Authorization: `GenieKey ${productApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };

    request.post(args, (err, resp, body) => {
        logger.debug('opsgenie resp: ', body);
        if (err) {
            return cb(err);
        } else {
            return cb();
        }
    });
};
