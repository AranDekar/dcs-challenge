'use strict';

module.exports = function(cheerio, helpers) {
    /**
     * @ngdoc function
     *
     * @name isXHTML
     *
     * @description
     *
     * Returns boolean to indicate if xhtml void elements detected.
     *
     * @param  {string}      input      the content to interleave
     *
     * @return {Boolean}
     *
     */
    function isXHTML(input) {
        const REGEX_VOID_ELEMENTS = /<[^>]+?\/>/gi,
            voidElements = input.match(REGEX_VOID_ELEMENTS) || [],
            XHTMLVoidElements = voidElements.filter(element => {
                for (const voidElement of helpers.voidElements) {
                    if (element.includes(voidElement)) { return false; }
                }

                return true;
            });

        return (XHTMLVoidElements && XHTMLVoidElements.length > 0);
    }

    /**
     * @ngdoc function
     *
     * @name interleaveBody
     *
     * @description
     * Creates an array of paragraphs by extracting and cleaning up a string containing
     * html. Should references to capi assets be found, the related asset is interleaved
     * into the array
     *
     * @param  {string}      input      the content to interleave
     * @param  {Object}      locals     provides access to the request locals
     * @param  {Function}    callback   callback handler
     *
     * @return {Array}
     *
     */
    return function interleaveBody(input, locals, callback) {
        if (!input) { return []; }

        var data = locals.data || {},
            paragraphs = [],
            $, getRelatedAssets, nodeAugmentor;

        try {
            const xmlMode = isXHTML(input);

            $ = cheerio.load(input, { xmlMode: xmlMode });
        } catch (err) {
            return callback(err, paragraphs), paragraphs;
        }

        nodeAugmentor = helpers.augmentNode.bind(null, locals);
        getRelatedAssets = helpers.pickRelated.bind(null, data.related);

        paragraphs = helpers.getParagraphs($);
        paragraphs = helpers.processParagraphs($, paragraphs, nodeAugmentor)
            .map(getRelatedAssets)
            .map(helpers.substituteYoutubeUrls)
            .map(helpers.cleanParagraphHTML)
            .filter(helpers.containsUsefulContent);

        return callback(null, paragraphs), paragraphs;
    };
};
