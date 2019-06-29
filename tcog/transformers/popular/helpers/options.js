'use strict';

var tpl = require('util').format;

module.exports = function(domains, locals) {
    locals = locals || {};
    domains = Array.isArray(domains) && domains || undefined;

    if (!domains) {
        return;
    }

    // Build capi v2 query - if locals.config.category is set it will be used

    var defaultCategory = '/section/%s/collection/popular-content/all/today/',
        defaultOrigin = 'omniture',

        localsCategory = locals.config && locals.config.category,
        localsOrigin = locals.config && locals.config.origin,

        category = localsCategory || defaultCategory,
        origin = localsOrigin || defaultOrigin,

        queryTpl = '((' + [
            'categories.value:"' + category + '"',
            'origin:' + origin,
            'domains:%s'
        ].join(')AND(') + '))',
        requests;

    // construct an array of agent options

    requests = domains.map(function(domain) {
        return {
            query: {
                query: tpl(queryTpl, domain, localsCategory ? '' : domain).trim()
            },
            scope: domain
        };
    });

    return requests;
};
