'use strict';

var getBufferItemsAtDepth = require('./getBufferItemsAtDepth'),
    createOpeningTag = require('./createOpeningTag'),
    createClosingTag = require('./createClosingTag');

module.exports = require('./generateHTMLFromStack_implementation')(
    getBufferItemsAtDepth, createOpeningTag, createClosingTag
);
