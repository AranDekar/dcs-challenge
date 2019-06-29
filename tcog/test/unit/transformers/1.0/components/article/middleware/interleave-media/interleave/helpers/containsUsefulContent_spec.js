var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',

    containsUsefulContent = require(componentPath + '/helpers/containsUsefulContent'),
    expect = require('chai').expect,
    cheerio = require('cheerio');

describe('/component/article', function() {
    describe('#interleaveMedia.containsUsefulContent', function() {
        it("Always returns true for paragraphs which's" +
            " contentType is not 'HTML'",
        function() {
            var nonHTMLParagraph = {
                contentType: 'IMAGE'
            };

            expect(containsUsefulContent(nonHTMLParagraph),
                'The return value must be true').to.equal(true);
        });

        it('Returns false for paragraphs without an ' +
            'html property',
        function() {
            var nonHTMLParagraph = {
                contentType: 'HTML'
            };

            expect(containsUsefulContent(nonHTMLParagraph),
                'The return value must be false')
                .to.equal(false);
        });

        it("Returns false for paragraphs which's html property only" +
            ' contains an empty string',
        function() {
            var nonHTMLParagraph = {
                contentType: 'HTML',
                html: ''
            };

            expect(containsUsefulContent(nonHTMLParagraph),
                'The return value must be false')
                .to.equal(false);
        });
    });
});
