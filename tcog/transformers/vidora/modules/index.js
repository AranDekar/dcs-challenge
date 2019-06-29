const agent = require('./../../agent'),
    modules = require('./modules'),
    templateHandler = require('./../../../lib/middleware/template-handler');

module.exports = [modules(agent), templateHandler('default')];
