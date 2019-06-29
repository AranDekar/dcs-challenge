'use strict';

var cheerio = require('cheerio'),
    voidElements = require('./voidElements');

module.exports = require('./cleanHTMLString_implementation')(cheerio, voidElements);
