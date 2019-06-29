var config = require('../../conf');

module.exports = require('./responder_implementation')(config.tcogHost.pixel, JSON, encodeURI);
