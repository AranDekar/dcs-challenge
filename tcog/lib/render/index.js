var npath = require('path'),
    logger = require('../logger'),
    loader = require('../template-loader'),
    helpers = require('./helpers'),
    responder = require('./responder');

module.exports =
    require('./index_implementation')(JSON, npath, logger, loader, helpers, responder);
