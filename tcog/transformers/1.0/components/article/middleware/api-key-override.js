module.exports = function(req, res, next) {
    if (res.locals.product) {
        var apiKeyOverride = req.query['t_product_apiKey'];

        if (apiKeyOverride) {
            res.locals.product.capiV2APIKey = apiKeyOverride;
        }

        var imageApiKeyOverride = req.query['t_product_imageApiKey'];

        if (imageApiKeyOverride) {
            res.locals.product.capiV2APIImageKey = imageApiKeyOverride;
        }

        var configApiKeyOverride = req.query['t_product_configApiKey'];

        if (configApiKeyOverride) {
            res.locals.product.capiV2APIConfigKey = configApiKeyOverride;
        }
    }
    next();
};
