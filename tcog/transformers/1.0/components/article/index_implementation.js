module.exports = function(config, agentMiddleware, middlewares, normalisers,
    deconstructArticleURL, interleaveMedia,
    apiKeyOverride, contentEnforcer, routeEnforcer, _) {
    var self = {};

    self.normalise = function(req, res, next) {
        res.locals = _.flowRight(
            normalisers.restructureImages,
            normalisers.restructureDateGroup,
            normalisers.addResultsArray
        )(res.locals);

        next();
    };

    var routeMiddleware = [
        deconstructArticleURL,
        apiKeyOverride,

        // Now we grab the methode article from the ID we retrieved in the
        // previous stage
        agentMiddleware(`${config.capiV2APIFacade || config.capiV2API}/content/v2/methode/`, {
            'query': {
                // WARNING: TEMPORARY FIX/HACK
                // ---------------------------------------------------------
                // In order to bypass the CAPI cache, we specify a 'cacheSkip'
                // parameter. We also use a single API key for all article
                // pages, so that they can be throttled in the event of an
                // emergency scenario or when upstream traffic goes above a
                // tested threshold.
                'cacheSkip': 'true',
                // Everything else remains the same.
                // ---------------------------------------------------------
                'includeRelated': true,
                'html': 'full,all',
                'includeDraft': "{{ res.locals.query.includeDraft || 'false' }}",
                'bustTime': "{{ res.locals.query.bustTime || '0' }}",
                'includeDynamicMetadata': true,
                'maxRelatedLevel': 2,
                'domain': '{{ ' +
                        'query.domain || ' +
                        'res.locals.product.domain || ' +
                        'res.locals.config.domain || ' +
                        "'' " +
                    '}}'
            },
            'params': {
                'id': '{{ res.locals.config.articleURL.upstreamID }}'
            }
        }, false),

        // Enforce content rules
        contentEnforcer,

        // Enforce route rules
        routeEnforcer,

        // Normalise the data returned...
        self.normalise,

        // Now we massage the body of the article, interleaving any media
        // resources into it.
        interleaveMedia,
        middlewares.templateHandler('../article/article')
    ];

    self.middleware = routeMiddleware;
    self.routes = {
        '/component/article/*': routeMiddleware
    };

    return self;
};
