'use strict';

module.exports = function() {
    /*
    * @ngdoc function
    *
    * @name createParagraph
    *
    * @description
    * Creates paragraph object
    *
    * @param  {string} html
    *
    * @return {object}
    *
    */

    return function createParagraph(html) {
        return {
            contentType: 'HTML',
            html: html
        };
    };
};
