var request = require('request'),
    config = require('../../../conf');

module.exports = require('./s3_implementation')(request, JSON, config);
