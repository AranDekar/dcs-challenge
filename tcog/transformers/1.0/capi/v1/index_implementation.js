module.exports = function(config, agentMiddleware, templateHandler, normalisers, _) {
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
            normalisers.restructureImages,
            normalisers.restructureDateGroup,
            normalisers.addResultsArray
        )(res.locals);

        next();
    };

    self.middleware = [
        function(req, res, next) {
            if (~req.url.indexOf('/methode/origin:')) {
                req.params.id = 'methode/' + req.params.id;
            }
            next();
        },
        agentMiddleware(config.capiV2CDN + '/content/v1/', agentConfig),
        self.normalise,
        templateHandler('extended')
    ];

    self.routes = {
        '/news/content/v1/:id': self.middleware,
        '/news/content/v1/methode/:id': self.middleware
    };

    return self;
};
