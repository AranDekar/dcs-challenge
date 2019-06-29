module.exports = function(nurl) {
    /**
     * @ngdoc function
     * @name routerEnforcer
     *
     * @description
     * Prevents the rendering of content where it has not been syndicated and when
     * the rendering site is free and the content is premium.
     *
     * @param {object}   req   standard express/http request object
     * @param {object}   res   standard express/http response object
     * @param {function} next  Callback to continue chain
     *
     */

    var self = function routerEnforcer(req, res, next) {
    // bail early if this route does not need enforcing
        if (res.locals.config.trouter === null ||
            res.locals.config.trouter === undefined) {
            return next();
        }

        var locals = res.locals || {},
            config = locals.config || {},
            request = {
                data: locals.data,
                media: config.articleURL,
                domain: locals.product && locals.product.domain
            },
            query = locals.query && nurl.format({
                query: locals.query
            }).substring(1) || '',

            redirect = false,
            bail = false,
            rules = self.rules,

            // for accurate comparison and enforcement of routes
            // we need media info from the request. The upstream
            // data and it's dynamicMetadata which details the route

            skipRules = !request.media ||
                        !request.data ||
                        !request.data.dynamicMetadata;

        if (skipRules) {
            return next();
        }

        // this assumes that some rules may override
        // the uri of a previous

        redirect = rules.reduce(function(result, rule) {
            return self.rule[rule](request) || result;
        }, redirect);

        if (redirect) {
            // normalize the url
            redirect = self.normalize(redirect);

            if (query) {
                redirect += ~redirect.indexOf('?') ? '&' + query : '?' + query;
            }
            return res.redirect(301, redirect);
        }

        next();
    };

    /**
     * @ngdoc function
     * @name normalize
     *
     * @description
     * Clean up a redirect url before it is returned. This is used to remove,
     * erroneous parts of a url or un-needed parameters.
     *
     * @param {string}   url   the url to normalize
     *
     * @returns {string}
     *
     */

    self.normalize = function(url) {
        url = nurl.parse(url, true);

        // remove the sv query string parameter
        // from the redirect url

        if (url.query.sv) {
            delete url.query.sv;
            delete url.search; // forces url.parse to use query instead
        }

        return nurl.format(url);
    };

    self.rule = {};

    /**
     * @ngdoc function
     * @name legacy
     *
     * @description
     * Evaluate the linkOrigin to determine if a url should redirect to
     * a non legacy version
     *
     * @param {object} context  data use to determine outcome
     *
     * @returns {string|boolean}
     *
     */

    self.rule.legacy = function(request) {
        var data = request.data || {},
            metadata = data.dynamicMetadata || {},
            metadataOrigin = metadata.linkOrigin,

            requestOrigin = request.media &&
                             request.media.origin &&
                             request.media.origin.replace('capi', 'spp');

        if (!requestOrigin || !metadataOrigin) {
            return false;
        }

        var result = (metadataOrigin === requestOrigin) ? false : metadata.link;

        return result;
    };

    /**
     * @ngdoc function
     * @name route
     *
     * @description
     * Ensures that the url used to request a story is correct by evaluating,
     * tcogs route against the route within the media document
     *
     * @param {object} context  data use to determine outcome
     *
     * @returns {string|boolean}
     *
     */

    self.rule.route = function(request) {
        var data = request.data,
            media = request.media,
            metadata = data.dynamicMetadata,

            link = metadata.link &&
                   metadata.link.length > 0 ? metadata.link : false,

            pathLevel = {},
            reqRoute, metaRoute, isValid;

        // should we not have any link we return early &
        // fallback to the canonical

        if (!link) {
            return metadata.canonical;
        }

        reqRoute = media.uri;
        metaRoute = nurl.parse(link).pathname;
        isValid = reqRoute === metaRoute;

        // a) we have an immediate match bail early

        if (isValid) {
            return false;
        }

        // b) damn no match
        //
        // we can assume that there is potentially two levels of route path
        // used as part of a cache key. So lets remove these and reverify.
        //
        // eg:
        //
        //      /this/cache/path/foo/bar    !== /foo/bar    false
        //      /cache/path/foo/bar         === /foo/bar    pass
        //      /cache/foo/bar              === /foo/bar    pass

        reqRoute = reqRoute.split('/').filter(function(item) {
            return item && item.length > 0;
        });

        pathLevel = {
            1: '/' + reqRoute.slice(1).join('/'),
            2: '/' + reqRoute.slice(2).join('/')
        };

        isValid = pathLevel[1] === metaRoute ||
                  pathLevel[2] === metaRoute;

        return isValid ? false : link;
    };

    /**
     * @ngdoc function
     * @name syndicated
     *
     * @description
     * Ensures that the current site is allowed to access the requested media.
     * It is assummed that for a story to have access it must have been syndicated.
     * Sydnication also assumes that if an media is premium and the site is free,
     * it has access if the domain is valid for access.
     *
     * @param {object} context  data use to determine outcome
     *
     * @returns {string|boolean}
     *
     */

    self.rule.syndicated = function(request) {
        var data = request.data,
            meta = data.dynamicMetadata,
            linkSyndicated = false,
            useCanonical = false,
            isValid = false,
            domain = {};

        if (!request.domain) {
            return false;
        }

        domain.request = request.domain; // based on a tcog product domain
        domain.link = meta.link; // based on data.metadata.link
        domain.canonical = meta.canonical; // based on data.metadata.canonical

        // normalize values
        // well this is messy - but the API is unpredictable and
        // this guarantees we can do an effective comparison. This should
        // be removed once dynamicMetadata.available is well, available.

        Object.keys(domain).forEach(function(item) {
            var value = domain[item],
                match;

            if (value) {
                value = value.replace(/^https?:\/\//, '');

                while ((match = /^(www|at|dev|ls|sit|sit2|uat|amp)\./.exec(value))) {
                    value = value.replace(match[1] + '.', '');
                }

                value = value.split('.')[0]; // without tld
                value = value.replace(/(dev|ls|sit|sit2|uat|amp)\b/, ''); // without env
                domain[item] = value;
            }
        });

        // temporary additional check to prevent prevent sites from displaying
        // content, which is link syndicated only and should not be available to
        // the calling domain for rendering.
        //
        // This will be replaced with a standardised property "linkSyndicated"
        // from CAPI to avoid hardcoding. Escape is the only case for this at
        // the moment but there will be others.

        linkSyndicated = domain.request !== 'escape' && domain.canonical === 'escape';

        isValid = domain.request === domain.link || !meta.canonical;
        useCanonical = !isValid || linkSyndicated;

        return useCanonical ? meta.canonical : false;
    };

    self.rules = ['legacy', 'syndicated', 'route'];

    return self;
};
