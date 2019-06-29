'use strict';

module.exports = function(voidElements) {
    /**
     * @ngdoc function
     *
     * @name createClosingTag
     *
     * @description
     * Creates closing tag for a given dom node.
     *
     * @param  {object} node
     *
     * @return {string}
     *
     */
    return function createClosingTag(node) {
        if (~voidElements.indexOf(node.name)) { return ''; }
        return '</' + node.name + '>';
    };
};
