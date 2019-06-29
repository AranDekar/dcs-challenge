'use strict';

var flattenCollection = require('../../1.0/capi/v1/normalisers/flatten-collection');

module.exports =
    require('./legacy-normalise_implementation')(flattenCollection);
