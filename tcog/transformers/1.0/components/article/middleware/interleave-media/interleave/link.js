'use strict';

var cheerio = require('cheerio'),
    helpers = require('./helpers');

module.exports = require('./link_implementation')(cheerio, helpers);
