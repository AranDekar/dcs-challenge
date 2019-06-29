'use strict';

const conf = require('../../../conf'),
    defaultAgent = require('../../agent'),
    logger = require('../../../lib/logger');

module.exports = (agent = defaultAgent) => {
    return (req, res, next) => {
        const playerId = req.params['0']; // the playerId is wildcarded in - e.g. 'cricket/series/26/players/601079/'
        const userKey = conf.products[res.locals.product.name].foxsportsApiKey || conf.foxsportsApiKey;
        const url = `${conf.foxsportsAPI}/3.0/api/sports/${playerId}/stats.json?userkey=${userKey}`;

        agent(url, (err, result) => {
            if (err) {
                logger.error('Could not call foxsports', { err: err, url: url });
                return next(err);
            }

            res.locals.data.foxsports = result;
            next();
        });
    };
};
