var agent = require('../../agent'),
    config = require('../../../conf'),
    qs = require('querystring'),
    logger = require('../../../lib/logger'),
    middleware = require('../../../lib/middleware'),
    newsgraphMapper = require('../middleware/newsgraphMapper');

var agentMiddleware = (req, res, next) => {
    const queryString = qs.stringify({ query: res.locals.newsgraph.query, variables: res.locals.newsgraph.variables }),
        url = `${config.newsgraph}/graphql/v3?${queryString}`;

    agent(url, (err, response) => {
        if (err) {
            logger.error({ err: err }, 'Newsgraph failure');
            return next(err);
        }

        res.locals.data = response;
        next();
    });
};

module.exports = [newsgraphMapper, agentMiddleware, middleware.templateHandler('default')];
