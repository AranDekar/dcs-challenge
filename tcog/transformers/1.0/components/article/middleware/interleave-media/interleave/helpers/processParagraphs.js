'use strict';

var voidElements = require('./voidElements'),
    createParagraph = require('./createParagraph'),
    generateHTMLFromStack = require('./generateHTMLFromStack');

module.exports = require('./processParagraphs_implementation')(voidElements, createParagraph, generateHTMLFromStack);
