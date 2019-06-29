var logger = require('../../../../../lib/logger'),
    agent = require('../../../legacy-agent'),
    config = require('../../../../../conf'),
    _ = require('lodash');

module.exports = require('./assets_implementation')(logger, agent, config, _);
