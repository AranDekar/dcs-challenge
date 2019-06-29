module.exports = require('./index_implementation')(
    require('./../../../conf'),
    require('./../legacy-agent'),
    require('./normalisers/extract-ids'),
    require('./../../../lib/middleware/template-handler')
);
