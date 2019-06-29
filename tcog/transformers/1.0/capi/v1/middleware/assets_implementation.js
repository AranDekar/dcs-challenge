module.exports = function(logger, agent, config, _) {
    var self = function(req, res, next) {
        var batch = [],
            primaries = [],
            referenced =
                res.locals.data.results.map(function(result) {
                    return result.references;
                })
                    .filter(function(referenceMap) {
                        return !!referenceMap;
                    });

        referenced.forEach(function(references) {
            references.forEach(function(asset) {
                batch.push(asset.originId);
                if (asset.referenceType === 'PRIMARY') {
                    primaries.push(asset.originId);
                }
            });
        });

        if (!batch.length) {
            return next();
        }

        var batchedReq = {
            query: {
                'originId': batch,
                'origin': 'fatwire',
                'api_key': res.locals.product.capiV2APIKey,
                'pageSize': 100
            }
        };

        agent(config.capiV2CDN + '/content/v1', batchedReq, function(err, response, document) {
            if (err) {
                logger.error(
                    { product: req.tcogProduct, err: err.stack, req: req },
                    'Could not build primary assets for collection'
                );

                return next(err);
            }

            var assets = {};

            document.results.forEach(function(result) {
                var isPrimary = _.includes(primaries, result.originId);
                result.referenceType = (isPrimary ? 'PRIMARY' : 'SECONDARY');
                assets[result.originId] = result;
            });

            // parse the original document and paint in the related
            // items appropriately
            (res.locals.data.results || []).forEach(function(result) {
                (result.references || []).forEach(function(asset) {
                    if (assets[asset.originId]) {
                        result.related.push(assets[asset.originId]);
                    }
                });
            });

            next();
        });
    };

    return self;
};
