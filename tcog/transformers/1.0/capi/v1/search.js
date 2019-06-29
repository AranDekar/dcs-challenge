module.exports = require('./search_implementation')(
    require('./../../../../conf'),
    require('./../../legacy-agent'),
    require('./middleware/forwardPopularToV2'),
    require('./../../../../lib/middleware/template-handler'),
    require('./normalisers'),
    require('lodash')
);
