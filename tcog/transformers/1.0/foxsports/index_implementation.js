module.exports = function(config, agent, template) {
    var transformer = {},
        agentConfig = {
            'query': {
                'userkey': '{{ res.locals.product.foxsportsApiKey }}'
            }
        };

    transformer.middleware = [
        agent(config.foxsportsAPI + '/', agentConfig),
        template('default')
    ];

    transformer.routes = {
        '/foxsports/(*)': transformer.middleware
    };

    return transformer;
};
