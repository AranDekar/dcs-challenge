'use strict';

const perthNow = require('./perth-now'),
    PERTHNOW = 'perthnow.com.au';

module.exports = function(req, res, next) {
    if (!res.locals.config.domain.match(/perthnow\.com\.au/)) {
        return next();
    }

    res.locals.config.originalDomain = res.locals.config.domain;
    res.locals.config.domain = res.locals.config.domain.replace(`,${PERTHNOW}`, '');

    perthNow(function(err, result) {
        if (err) {
            return next(err);
        }

        res.locals.perthNow = {
            results: [{
                contentType: 'COLLECTION',
                status: 'ACTIVE',
                related: [],
                domains: [PERTHNOW],
                domainLinks: [ {
                    name: PERTHNOW,
                    link: ''
                }]
            }]
        };

        result.forEach(function(perthNowData) {
            const relatedItem = {
                title: perthNowData.title,
                domains: [PERTHNOW],
                domainLinks: [ {
                    link: perthNowData.url,
                    name: PERTHNOW
                }]
            };

            res.locals.perthNow.results[0].related.push(relatedItem);
        });

        next();
    });
};
