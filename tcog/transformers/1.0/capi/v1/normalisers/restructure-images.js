var utils = require('./utils');

/**
* @ngdoc function
* @method
* @name tcog.transformers.custom.common.normalisers.restructureImages.normalise
*
* @description
* Normaliser which builds a new map of assets by type and size.
*
* This function executes asynchronously.
*
* @param {object}   req         The HTTP request, as represented by express
* @param {object}   res         The HTTP response, as represented by express
* @param {function} next        The express-provided callback for signalling
*                               that the next middleware in the stack should be
*                               executed.
*
* @returns {null}   null
*
*/
module.exports = function normalise(locals) {
    // must not run against Collections
    if (utils.containsCollection(locals.data.results)) {
        return locals;
    }

    locals.data.results.forEach(function(result) {
        if (!result.related) return;

        result.relatedMap =
            result.related.reduce(function(acc, cur) {
                var type = String(cur.contentType).toLowerCase();

                if (type === 'image') {
                    if (!acc[type]) { acc[type] = {}; }

                    if (!acc[type][cur.width]) {
                        acc[type][cur.width] = cur;
                    }
                } else {
                    if (!acc[type]) { acc[type] = []; }
                    acc[type].push(cur);
                }

                return acc;
            }, {});

        result.primaryImage =
            (result.related || []).filter(function(item) {
                return (
                    item &&
                    item.contentType === 'IMAGE' &&
                    item.referenceType === 'PRIMARY');
            })
                .pop();
    });

    return locals;
};
