'use strict';

module.exports = function() {
    /**
     * @ngdoc function
     *
     * @name getBufferItemsAtDepth
     *
     * @description
     * Returns all items for a given depth from buffer array.
     *
     * @param  {array} buffer
     * @param  {number} depth
     *
     * @return {array}
     *
     */
    return function getBufferItemsAtDepth(buffer, depth) {
        var bufferItemsAtGivenDepth = [];
        // loop over buffer, once we've reached an item
        // which contains a depth, greater than what's asked for: bail out
        for (var i = 0, il = buffer.length; i < il; i++) {
            if (buffer[i].depth === depth) {
                bufferItemsAtGivenDepth.push(buffer[i]);
            }
            if (buffer[i].depth > depth) {
                return bufferItemsAtGivenDepth;
            }
        }
        return bufferItemsAtGivenDepth;
    };
};
