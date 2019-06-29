'use strict';

module.exports = function(blockElements) {
    /**
     * @ngdoc function
     *
     * @name getParagraphs
     *
     * @description
     * Returns a cheerio element's children as an array. Drops non-block elements.
     *
     * @param  {object} $ [description]
     *
     * @return {array}   [description]
     *
     */
    return function getParagraphs($) {
    // Find all the immediate block-level children of the root document
        var paragraphs =
            [].slice.call($.root().children())
                .filter(function(item) {
                    return !!~blockElements.indexOf(item.name);
                })
                .map(function(item) {
                    return $(item);
                });

        return paragraphs;
    };
};
