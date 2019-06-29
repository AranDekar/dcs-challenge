module.exports = function(config, agentMiddleware, template) {
    var transformer = {},
        agentConfig = {
            'query': {
                't_ref': config.archiveComments.apiKey
            },
            'headers': {
                'User-Agent': 'tcog v1 (tcog@news.com.au)',
                'x-api-key': config.archiveComments.apiKey
            }
        };

    transformer.middleware = [
        agentMiddleware(config.archiveComments.url, agentConfig),
        template('default')
    ];

    transformer.routes = {
        '/archive/comments/(*)': transformer.middleware
    };

    return transformer;
};
