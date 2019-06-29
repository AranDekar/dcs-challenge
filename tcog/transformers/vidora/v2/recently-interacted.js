'use strict';

const conf = require('../../../conf'),
    async = require('async'),
    capi = require('./capi'),
    agent = require('../agent'),
    logger = require('../../../lib/logger'),
    middleware = require('../../../lib/middleware');

// 1. go to vidora
const vidoraIntegration = (req, res, next) => {
    const userId = req.params.user_id;
    const vidoraURL = conf.vidoraAPI + `/v1/users/${userId}/recently_interacted`;

    agent(vidoraURL, (err, recommendations) => {
        if (err) {
            // need to handle this
            next(500);
            return;
        }

        res.locals.vidora = recommendations;
        res.locals.userId = userId;
        next();
    });
};

// 2. call capi with list of articles.
const capiIntegration = (req, res, next) => {
    const mapper = (id, cb) => {
        cb(null, {
            id: id.id,
            url: conf.capiV2CDN + `/content/v2/${id}`,
            capiV2APIKey: conf.products[res.locals.product.name].capiV2APIKey
        });
    };

    async.map(res.locals.vidora.items, mapper, (err, results) => {
        async.mapLimit(results, 5, capi, (err, results) => {
            res.locals.data = {
                type: 'P13N_RECENTLY_INTERACTED_LIST',
                userId: res.locals.userId,
                results: results
            };

            next();
        });
    });
};

module.exports = [middleware.product, vidoraIntegration, capiIntegration, middleware.templateHandler('default')];
