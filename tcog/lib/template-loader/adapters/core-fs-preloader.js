var fs = require('fs'),
    coreFSPreloader = require('./core-fs-preloader_implementation.js');

module.exports =
    coreFSPreloader(fs.readdirSync, fs.readFileSync, fs.statSync, './views');
