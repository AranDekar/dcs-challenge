'use strict';

const conf = require('../../../conf'),
    async = require('async'),
    capi = require('./capi'),
    agent = require('../agent'),
    logger = require('../../../lib/logger'),
    middleware = require('../../../lib/middleware');

// 1. go to vidora
const vidoraIntegration = (req, res, next) => {
    const itemId = req.params.item_id;
    const vidoraURL = conf.vidoraAPI + `/v1/items/${itemId}/top_users`;

    agent(vidoraURL, (err, topUsers) => {
        if (err) {
            // need to handle this
            next(500);
            return;
        }

        res.locals.data = {
            type: 'P13N_TOPUSERS_LIST',
            itemId: itemId,
            results: topUsers
        };

        next();
    });
};

module.exports = [middleware.product, vidoraIntegration, middleware.templateHandler('default')];
