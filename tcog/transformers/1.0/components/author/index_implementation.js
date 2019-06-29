module.exports = function(config, agentMiddleware, middlewares, _) {
    var self = {},
        request = agentMiddleware(config.capiV2CDN + '/author/v1/', {
            'query': {
                'api_key': '{{ res.locals.product.capiV2APIKey }}',
                'format': 'json'
            },
            'params': {
                'id': '{{ params.id }}'
            }
        }, false);

    self.parseGravatar = function(req, res, next) {
        var data = res.locals.data,
            gravatarContent = data && data.gravatarContent;

        if (gravatarContent) {
            try {
                data.gravatarContent = JSON.parse(gravatarContent);
            } catch (err) {
                next(err);
            }
        }

        next();
    };

    self.middleware = [
        request,
        self.parseGravatar,
        middlewares.templateHandler('component/author/default')
    ];

    self.routes = {
        '/component/author/:id': self.middleware
    };

    return self;
};
