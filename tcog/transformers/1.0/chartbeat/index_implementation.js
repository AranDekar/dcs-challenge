module.exports = function(config, agent, extractIds, render) {
    var transformer = {},
        agentConfig = {
            'query': {
                'apikey': '{{ res.locals.product.chartbeatKey }}'
            }
        };

    transformer.middleware = [

    // remove additional parameters since this is a
    // wildcard ( refactor agent/helpers/assembleURL )

        function(req, res, next) {
            req.params = { '0': req.params[0] };
            next();
        },

        agent(config.chartbeatAPI + '/', agentConfig),
        extractIds,
        render('default')

    ];

    transformer.routes = {
        '/chartbeat/(*)': transformer.middleware
    };

    return transformer;
};
