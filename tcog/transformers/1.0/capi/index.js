module.exports = require('./index_implementation')(
    require('./v1/'),
    require('./v1/collection'),
    require('./v1/search'),
    require('./v2/')
);
