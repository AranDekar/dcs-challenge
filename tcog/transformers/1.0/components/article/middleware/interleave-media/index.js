'use strict';

var interleave = require('./interleave');
module.exports = require('./index_implementation')(interleave);
