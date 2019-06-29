'use strict';

/*
    Vidora "modules" are sections/categories that are recommended for the user (nk).
    Unlike most Vidora integration, this call doesn't integrate with a version of CAPI.
*/

const conf = require('../../../conf'),
    logger = require('../../../lib/logger'),
    defaultAgent = require('./../../agent');

module.exports = (agent = defaultAgent) => {
    // 1. go to vidora
    return (req, res, next) => {
        const userId = req.params.user_id;
        const vidoraApiKey = conf.products[res.locals.product.name].vidoraApiKey || conf.vidoraApiKey;
        const vidoraURL = conf.vidoraAPI + `/v1/users/${userId}/modules/?api_key=${vidoraApiKey}`;

        agent(vidoraURL, (err, modules) => {
            if (err) {
                // need to handle this
                return next(err);
            }

            res.locals.data.vidora = modules;
            next();
        });
    };
};
