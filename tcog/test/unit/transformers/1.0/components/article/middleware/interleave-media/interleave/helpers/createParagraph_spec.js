var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',
    expect = require('chai').expect,
    createParagraph = require(componentPath + '/helpers/createParagraph');

describe('/component/article', function() {
    describe('#interleaveMedia.createParagraph', function() {
        it('Returns a paragraph object', function() {
            var html = '<p>HTML</p>',
                paragraph = createParagraph(html);

            expect(paragraph,
                'The returned value must be an object').to.be.an('object');

            expect(paragraph.html,
                "The html property's value must match the input")
                .to.equal(html);
        });
    });
});
