'use strict';

const uuid = require('uuid/v4');

module.exports = require('./transaction-id_implementation.js')(uuid);
