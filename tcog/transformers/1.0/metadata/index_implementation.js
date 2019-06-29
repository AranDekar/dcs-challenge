module.exports = function(config, agentMiddleware, middlewares, defaults) {
    var self = {},
        agentConfig = {
            'query': {
                'api_key': '{{ res.locals.product.capiV2APIConfigKey }}',
                'format': 'json'
            }
        },

        metadata = agentMiddleware(config.capiV2CDN + '/config/conf', agentConfig);

    function restructureMetadata(req, res, next) {
        var data = res.locals.data,
            subkey = req.query['tc_subkey'];

        if (data[subkey] &&
            (data[subkey].meta ||
            data[subkey].title ||
            data[subkey].link ||
            data[subkey].vars)) {
            res.locals.data = data[subkey];
        }

        next();
    }

    self.middleware = [
        defaults,
        metadata,
        restructureMetadata,
        middlewares.templateHandler('metadata')
    ];

    self.routes = {
        '/news/config/conf': self.middleware,
        '/metadata': self.middleware // LEGACY
    };

    return self;
};
