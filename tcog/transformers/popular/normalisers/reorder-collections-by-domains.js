module.exports = function(req, res, next) {
    var locals = res.locals || {},
        filter = 'popular-',
        domains = (locals.config.originalDomain || locals.config.domain || '').split(','),
        scopes = Object.keys(res.locals.data),
        results;

    if (res.locals.perthNow) {
        scopes.push('popular-perthnow.com.au');
        res.locals.data['popular-perthnow.com.au'] = res.locals.perthNow;
    }

    // 1) find scopes containing popular-*
    // 2) reduce to a new array
    // 3) enforce ordering based upon domain params

    results = scopes.filter(function(scope) {
        return ~scope.indexOf(filter) && ~domains.indexOf(scope.replace(filter, ''));
    }).reduce(function(previous, next) {
        var data = res.locals.data[next].results,
            domain = next.split(filter)[1];

        if (data && data[0]) {
            // store scope domain for later filtering
            data[0].domain = domain;
            previous.push(data[0]);
        }

        return previous;
    }, []);

    // filter out results which do not have any domainLink
    // since these are invalid

    results.forEach(function(result) {
        var domain = result.domain;
        delete result.domain;

        result.related = result.related.map(function(item) {
            // maintain full data for legacy
            // popular calls

            var relatedItem = locals.legacy ? item : {
                title: item.title,
                domains: item.domains
            };

            // filter domain links by requested domain

            relatedItem.domainLinks = item.domainLinks ? item.domainLinks.filter(function(item) {
                return item.name === domain;
            }) : [];

            return relatedItem;
        }).filter(function(item) {
            return item.domainLinks.length;
        });
    });

    res.locals.data = {

        isLegacy: locals.legacy ? true : undefined,
        results: results.sort(function(a, b) {
            var domainA = a.domains[0],
                domainB = b.domains[0],
                ceiling = results.length + 1,

                // unrecognised domains come last

                idxA = domains.indexOf(domainA),
                idxB = domains.indexOf(domainB);

            if (idxA < 0) idxA = ceiling;
            if (idxB < 0) idxB = ceiling;

            return idxA - idxB;
        })

    };

    next();
};
