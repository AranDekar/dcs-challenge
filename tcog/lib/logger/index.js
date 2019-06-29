module.exports = require('./index_implementation')(
    __dirname,
    require('bunyan'),
    require('./../../conf'),
    require('fs'),
    require('path'),
    process.pid
);
