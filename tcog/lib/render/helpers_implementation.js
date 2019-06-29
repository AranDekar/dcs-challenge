module.exports = function(logger, responder, JSON) {
    var self = {};

    /**
     * @ngdoc function
     * @name cacheIfOk
     *
     * @description
     * Given a statusCode of < 300 this method will cache data.
     *
     * @param {string}  url          The url being requested
     * @param {number}  statusCode   The xxx code for the request response
     * @param {string}  dataToCache  The rendered data to cache
     * @param {object}  options      Caching options
     *
     * @returns {null}  null
     *
     */

    function cacheIfOk(url, statusCode, dataToCache, options) {
        options = options || {};
        options.ignoreHost = true;
    }

    self.cacheIfOk = cacheIfOk;
    self.responder = responder;

    return self;
};
