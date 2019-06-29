'use strict';

module.exports = function() {
    /**
     * @ngdoc function
     *
     * @name generateErrorParagraph
     *
     * @description
     * Returns paragraph object containing a html comment with error description.
     *
     * @param  {string} reason
     *
     * @return {object}
     *
     */
    return function generateErrorParagraph(reason) {
        return {
            'contentType': 'HTML',
            'html': '<!-- tcog parse error: ' + reason + ' -->'
        };
    };
};
