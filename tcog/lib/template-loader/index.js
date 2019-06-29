var npath = require('path'),
    logger = require('../logger'),
    sandbox = require('./sandbox'),
    adapters = require('./adapters'),
    processViewName = require('./process-view-name'),
    now = Date.now;

module.exports = require('./index_implementation')(npath, logger, sandbox, processViewName, adapters, now);
