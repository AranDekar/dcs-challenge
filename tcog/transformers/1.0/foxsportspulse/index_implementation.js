module.exports = function(config, agentMiddleware, template) {
    var transformer = {},
        agentConfig = {
            'query': {
                't_ref': '{{ res.locals.product.foxsportsPulseApiKey }}'
            },
            'headers': {
                'User-Agent': 'tcog v1 (tcog@news.com.au)',
                'x-api-key': '{{ res.locals.product.foxsportsPulseApiKey }}'
            }
        };

    transformer.middleware = [
        agentMiddleware(config.foxsportsPulseAPI + '/', agentConfig),
        template('default')
    ];

    transformer.routes = {
        '/foxsportspulse/(*)': transformer.middleware
    };

    return transformer;
};
