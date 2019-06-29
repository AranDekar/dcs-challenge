'use strict';

module.exports = function(interleave) {
    /**
     * @ngdoc function
     * @name domainGuardMiddleware
     *
     * @description
     * Interleaves releated content found within copy and replaces where
     * appropriate based upon the result received from the interleave helper
     *
     * @param {object}      req   Standard HTTP/Express request object
     * @param {object}      res   Standard HTTP/Express response object
     * @param {function}    next  Callback
     *
     */

    return function(req, res, next) {
        var locals = res.locals || {},
            data = locals.data || {},
            errord = false,

            callback = function(err) {
                if (err) {
                    errord = true;
                    next(err);
                }
            };

        data.paragraphs = interleave.body(data.body, locals, callback);

        data.standFirst = !errord && data.standFirst &&
                           interleave.link(data.standFirst, locals, callback) ||
                           data.standFirst;

        data.description = !errord && data.description &&
                           interleave.link(data.description, locals, callback) ||
                           data.description;

        data.bulletList = !errord && data.bulletList && data.bulletList.map(function(item) {
            // wrap in a paragraph to ensure link is parsed
            // correctly

            item = '<p>' + item + '</p>';
            item = interleave.link(item, locals, callback);
            item = item && item.substring(3, item.length - 4);
            return item;
        }) || data.bulletList;

        if (!errord) { next(); }
    };
};
