module.exports = require('./index_implementation')(
    require('../../../../conf'),
    require('./capi'),
    require('../../../../lib/middleware'),
    require('../../capi/v1/normalisers'),
    require('./middleware/deconstruct-article-url'),
    require('./middleware/interleave-media'),
    require('./middleware/api-key-override'),
    require('./middleware/content-enforcer'),
    require('./middleware/route-enforcer'),
    require('lodash')
);
