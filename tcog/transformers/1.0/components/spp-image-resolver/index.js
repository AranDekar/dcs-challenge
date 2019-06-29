module.exports = require('./index_implementation')(
    require('../../../../conf'),
    require('../../legacy-agent'),
    require('./middleware/redirect-to-correct-crop')
);
