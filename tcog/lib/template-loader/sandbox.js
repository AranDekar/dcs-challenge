var smartClone = require('smartclone'),
    vm = require('vm'),
    jade = require('jade');

module.exports = require('./sandbox_implementation')(smartClone, vm, jade);
