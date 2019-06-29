'use strict';

module.exports = function(generateErrorParagraph, findAssetByIdInRelatedArray) {
    /**
     * @ngdoc function
     *
     * @name pickRelated
     *
     * @description
     * Returns related media element if the given paragraph contains an id
     * and it is valid.
     *
     * Returns an error paragraph, containing a html comment, if the provided id
     * is not present within the related array.
     *
     * @param  {array} relatedArray
     * @param  {object} paragraph
     * @param  {number} index
     *
     * @return {object}
     *
     */
    return function pickRelated(relatedArray, paragraph, index) {
    // HTML paragraphs should not be picked
        if (paragraph.contentType === 'HTML') {
            return paragraph;
        }

        // If the paragraph in question does not have an ID, we make a note of that
        if (!paragraph.id) {
            return (
                generateErrorParagraph(
                    'Embeded asset ' + index + ' did not have a valid ID.'));
        }

        var asset = findAssetByIdInRelatedArray(paragraph.id, relatedArray);

        // If the asset could not be found in the map, we make a note of that
        if (!asset) {
            return (
                generateErrorParagraph(
                    'Embeded asset ' + paragraph.id + ' was not found in the ' +
                    'article metadata.'));
        }

        return asset;
    };
};
