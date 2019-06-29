var conf = require('../../../../../conf'),
    url = require('url'),
    collections = {};

/*
 * @description
 * Appends an capiV2APIImageKey to image urls in content/search,
 * currently only applicable to thumbnail links
 * This function executes synchronously.
 */

collections.addQueryParameterToUrl = function addQueryParameterToUrl(key, value, urlString) {
    var urlObject = url.parse(urlString, true);

    /*
     * Search is deleted because urlObject.query will only be used if urlObject.search is absent.
     * Ref:http://nodejs.org/docs/latest/api/url.html#url_url_format_urlobj
     */
    delete urlObject.search;
    urlObject.query[key] = value;
    return url.format(urlObject);
};

var applyApiKeyToMethodeImage = function applyKeyToMethodeImages(item, key, value) {
    if (item.link && item.contentType === 'IMAGE' && item.origin === 'METHODE') {
        item.link = collections.addQueryParameterToUrl(
            key, value, item.link);
    }
};

module.exports = function normalise(locals) {
    var capiV2APIKey = locals.product.capiV2APIImageKey,
        paramName = 'api_key';

    if (capiV2APIKey) {
        locals.data.results.forEach(function(item) {
            if (item.thumbnailImage) {
                applyApiKeyToMethodeImage(
                    item.thumbnailImage, paramName, capiV2APIKey);
            }
            item.related.forEach(function(item) {
                applyApiKeyToMethodeImage(item, paramName, capiV2APIKey);
            });
        });
    }
    return locals;
};
