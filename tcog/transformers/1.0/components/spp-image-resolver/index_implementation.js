// This route requests the crop sizes for an CAPI image by source ID,
// and redirects to the most appropriate crop based on the width parameter.

module.exports = function(config, agentMiddleware, redirectToCorrectCrop) {
    var transformer = {},
        agent =
            agentMiddleware(config.capiV2CDN + '/content/v1/', {
                'query': {
                    'sourceImageId': '{{ res.locals.query.sourceImageId }}',
                    // This key is statically set for this route. It's specific
                    // to the query.
                    'api_key': 'v52crk656vra5pdx67hm9cvv'
                }
            }, false),

        // Define route middleware
        routeMiddleware = [agent, redirectToCorrectCrop];

    transformer.middleware = routeMiddleware;
    transformer.routes = {
        '/component/spp-image-resolver/': routeMiddleware
    };

    return transformer;
};
