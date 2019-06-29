'use strict';

var cheerio = require('cheerio'),
    helpers = require('./helpers');

module.exports = require('./body_implementation')(cheerio, helpers);
