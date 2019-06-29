module.exports = function(flattenCollection) {
    /**
    * @ngdoc function
    * @name legacyNormaliseMiddleware
    *
    * @description
    * Determine if this is a legacy redirect and if so normalise the data
    * before it is returned to the template.
    *
    * @param {object}   req  The node/express request object
    * @param {object}   res  The node/express response object
    * @param {function} next Callback to invoke the next middleware function.
    *
    * @return {function}
    *
    */

    return function legacyNormaliseMiddleware(req, res, next) {
        var legacy = res.locals && res.locals.legacy;

        if (!legacy) { return next(); }

        // normalize the data returned to ensure external templates
        // can still render the content;

        res.locals = flattenCollection(res.locals);

        // restore any legacy properties that may have been previously
        // mutated earlier in the chain

        res.locals.query = res.locals.legacy.query || res.locals.query;
        res.locals.config = res.locals.legacy.config || res.locals.config;
        req.url = res.locals.legacy.url || req.url;

        next();
    };
};
