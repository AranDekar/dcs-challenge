var logger = require('../logger'),
    responder = require('./responder');

module.exports =
    require('./helpers_implementation')(logger, responder, JSON);
