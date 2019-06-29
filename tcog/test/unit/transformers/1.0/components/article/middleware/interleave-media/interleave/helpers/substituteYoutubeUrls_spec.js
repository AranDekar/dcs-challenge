var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',

    expect = require('chai').expect,
    substituteYoutubeUrls = require(componentPath + '/helpers/substituteYoutubeUrls');

describe('/component/article', function() {
    describe('#interleaveMedia.substituteYoutubeUrls', function() {
        it('Subsitutes youtube urls to enable embedding ' +
            'for iframes',
        function() {
            var paragraphs = [{
                contentType: 'IFRAME',
                iframeUrl: 'http://youtube.com/watch/v=abcd'
            }, {
                contentType: 'IFRAME',
                iframeUrl: 'https://youtube.com/watch/v=efgh'
            }];

            expect(substituteYoutubeUrls(paragraphs[0]),
                'The returned value must be an object').to.be.an('object');

            expect(substituteYoutubeUrls(paragraphs[1]),
                'The returned value must be an object').to.be.an('object');

            expect(substituteYoutubeUrls(paragraphs[0]).iframeUrl,
                'The iframeUrl must be substituted correctly')
                .to.equal('//www.youtube.com/embed/abcd');

            expect(substituteYoutubeUrls(paragraphs[1]).iframeUrl,
                'The iframeUrl must be substituted correctly')
                .to.equal('//www.youtube.com/embed/efgh');
        });
    });
});
