'use strict';

module.exports = function() {
    /**
     * @ngdoc function
     *
     * @name findAssetByIdInRelatedArray
     *
     * @description
     * Returns first element for a given id from the arrary of related elements.
     *
     * @param {number} id
     * @param {array} relatedArray
     *
     * @return {array}
     *
     */
    return function findAssetByIdInRelatedArray(id, relatedArray) {
        return (
            relatedArray.filter(function(capiItem) {
                return capiItem.id && capiItem.id.value === id;
            })
                .shift()
        );
    };
};
