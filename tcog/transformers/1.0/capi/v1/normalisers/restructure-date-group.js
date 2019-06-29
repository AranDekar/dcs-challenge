var moment = require('moment-timezone'),
    utils = require('./utils');

/**
* @ngdoc function
* @method
* @name tcog.transformers.custom.common.normalisers.restructureDateGroup.normalise
*
* @description
* Normaliser which marks the most recent items for each day in the API result.
* The intention is to enable date headers in templates.
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

    function floorToDay(time) {
        return moment.parseZone(time).startOf('day').valueOf();
    }

    locals.data.results =
        (locals.data.results || []).map(function(cur, idx, arr) {
            var prev = arr[idx - 1] || {},
                date = floorToDay(cur.dateLive),
                prevDate = floorToDay(prev.dateLive);

            cur.markDate = date !== prevDate;

            return cur;
        });

    return locals;
};
