'use strict';

module.exports = function(cheerio, voidElements) {
    /**
     * @ngdoc function
     *
     * @name cleanHTMLString
     *
     * @description
     * Removes unnecessary whitespace and empty dom elements.
     *
     * @param  {object} paragraph
     *
     * @return {object}
     *
     */

    return function cleanHTMLString(HTMLString) {
        if (!HTMLString) {
            return false;
        }

        var cleanedHTML,
            $;

        // reduce multiple whitespace characters
        // remove whitespace from empty tags

        cleanedHTML = HTMLString
            // replace multiple whitespaces
            .replace(/\s+/g, ' ')
            // remove whitespace within empty tags
            .replace(/\>\s+<\//, '></')
            // remove whitespace before and after closing p tags
            .replace(/<\s*p\s*>\s+/ig, '<p>')
            // removes spaces before and after closing p tags
            .replace(/\s*<\s*\/\s*p\s*>\s*/ig, '</p>\n')
            .trim();

        // load cheerio

        $ = cheerio.load(cleanedHTML);

        // remove empty elements (containing whitespace is not 'empty')

        $('*:empty').not(voidElements.join(',')).remove();

        return $.html().trim();
    };
};
