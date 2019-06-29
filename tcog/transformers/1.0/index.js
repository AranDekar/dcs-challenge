module.exports = require('./index_implementation')(
    require('./capi'),
    require('./video'),
    require('./metadata'),
    require('./foxsports'),
    require('./foxsportspulse'),
    require('./components/video'),
    require('./components/article'),
    require('./components/spp-image-resolver'),
    require('./components/author'),
    require('./chartbeat'),
    require('./archive/comments')
);
