module.exports = function(products) {
    /**
     * @ngdoc function
     * @name domainGuardMiddleware
     *
     * @description
     * Extract content ids from pages[x].path to allow ids to be recorded
     * to support cache invalidation for NEWS_STORY
     *
     * @param {object}      req   Standard HTTP/Express request object
     * @param {object}      res   Standard HTTP/Express response object
     * @param {function}    next  Callback
     *
     */

    return function extractIds(req, res, next) {
        var locals = res.locals || {},
            data = locals.data || {};

        if (!data.pages) { return next(); }

        data.references = [];

        data.pages.forEach(function(page) {
            // only permit articles and gallery id
            // extraction

            var id = /\/news-story|image-gallery\//.test(page.path) &&
                     page.path.split('/').pop();

            if (id.length) {
                data.references.push({ id: { value: id } });
            }
        });

        next();
    };
};
