var utils = require('./utils');

/**
* @ngdoc function
* @method
* @name tcog.transformers.custom.common.normalisers.result-reference-ids.normalise
*
* @description
* Finds the main video associated with
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

    locals.data.results.map(function(result) {
        result.video =
            (result.references || [])
                .filter(function(reference) {
                    return (
                        reference &&
                        reference.referenceType === 'SECONDARY' &&
                        reference.contentType === 'VIDEO');
                })
                .pop();

        result.gallery =
            (result.related || [])
                .filter(function(reference) {
                    return (
                        reference &&
                        reference.contentType === 'IMAGE_GALLERY');
                })
                .reduce(function(acc, cur) {
                    return cur.related ? acc.concat(cur.related) : cur;
                }, [])
                .map(function(item) {
                    return item.originId;
                });
    });

    return locals;
};
