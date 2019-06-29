module.exports = function(config, agentMiddleware, forwardPopularToV2Middleware,
    templateHandler, normalisers, _) {
    var self = {},
        agentConfig = {
            'query': {
                'api_key': '{{ res.locals.product.capiV2APIKey }}',
                'format': 'json',
                'includeRelated': 'true'
            }
        };

    self.normalise = function(req, res, next) {
        res.locals = _.flowRight(
            normalisers.getSectionFromUrl,
            normalisers.resultReferenceIds,
            normalisers.restructureImages,
            normalisers.restructureDateGroup,
            normalisers.flattenCollection,
            normalisers.addImageApikey
        )(res.locals);

        next();
    };

    self.middleware = [
    // forwardPopularToV2Middleware, - TODO
        agentMiddleware(config.capiV2CDN + '/content/v1/', agentConfig),
        self.normalise,
        templateHandler('extended')
    ];

    self.routes = {
        '/news/content/v1/': self.middleware,
        '/search': self.middleware, // LEGACY
        '/common/search/:template/:format': self.middleware // LEGACY
    };

    return self;
};
