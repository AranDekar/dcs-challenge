const async = require('async'),
    conf = require('./../../../conf'),
    capi = require('./agent'),
    logger = require('./../../../lib/logger');

const baseUrl = `${conf.capiV2CDN}/content/v2/`;

module.exports = (req, res, next) => {
    const domains = res.locals.config.domain.split(',');
    const domainSearches = [];
    const queryMaker = (domain) => {
        const category = encodeURIComponent(`:"/section/${domain}/collection/popular-content/all/today/"`);
        const origin = encodeURIComponent('origin:omniture');
        const domains = encodeURIComponent(`domains:${domain}`);
        domainSearches.push({
            key: domain,
            query: `((categories.value${category})AND(${origin})AND(${domains}))`
        });
    };

    domains.forEach(queryMaker);
    const capiV2APIKey = conf.products[res.locals.product.name].capiV2APIKey;

    const getPopularContent = (domainSearch, cb) => {
        return capi(baseUrl, `api_key=${capiV2APIKey}&includeRelated=true&query=${domainSearch.query}`, undefined, (err, result) => {
            if (err) {
                logger.error({ err: err }, 'Error calling CAPI for popular content!');
                return cb(err);
            } else {
                if (result.headers['X-Cache-Tags']) {
                    res.locals.headers['X-Cache-Tags'] += `,${result.headers['X-Cache-Tags']}`;
                }

                if (result.headers['X-Cache']) {
                    res.locals.headers['X-Cache'] += `,${result.headers['X-Cache']}`;
                }

                res.locals.data[`popular-${domainSearch.key}`] = JSON.parse(result.body);
                return cb();
            }
        });
    };

    async.each(domainSearches, getPopularContent, (err) => {
        if (err) {
            logger.error({ err: err }, 'Error calling CAPI in async.each for popular content!');
            return next(err);
        };

        next();
    });
};
