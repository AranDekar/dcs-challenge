module.exports = function(config, agent, template) {
    var transformer = {},
        agentConfig = {
            'query': {
                'api_key': '{{ res.locals.product.capiV2APIKey }}'
            }
        };

    transformer.middleware = [

    // remove additional parameters since this is a
    // wildcard ( refactor agent/helpers/assembleURL )

        function(req, res, next) {
            req.params = { '0': req.params[0] };
            next();
        },
        agent(config.capiV2CDN + '/content/v2/', agentConfig),
        template('default')
    ];

    transformer.routes = {
        '/news/content/v2(*)': transformer.middleware
    };

    return transformer;
};
