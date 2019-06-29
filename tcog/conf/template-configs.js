var fs = require('fs'),
    templateConfigsLoader = require('./template-configs_implementation');

module.exports = templateConfigsLoader(fs.readdirSync, fs.readFileSync);
