var utils = require('./utils');

/**
* @ngdoc function
* @method
* @name tcog.transformers.custom.common.normalisers.flatten-collection.normalise
*
* @description
* Normaliser which flattens, sorts, and orders a collection as returned by the
* content API, according to the original sort parameters passed to the API. It
* also truncates the content according to pageSize.
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
    // must run against Collections
    if (!utils.containsCollection(locals.data.results)) {
        return locals;
    }

    locals.data.results =
        // Flatten the list
        locals.data.results.reduce(function(accumulator, result) {
            return accumulator.concat(result.related || []);
        }, [])

        // Sort the result by date descending
            .sort(function(a, b) {
                return (
                    (new Date(b.dateLive)).getTime() -
                (new Date(a.dateLive)).getTime()
                );
            });

    // Save the meta-information back into the API object
    locals.data.resultSize = locals.data.results.length;
    return locals;
};
