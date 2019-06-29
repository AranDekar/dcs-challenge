'use strict';

module.exports = function(cleanHTMLString) {
    /**
     * @ngdoc function
     *
     * @name cleanParagraphHTML
     *
     * @description
     * Cleans html property of an paragraph object
     *
     * @param  {object} paragraph
     *
     * @return {object}
     *
     */

    return function cleanParagraphHTML(paragraph) {
        if (typeof paragraph !== 'object' || typeof paragraph.html !== 'string') {
            return paragraph;
        }

        paragraph.html = cleanHTMLString(paragraph.html);
        return paragraph;
    };
};
