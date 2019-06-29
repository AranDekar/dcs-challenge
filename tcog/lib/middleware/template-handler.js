var logger = require('./../../lib/logger'),
    render = require('./../../lib/render'),
    _ = require('lodash'),
    moment = require('moment'),
    TCOG_HOST = require('./../../conf').tcogHost.external,
    configs = require('./../../conf/template-configs');

module.exports = require('./template-handler_implementation')(logger, render, _, moment, configs, TCOG_HOST);
