const perthNowMiddleware = require('./integration/perth-now-middleware'),
    reorderCollectionsByDomain = require('./normalisers/reorder-collections-by-domains'),
    legacyNormalise = require('./normalisers/legacy-normalise'),
    middleware = require('./../../lib/middleware'),
    popularContent = require('./integration/popular-content');

module.exports = [
    perthNowMiddleware,
    popularContent,
    reorderCollectionsByDomain,
    legacyNormalise,
    middleware.templateHandler('popular-combined-footer', {
        masthead: require('./../../conf/popular-combined.json')
    })
];
