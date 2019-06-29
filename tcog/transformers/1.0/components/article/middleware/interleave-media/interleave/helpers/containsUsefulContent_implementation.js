'use strict';

module.exports = function() {
    /**
     * @ngdoc function
     *
     * @name containsUsefulContent
     *
     * @description
     * Filter to remove items, which are contain empty tags
     *
     * @param  {object} paragraph
     *
     * @return {object}
     *
     */
    return function containsUsefulContent(paragraph) {
    // always keep non-html content
        if (paragraph.contentType !== 'HTML') {
            return true;
        }

        if (!paragraph.html || paragraph.html === '') {
            return false;
        }

        return true;
    };
};
