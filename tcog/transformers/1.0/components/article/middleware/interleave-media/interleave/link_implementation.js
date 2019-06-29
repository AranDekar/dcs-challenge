'use strict';

module.exports = function(cheerio, helpers) {
    /**
     * @ngdoc function
     *
     * @name interleaveLink
     *
     * @description
     * Simple helper which interleaves the correct href for link tags with a class
     * of capi-link if they are contained within the html string
     *
     * @param  {string}      input      the content to interleave
     * @param  {Object}      locals     provides access to the request locals
     * @param  {Function}    callback   callback handler
     *
     * @return {Array}
     *
     */
    return function interleaveLink(input, locals, callback) {
        if (!input) { return; }

        var $, output, nodeAugmentor;

        try {
            $ = cheerio.load(input);
        } catch (err) {
            return callback(err, input), input;
        }

        nodeAugmentor = helpers.augmentNode.bind(null, locals);

        output = helpers.getParagraphs($);
        output = helpers.processParagraphs($, output, nodeAugmentor);
        output = output[0] && output[0].html;

        return callback(null, output), output;
    };
};
