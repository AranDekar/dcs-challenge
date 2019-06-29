var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',

    createClosingTag = require(componentPath + '/helpers/createClosingTag'),
    expect = require('chai').expect,
    cheerio = require('cheerio');

describe('/component/article', function() {
    describe('#interleaveMedia.createClosingTag', function() {
        it('Returns an opening tag for a given dom element', function() {
            var $ = cheerio.load('<p><span>Hello</span></p>'),
                p = $('p').get(0),
                span = $('span').get(0);

            expect(createClosingTag(p),
                'It must create a valid closing tag')
                .to.equal('</p>');

            expect(createClosingTag(span),
                'It must create a valid closing tag')
                .to.equal('</span>');
        });
    });
});
