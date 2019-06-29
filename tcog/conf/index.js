var env = process.env.NODE_ENV,
    merge = require('lodash/merge'),
    join = require('path').join.bind(null, __dirname);

module.exports = require('./index_implementation')(env, require, merge, join);
