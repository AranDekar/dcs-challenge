'use strict';

const conf = require('../../../conf'),
    async = require('async'),
    capi = require('./capi'),
    agent = require('../agent'),
    logger = require('../../../lib/logger'),
    middleware = require('../../../lib/middleware');

// 1. go to vidora
const vidoraIntegration = (req, res, next) => {
    const vidoraURL = conf.vidoraAPI + `/v1/items/popular`;

    agent(vidoraURL, (err, popular) => {
        if (err) {
            next(500);
            return;
        }

        res.locals.data = {
            type: 'P13N_POPULAR_LIST',
            results: popular
        };

        next();
    });
};

module.exports = [middleware.product, vidoraIntegration, middleware.templateHandler('default')];
