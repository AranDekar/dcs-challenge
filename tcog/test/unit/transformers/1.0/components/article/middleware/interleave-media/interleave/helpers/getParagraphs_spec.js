var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',

    getParagraphs = require(componentPath + '/helpers/getParagraphs'),
    expect = require('chai').expect,
    cheerio = require('cheerio');

describe('/component/article', function() {
    describe('#interleaveMedia.getParagraphs', function() {
        it('Returns an array including all top-level elements of a' +
            ' given cheerio instance',
        function() {
            var markup = '<p>text</p><div><span>text</span></div><p></p>',
                $ = cheerio.load(markup);

            expect(getParagraphs($),
                'The return value must be an array').to.be.an('array');

            expect(getParagraphs($).length,
                'The returned array must have a length 3').to.equal(3);
        });

        it('Returns an array only including block-level elements', function() {
            var markup = '<p>text</p><div>text</div>',
                commonInlineElements = ['i', 'span', 'a', 'b', 'img'],
                $ = cheerio.load(markup),
                initialMarkupLength = markup.length;

            commonInlineElements.forEach(function(inlineElement) {
                markup += [
                    '<', inlineElement, '>',
                    'inline text',
                    '</', inlineElement, '>'
                ].join('');
            });

            expect(getParagraphs($),
                'The return value must be an array').to.be.an('array');

            expect(getParagraphs($).length,
                'The returned array must have a length 2').to.equal(2);
        });
    });
});
