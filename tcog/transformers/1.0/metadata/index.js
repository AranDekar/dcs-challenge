module.exports = require('./index_implementation')(
    require('../../../conf'),
    require('./../legacy-agent'),
    require('../../../lib/middleware/'),
    require('./middleware/defaults')
);
