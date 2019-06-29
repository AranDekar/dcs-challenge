'use strict';

const conf = require('../../../conf'),
    async = require('async'),
    generateAgent = require('./../agent'),
    logger = require('../../../lib/logger'),
    middleware = require('../../../lib/middleware'),
    extractQuery = require('../middleware/extractQuery'),
    vidoraProduct = require('../middleware/vidoraProduct'),
    qs = require('querystring'),
    CAPI_REQUEST_LIMIT = 5,
    VIDORA_ARTICLE_LIMIT = 10;

module.exports = (agent = generateAgent()) => {
    // 1. go to vidora
    const vidoraIntegration = (req, res, next) => {
        let vidoraApiKey = conf.products[res.locals.product.name].vidoraApiKey || conf.vidoraApiKey;
        const userId = req.params.user_id;
        const vidoraQuery = res.locals.vidoraQuery;

        if (res.locals.vidoraProduct) {
            vidoraApiKey = res.locals.vidoraProduct.vidoraKey;
        }

        const query = qs.stringify(Object.assign({api_key: vidoraApiKey}, vidoraQuery));
        const vidoraURL = `${conf.vidoraAPI}/v1/users/${userId}/recommendations/?${query}`;

        agent(vidoraURL, (err, recommendations) => {
            if (err) {
                return next(500);
            }

            if (!Array.isArray(recommendations.items)) {
                // we pass this on as it represents a higher level
                // configuration for the business to notice
                // and fix with Vidora

                const err = {
                    message: 'Vidora replied without an array of recommended articles',
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

    const capiIntegration = (req, res, next) => {
        let capiKey = conf.products[res.locals.product.name].capiV3APIKey;

        if (res.locals.vidoraProduct) {
            capiKey = res.locals.vidoraProduct.capiV3Key;
        }

        const mapper = (vidoraArticle, cb) => {
            cb(null, conf.capiV3API + `/v3/articles/${vidoraArticle.id}?api_key=${capiKey}`);
        };

        async.map(res.locals.vidora, mapper, (err, urls) => {
            async.mapLimit(urls, CAPI_REQUEST_LIMIT, agent, (err, articles) => {
                if (err) {
                    logger.error({ err: err }, 'Failed to communicate with CAPI');
                    return next(err);
                }

                res.locals.data =
                {
                    type: 'P13N_RECOMMENDATION_LIST',
                    results: articles
                };

                next();
            });
        });
    };

    return [middleware.product, vidoraProduct, extractQuery, vidoraIntegration, capiIntegration, middleware.templateHandler('default')];
};
