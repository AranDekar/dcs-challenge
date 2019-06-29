var utils = require('./utils'),
    _ = require('lodash');

/**
* @ngdoc function
* @method
* @name tcog.transformers.custom.common.normalisers.addResultsArray.normalise
*
* @description
* Adds a circular reference to documents which are requested via the 'retrieve'
* endpoint so they can be passed through other normalisers and templates built
* for the search endpoint.
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
    // must not run against Collections or data that already contains results.
    if (utils.containsCollection([locals.data]) || locals.data.results) {
        return locals;
    }

    // Need to normalise given that "results" property doesn't exist. We do so
    // by cloning res.locals.data so that we don't end up with a circular
    // reference that will cause an error further down the chain if calling
    // JSON.stringify(...).
    locals.data.results = [_.clone(locals.data)];

    return locals;
};
