'use strict';

const conf = require('../../../conf'),
    async = require('async'),
    generateAgent = require('./../agent'),
    logger = require('../../../lib/logger'),
    middleware = require('../../../lib/middleware'),
    extractQuery = require('../middleware/extractQuery'),
    qs = require('querystring'),
    VIDORA_ARTICLE_LIMIT = 10,
    CAPI_REQUEST_LIMIT = 5;

module.exports = (agent = generateAgent()) => {
    // 1. go to vidora
    const vidoraIntegration = (req, res, next) => {
        const userId = req.params.user_id;
        const itemId = req.params.item_id;
        const vidoraApiKey = conf.products[res.locals.product.name].vidoraApiKey || conf.vidoraApiKey;
        const vidoraQuery = res.locals.vidoraQuery;
        const query = qs.stringify(Object.assign({api_key: vidoraApiKey}, vidoraQuery));
        const vidoraURL = conf.vidoraAPI + `/v1/users/${userId}/items/${itemId}/similars?${query}`;

        agent(vidoraURL, (err, recommendations) => {
            if (err) {
                // need to handle this
                next(500);
                return;
            }

            if (!Array.isArray(recommendations.items)) {
                // we pass this on as it represents a higher level
                // configuration for the business to notice
                // and fix with Vidora

                const err = {
                    message: 'Vidora replied without an array of similarities',
                    response: recommendations
                };

                return next(err);
            }

            if (recommendations.items.length > VIDORA_ARTICLE_LIMIT) {
                res.locals.vidora = recommendations.items.slice(0, VIDORA_ARTICLE_LIMIT);
            } else {
                res.locals.vidora = recommendations.items;
            }

            next();
        });
    };

    // 2. call capi with list of articles.
    const capiIntegration = (req, res, next) => {
        const apiKey = conf.products[res.locals.product.name].capiV2APIKey;

        const mapper = (vidoraArticle, cb) => {
            cb(null, conf.capiV2CDN + `/content/v2/${vidoraArticle}?api_key=${apiKey}`);
        };

        async.map(res.locals.vidora, mapper, (err, urls) => {
            async.mapLimit(urls, CAPI_REQUEST_LIMIT, agent, (err, articles) => {
                if (err) {
                    logger.error({ err: err }, 'Failed to communicate with CAPI');
                    return next(err);
                }

                res.locals.data =
                {
                    type: 'P13N_SIMILARITIES_LIST',
                    results: articles
                };

                next();
            });
        });
    };

    return [middleware.product, extractQuery, vidoraIntegration, capiIntegration, middleware.templateHandler('default')];
};
