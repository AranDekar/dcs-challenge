'use strict';
const conf = require('../../../conf'),
    logger = require('../../../lib/logger'),
    defaultAgent = require('../../agent');

module.exports = (agent = defaultAgent) => {
    return (req, res, next) => {
        const playerName = req.query.t_player_name;
        if (!playerName) {
            return next();
        }

        const apiKey = conf.products[res.locals.product.name].capiV3APIKey || conf.capiV3APIKey;
        const url = `${conf.capiV3API}/v3/search?extendedHeadline=${encodeURIComponent(playerName)}&api_key=${apiKey}`;

        agent(url, (err, result) => {
            if (err) {
                logger.error('Could not call Capi v3 advanced search!', { err: err, url: url });
                return next(err);
            }

            res.locals.data.capi = result;
            next();
        });
    };
};
