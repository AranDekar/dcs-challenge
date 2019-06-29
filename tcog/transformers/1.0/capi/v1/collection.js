module.exports = require('./collection_implementation')(
    require('./../../../../conf'),
    require('./../../legacy-agent'),
    require('./middleware/assets'),
    require('./../../../../lib/middleware/template-handler'),
    require('./normalisers'),
    require('lodash')
);
