var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',
    expect = require('chai').expect,
    generateErrorParagraph = require(componentPath + '/helpers/generateErrorParagraph');

describe('/component/article', function() {
    describe('#interleaveMedia.generateErrorParagraph', function() {
        it('Generates a paragraph containing an error message', function() {
            var errorReason = 'something failed',
                errorParagraph = generateErrorParagraph(errorReason);

            expect(errorParagraph,
                'The error paragraph must be an object').to.be.an('object');

            expect(errorParagraph.html,
                'The error paragraphs html must contain the passed in reason')
                .contain(errorReason);
        });
    });
});
