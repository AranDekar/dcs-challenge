module.exports = function(config, agentMiddleware, assets, templateHandler, normalisers, _) {
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
            normalisers.restructureDateGroup
        )(res.locals);

        next();
    };

    self.middleware = [
        agentMiddleware(config.capiV2CDN + '/content/v1/collection/', agentConfig),
        assets,
        self.normalise,
        templateHandler('extended')
    ];

    self.routes = {
        '/news/content/v1/collection/:id': self.middleware,
        '/collection/:id': self.middleware // LEGACY
    };

    return self;
};
