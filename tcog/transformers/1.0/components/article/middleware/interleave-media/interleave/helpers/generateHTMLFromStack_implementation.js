'use strict';

module.exports = function(getBufferItemsAtDepth, createOpeningTag, createClosingTag) {
    /**
     * @ngdoc function
     *
     * @name generateHTMLFromStack
     *
     * @description
     * Generates markup string from current buffer and stack.
     *
     * @param  {array} stack
     * @param  {array} buffer
     *
     * @return {array}
     *
     */
    return function generateHTMLFromStack(stack, buffer) {
        var unclosedNodes = [],
            mergedStack = [],
            markupArray = [];

        // insert buffer elements at their given depth
        mergedStack = stack.reduce(function(result, stackItem, depth) {
            var bufferItemsAtCurrentDepth = getBufferItemsAtDepth(buffer, depth);

            result.push(stackItem);

            if (bufferItemsAtCurrentDepth) {
                result = result.concat(bufferItemsAtCurrentDepth);
            }

            return result;
        }, []);

        mergedStack.forEach(function(stackItem, index) {
            var nextStackItem = mergedStack[index + 1],
                closeNode = false,
                lastUnclosed,
                processUnclosed,
                i;

            // text
            if (stackItem.type === 'TEXT') {
                markupArray.push(stackItem.node.data);
            }

            // tag
            if (stackItem.type === 'TAG') {
                markupArray.push(createOpeningTag(stackItem.node));

                // if any of the remaing nodes are direct children to the current
                // node - don't close
                if (!stackItem.node.children) {
                    return markupArray.push(createClosingTag(stackItem.node));
                }

                unclosedNodes.push(stackItem.node);
            }

            if (!nextStackItem || !unclosedNodes.length) {
                return;
            }

            lastUnclosed = unclosedNodes[unclosedNodes.length - 1],
            processUnclosed = !~lastUnclosed.children.indexOf(nextStackItem.node);

            if (processUnclosed) {
                i = unclosedNodes.length;

                while (i--) {
                    lastUnclosed = unclosedNodes[unclosedNodes.length - 1];
                    closeNode = !~unclosedNodes[i].children.indexOf(nextStackItem.node) &&
                                   !~lastUnclosed.children.indexOf(nextStackItem.node) &&
                                   unclosedNodes[i].parent !== null;

                    if (closeNode) {
                        markupArray.push(createClosingTag(unclosedNodes.pop()));
                    }
                }
            }
        });

        // add remaining unclosed tags
        markupArray = markupArray.concat(
            unclosedNodes.reverse().map(createClosingTag)
        );

        return markupArray.join('');
    };
};
