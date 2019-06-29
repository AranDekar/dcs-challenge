'use strict';

module.exports = function() {
    /**
     * @ngdoc function
     *
     * @name createOpeningTag
     *
     * @description
     * Creates opening tag (including attributes) for a given dom node.
     *
     * @param  {object} node
     *
     * @return {string}
     *
     */
    return function createOpeningTag(node) {
        if (typeof node !== 'object') { return ''; }

        var openingTag = '<' + node.name,
            attribs = node.attribs,
            attribKeys = attribs && Object.keys(attribs);

        // add attributes
        if (attribKeys.length) {
            openingTag += ' ';

            attribKeys.forEach(function(attribKey, index) {
                openingTag += attribKey + '="' + attribs[attribKey] + '"';

                if (index !== (attribKeys.length - 1)) {
                    openingTag += ' ';
                }
            });
        }

        return openingTag + '>';
    };
};
