'use strict';

module.exports = function(voidElements, createParagraph, generateHTMLFromStack) {
    /**
     * @ngdoc function
     *
     * @name processParagraphs
     *
     * @description
     * Takes in an array of cheerio elements and returns an array
     * of paragraph objects.
     *
     * Interleaves each cheerio element's capi-items.
     *
     * @param  {object} $
     * @param  {array} paragraphs
     * @param  {array} paragraphs an array of related elements
     *
     * @return {array}
     *
     */
    return function processParagraphs($, paragraphs, augmentNode) {
        var processedParagraphsArray = [];

        paragraphs.forEach(function(paragraph) {
            var stack = [],
                buffer = [];

            // push the node first - we will be iterating over its children
            stack.push({ type: 'TAG', node: $(paragraph).get(0) });

            processedParagraphsArray =
                processedParagraphsArray.concat(
                    (function nodeIterator(node, stack, buffer, discoveredParagraphs) {
                    // push void elements straight away
                        if (node.is(voidElements.join())) {
                            discoveredParagraphs.push(
                                createParagraph(node.toString())
                            );
                            return discoveredParagraphs;
                        }

                        // need to call contents() - we need text nodes
                        [].forEach.call(node.contents(), function(node) {
                            node = augmentNode(node);

                            if (node.type === 'tag' && !node.attribs.capiid) {
                                stack.push({ type: 'TAG', node: node });

                                // walk down the tree
                                if (node.childNodes.length) {
                                    nodeIterator(
                                        $(node),
                                        stack,
                                        buffer,
                                        discoveredParagraphs
                                    );
                                }
                            }

                            if (node.attribs && node.attribs.capiid) {
                                if (buffer.length) {
                                    discoveredParagraphs.push(
                                        createParagraph(
                                            generateHTMLFromStack(stack, buffer)
                                        )
                                    );
                                    // empty buffer
                                    buffer.length = 0;
                                }

                                // push current node on discoveredParagraphs
                                discoveredParagraphs.push({
                                    id: node.attribs.capiid
                                });
                            }

                            if (node.type === 'text') {
                                buffer.push({
                                    type: 'TEXT',
                                    depth: stack.length - 1,
                                    node: node
                                });
                            }
                        });

                        return discoveredParagraphs;
                    })(paragraph, stack, buffer, [])
                );

            if (buffer.length) {
                processedParagraphsArray.push(
                    createParagraph(
                        generateHTMLFromStack(stack, buffer)
                    )
                );
                // empty buffer
                buffer.length = 0;
            }
        });

        return processedParagraphsArray;
    };
};
