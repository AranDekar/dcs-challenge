'use strict';

const conf = require('./conf'),
    express = require('express'),
    cors = require('cors'),
    logger = require('./lib/logger'),
    middleware = require('./lib/middleware'),
    healthcheck = require('./lib/healthcheck'),
    transformers = require('./transformers'),
    pathToParams = require('./transformers/middleware/path-to-params'),
    npmPackage = require('./package.json');

const service = express();

service.get('/', function(req, res, next) {
    middleware.templateHandler.render(req, res, next, '../index', {
        env: conf.env,
        npmPackage: `${npmPackage.name}-${npmPackage.version}`,
        node: conf.nodeVersion,
        slogans: npmPackage.slogans
    });
});

// Legacy routes.

service.get('/fatwire', function(req, res) {
    res.status(410).end();
});

// configure middlewares
service.use([
    middleware.favicon,
    middleware.identifyAkamai,
    middleware.responseLocals,
    middleware.normalizeRequestUrl,
    // CORS headers
    cors(),
    // Tracking pixel endpoint must come before cache, as the empty gif is
    // never cached (instead, a page is generated for a tracking pixel request.)
    middleware.trackingPixelEndpoint,
    // Set etag, and return with 304 if required.
    middleware.fresh,
    middleware.templateHeaderToParams,
    middleware.requestInitialiser,
    middleware.product,
    middleware.deprecateParams,
    middleware.queryProcessor,

    // We only need to execute the request initialiser and find the product
    // if we're haven't returned from cache.
    middleware.transactionId,

    // // add the version header
    // // it is too simple to put in worker
    middleware.stackHeaders, // depends on requestInitialiser
    middleware.requireProduct
]);

// REGISTER ROUTES WITH EXPRESS
// Adding routes directly to the app is faster than mountable apps
transformers.v1.forEach(function(transformer) {
    Object.keys(transformer.routes).forEach(function(key) {
        service.get(key, transformer.routes[key]);
    });
});

service.get('/newsgraph/v3/', transformers.newsgraph.v3.generic);

service.get('/newsgraph/v3/p13n/users/:user_id/recommendations', [
    transformers.vidora.v3.generateRecommendations()[3],
    transformers.newsgraph.middleware.recommendationsMapper,
    transformers.newsgraph.v3.generic
]);

service.get('/firestore/v1/(*)', [pathToParams, transformers.resource]);
service.get('/component/resource/(*)', transformers.resource);

service.get('/p13n/users/:user_id/modules', transformers.vidora.modules);
service.get(
    '/p13n/v2/users/:user_id/recommendations',
    transformers.vidora.v2.generateRecommendations()
);
service.get(
    '/p13n/v2/users/:user_id/items/:item_id/similars',
    transformers.vidora.v2.generateSimilarities()
);
service.get(
    '/p13n/v3/users/:user_id/recommendations',
    transformers.vidora.v3.generateRecommendations()
);

// SPP-API endpoints
service.get('/spp-api/v1/pages', transformers.wordpressApi.pages);
service.get('/spp-api/v1/template', transformers.wordpressApi.template);
service.get(
    '/spp-api/v1/widgets/public/:widget_id',
    transformers.wordpressApi.widgetsAsPublicHtml
);
service.get(
    '/spp-api/v1/widgets/:widget_id',
    transformers.wordpressApi.widgets
);

// popular content
service.get('/component/popular', transformers.popular);
service.get('/component/popular-combined', transformers.popular);

// CAPI v3 routes

service.get('/news/v3/search', transformers.capi.v3.bySearch('search'));

service.get('/news/v3/articles/:id', transformers.capi.v3.byId('articles'));
service.get('/news/v3/articles', transformers.capi.v3.bySearch('articles'));

service.get('/news/v3/authors/:id', transformers.capi.v3.byId('authors'));
service.get('/news/v3/authors', transformers.capi.v3.bySearch('authors'));

service.get(
    '/news/v3/collections/:id',
    transformers.capi.v3.byId('collections')
);
service.get(
    '/news/v3/collections',
    transformers.capi.v3.bySearch('collections')
);

