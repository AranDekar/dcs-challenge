// A simple healthcheck endpoint that returns 200 if it is able to respond.
var logger = require('./logger'),
    config = require('../conf'),
    version = require('../package.json').version;

module.exports = function(req, res) {
    var reportData = {
        status: 'ok',
        version: version,
        nodeVersion: config.nodeVersion,
        environment: config.env
    };

    logger.debug(reportData, 'Health check');
    res.set('Content-Type', 'application/json');
    res.status(200).send(reportData);
};
