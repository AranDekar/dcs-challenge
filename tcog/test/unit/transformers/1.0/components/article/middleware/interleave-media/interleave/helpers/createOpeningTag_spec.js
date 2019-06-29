var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',

    createOpeningTag = require(componentPath + '/helpers/createOpeningTag'),
    expect = require('chai').expect,
    cheerio = require('cheerio');

describe('/component/article', function() {
    describe('#interleaveMedia.createOpeningTag', function() {
        it('Returns an opening tag for a given dom element', function() {
            var $ = cheerio.load('<p><span>Hello</span></p>'),
                domElement = $('p').get(0);

            expect(createOpeningTag(domElement),
                'It must create a valid opening tag')
                .to.equal('<p>');
        });

        it('Retains all attributes on the returned opening tag', function() {
            var $ = cheerio.load(
                    '<p class="className" id="idName">' +
                    '<span>Hello</span>' +
                    '</p>'
                ),
                domElement = $('p').get(0);

            expect(createOpeningTag(domElement),
                'It must retain all attributes of the given dom element')
                .to.equal('<p class="className" id="idName">');
        });
    });
});
