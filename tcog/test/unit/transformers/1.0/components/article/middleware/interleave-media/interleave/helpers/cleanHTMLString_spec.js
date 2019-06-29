var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',
    expect = require('chai').expect,

    cleanHTMLString = require(componentPath + '/helpers/cleanHTMLString'),
    cheerio = require('cheerio');

describe('/component/article', function() {
    describe('#interleaveMedia.cleanHTMLString', function() {
        it('Removes double-whitespace elements from code', function() {
            var cleaned = cleanHTMLString(
                '<p>this  is  a  test\n\n\n!</p>'
            );

            expect(cleaned)
                .to.equal('<p>this is a test !</p>');
        });

        it('Removes spaces before and after closing p tags', function() {
            var cleaned = cleanHTMLString(
                '<p>this  is  a  test!  \n </p> \n'
            );

            expect(cleaned)
                .to.equal('<p>this is a test!</p>');
        });

        it('Removes spaces before and after opening p tags', function() {
            var cleaned = cleanHTMLString(
                '  \n  <p>  \n this  is  a  test!</p>'
            );

            expect(cleaned).to.equal('<p>this is a test!</p>');
        });

        it('Removes whitespace at the beginning of lines', function() {
            var cleaned = cleanHTMLString(
                '   <li>this</li>\n    <li>is</li>\n  <li>a test</li>'
            );

            expect(cleaned)
                .to.equal('<li>this</li> <li>is</li> <li>a test</li>');
        });

        it('Removes whitespace at the end of lines', function() {
            var cleaned = cleanHTMLString(
                '<li>this</li>      \n<li>is</li>    \n<li>a test</li>    '
            );

            expect(cleaned)
                .to.equal('<li>this</li> <li>is</li> <li>a test</li>');
        });

        it('Deletes blank spans', function() {
            var cleaned = cleanHTMLString(
                '<p>foo<span /></p><p>bar<span>   </span></p>'
            );

            expect(cleaned)
                .to.equal('<p>foo</p>\n<p>bar</p>');
        });

        it('Retains target attributes from anchor tags', function() {
            var cleaned = cleanHTMLString(
                '<p>' +
                '<a href="http://tcog.com" target="_blank">text</a>' +
                '</p>'
            );
            expect(cleaned)
                .to.equal('<p><a href="http://tcog.com" target="_blank">text</a></p>');
        });

        it(
            "Doesn't remove tags which were previously stripped in old versions of the code",
            function() {
                var cleaned = cleanHTMLString("<p>foo<iframe /></p><link rel='foo'/>");
                expect(cleaned).to.equal('<p>foo<iframe></iframe></p>\n<link rel="foo">');
            }
        );
    });
});
