var url = require('url'),
    string = require('string'),
    camelCache = {};

function camelise(input) {
    return camelCache[input] ||
            (camelCache[input] = string(input).camelize().s);
}

module.exports = function queryParserAndProcessor(req, res, next) {
    // ideally this would be set in lib/middleware/response-locals
    // though, for now, I dont want to risk changing the background logic
    // that makes the decision about which params are used here.

    res.locals.param = res.locals.param || req.params;

    Object.keys(req.query).forEach(function(key) {
        var camelKey;

        // NOTE: substr based comparisons are about three times
        // faster than an anchored match (51ns compared to ~130ns in testing)
        if (key.substr(0, 2) === 't_') {
            camelKey = camelise(key.substr(2));
            res.locals.config[camelKey] = req.query[key];
            return;
        }

        if (key.substr(0, 3) === 'tc_') {
            camelKey = camelise(key.substr(3));
            res.locals.config[camelKey] = req.query[key];
            return;
        }

        if (key.substr(0, 3) === 'td_') {
            camelKey = camelise(key.substr(3));
            res.locals.display[camelKey] = req.query[key];

            if (res.locals.display[camelKey] === 'true') { res.locals.display[camelKey] = true; }

            if (res.locals.display[camelKey] === 'false') { res.locals.display[camelKey] = false; }

            return;
        }

        // LEGACY
        if (key.substr(0, 8) === 'display:') {
            camelKey = camelise(key.substr(8));
            res.locals.display[camelKey] = req.query[key];

            if (res.locals.display[camelKey] === 'true') { res.locals.display[camelKey] = true; }

            if (res.locals.display[camelKey] === 'false') { res.locals.display[camelKey] = false; }

            return;
        }

        // LEGACY
        if (key.substr(0, 5) === 'tcog:') {
            camelKey = camelise(key.substr(5));
            res.locals.config[camelKey] = req.query[key];

            if (res.locals.config[camelKey] === 'true') { res.locals.config[camelKey] = true; }

            if (res.locals.config[camelKey] === 'false') { res.locals.config[camelKey] = false; }

            return;
        }

        res.locals.query[key] = req.query[key];
    });

    Object.keys(req.headers).forEach(function(key) {
        var camelKey,
            value;

        if (key.substr(0, 7) === 'x-tcog-') {
            camelKey = camelise(key.substr(7));
            value = req.headers[key];

            // DEPRECATE: Remove once Akamai change has been actioned

            if (camelKey === 'template' && value === 'external/article-couriermail/index') {
                value = 's3/chronicle-questnews/index';
            }

            res.locals.config[camelKey] = value;
        }
    });

    next();
};

module.exports.camelise = camelise;