service.get('/news/v3/customs/:id', transformers.capi.v3.byId('customs'));
service.get('/news/v3/customs', transformers.capi.v3.bySearch('customs'));

service.get('/news/v3/images/:id', transformers.capi.v3.byId('images'));
// TODO service.get('/news/v3/images/bin/:id', transformers.capi.v3.byId('images'));
service.get('/news/v3/images', transformers.capi.v3.bySearch('images'));

service.get('/news/v3/files/:id', transformers.capi.v3.byId('files'));
// TODO service.get('/news/v3/files/bin/:id', transformers.capi.v3.byId('files'));
service.get('/news/v3/files', transformers.capi.v3.bySearch('files'));

service.get('/news/v3/videos/:id', transformers.capi.v3.byId('videos'));
service.get('/news/v3/videos', transformers.capi.v3.bySearch('videos'));

// TODO GET documentByCapiIdAndRevision /documents/histories/:CAPI_ID/:MAJOR_REVISION/:MINOR_REVISION

service.get('/news/v3/search', transformers.capi.v3.bySearch('search'));
service.get(
    '/news/v3/search/id/:id',
    transformers.capi.v3.byId('search', '/v3/search/id/:id')
);

service.get('/news/v3/domains/:id', transformers.capi.v3.byId('domains'));
service.get('/news/v3/domains', transformers.capi.v3.bySearch('domains'));

service.get('/news/v3/routes/:id', transformers.capi.v3.byId('routes'));
service.get(
    '/news/v3/routes/:id/children/sections',
    transformers.capi.v3.byId('routes', '/v3/routes/:id/children/sections')
);
service.get(
    '/news/v3/routes/domains/:id',
    transformers.capi.v3.byId('routes', '/v3/routes/domains/:id')
);

service.get('/news/v3/sections/:id', transformers.capi.v3.byId('sections'));
service.get(
    '/news/v3/sections/:id/children',
    transformers.capi.v3.byId('sections', '/v3/sections/:id/children')
);
service.get(
    '/news/v3/sections/domains/:id',
    transformers.capi.v3.byId('domains', '/v3/sections/domains/:id')
);

service.get(
    '/news/v3/sections/syndications/domains/:id',
    transformers.capi.v3.byId(
        'sections',
        '/v3/sections/syndications/domains/:id'
    )
);
service.get(
    '/news/v3/sections/syndications/:id',
    transformers.capi.v3.byId('sections', '/v3/sections/syndications/:id')
);

service.get('/news/v3/categories/:id', transformers.capi.v3.byId('categories'));

service.get('/sport/profile/*', transformers.sport.profile);

service.get(
    '/fib/v1/position/:position',
    transformers.fib.v1.calculatePosition()
);

// the below are still in prototype stage (without tests)
// router.get('/p13n/users/:user_id/items/:item_id/similars', transformers.vidora.similarities);
// router.get('/p13n/items/:item_id/top_users', transformers.vidora.topUsers);
// router.get('/p13n/items/popular', transformers.vidora.popular);
// router.get('/p13n/users/:user_id/recently_interacted', transformers.vidora.recentlyInteracted);

// ============================
// STATIC ROUTES
// ============================
// index.jade, 404, 500 routes

service.get('/healthcheck', healthcheck);

service.get('/robots.txt', function(req, res, next) {
    res.setHeader('Content-type', 'text/plain');
    res.end('User-agent: *\nDisallow: /');
});

service.get('/scrutinise', middleware.scrutinise);

// Final routes.

service.use(
    middleware.statusCodeResponder(404, {
        path: '/404.html',
        root: './public'
    })
);

service.use(
    middleware.statusCodeResponder(500, {
        path: '/500.html',
        root: './public'
    })
);

service.listening = false;

service.run = function runTcog(port, cb) {
    port = port || 3000;
    cb = cb || function() {};

    if (service.listening) return cb();

    service.listen(port, function() {
        service.listening = true;
        logger.debug(
            'tcog ' + npmPackage.version + ' listening on port ' + port
        );
        cb();
    });
};

service.stop = function(cb) {
    tcog.server.listening = false;
    return cb();
};

module.exports = service;
