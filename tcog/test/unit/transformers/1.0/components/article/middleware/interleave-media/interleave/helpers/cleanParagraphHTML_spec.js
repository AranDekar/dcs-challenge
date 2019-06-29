var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',

    cleanParagraphHTML = require(componentPath + '/helpers/cleanParagraphHTML'),
    expect = require('chai').expect,
    cheerio = require('cheerio');

describe('/component/article', function() {
    describe('#interleaveMedia.cleanParagraphHTML', function() {
        it('Cleans HTML for a paragraph object', function() {
            var paragraphs = [{
                contentType: 'HTML',
                html: '<p>Hello</p> '
            }, {
                contentType: 'HTML',
                html: '<div>Hello</p> '
            }, {
                contentType: 'HTML',
                html: '<span>Hello</p> '
            }];

            var cleanedParagraphs = paragraphs.map(cleanParagraphHTML);

            expect(cleanedParagraphs,
                'The return value must be an array')
                .to.be.an('array');

            expect(cleanedParagraphs.length,
                'The returned array must be of length ' + paragraphs.length)
                .to.equal(paragraphs.length);

            expect(cleanedParagraphs[0].html,
                "The returned array's nth item's result must be cleaned HTML")
                .to.equal('<p>Hello</p>');
        });
    });
});
