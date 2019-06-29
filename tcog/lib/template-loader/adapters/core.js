var npath = require('path'),
    viewMap = require('./core-fs-preloader'),
    jade = require('jade'),
    viewBasePath = npath.join(__dirname, '../../../views/common/');

module.exports =
    require('./core_implementation')(npath, viewMap, jade, viewBasePath);
