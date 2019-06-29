'use strict';

var generateErrorParagraph = require('./generateErrorParagraph'),
    findAssetByIdInRelatedArray = require('./findAssetByIdInRelatedArray');

module.exports = require('./pickRelated_implementation')(generateErrorParagraph, findAssetByIdInRelatedArray);
