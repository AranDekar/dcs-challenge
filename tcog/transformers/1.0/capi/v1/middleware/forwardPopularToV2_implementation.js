module.exports = function(pick) {
    var parametersWhiteList = [
        'pageSize',
        'offset',
        'maxRelated',
        'maxRelatedLevel',
        'includeRelated',
        'includeBodies',
        'includeFutureDated',
        'html'
    ];

    /**
     * @ngdoc function
     * @name forwardPopularToV2
     *
     * @describe
     * If query.origin is `omniture` and querey.category and query.domain are present
     * this middleware will do an internal redirect to /component/popular
     *
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     */
    var self = function forwardPopularToV2(req, res, next) {
        var config = res.locals.config,
            query = res.locals.query,
            category = query.category;

        // if the request does not match continue to v1
        if (query.origin !== 'omniture' ||
            typeof query.category !== 'string' ||
            typeof query.domain !== 'string') {
            return next();
        }

        // keep a record of the untouched params before they are mutated,
        // so thay they can be resorted just before a template render, using pick
        // here for convenience to ensure we do not get references

        res.locals.legacy = {
            url: req.url,
            query: pick(query, Object.keys(query)),
            config: pick(config, Object.keys(config))
        };

        // fix start & trailing slashes for category

        category = category.substr(-1) !== '/' ? category + '/' : category;
        category = category.charAt(0) !== '/' ? '/' + category : category;

        // prepare locals to be used with component/popular

        config.category = category;
        config.domain = query.domain;

        // remove unsupported query parameters from query to prevent capi v2 errors

        res.locals.query = pick(query, parametersWhiteList);

        // direct request to /component/popular route

        req.url = '/component/popular';

        return next('route');
    };

    return self;
};
