var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',

    getBufferItemsAtDepth = require(componentPath + '/helpers/getBufferItemsAtDepth'),
    expect = require('chai').expect,
    cheerio = require('cheerio');

describe('/component/article', function() {
    describe('#interleaveMedia.getBufferItemsAtDepth', function() {
        it('Returns all items within the buffer at a given depth', function() {
            var buffer = [{
                depth: 1
            }, {
                depth: 1
            }, {
                depth: 2
            }, {
                depth: 2
            }, {
                depth: 2
            }, {
                depth: 3
            }, {
                depth: 3
            }, {
                depth: 3
            }, {
                depth: 3
            } ];

            expect(getBufferItemsAtDepth(buffer, 1),
                'The result must be an array')
                .to.be.an('array');

            expect(getBufferItemsAtDepth(buffer, 1).length,
                'The returned array must be of length 2')
                .to.equal(2);

            expect(getBufferItemsAtDepth(buffer, 2).length,
                'The returned array must be of length 4')
                .to.equal(3);

            expect(getBufferItemsAtDepth(buffer, 3).length,
                'The returned array must be of length 4')
                .to.equal(4);
        });

        it('Returns an empty array if there are no buffer items' +
            ' with the given depth',
        function() {
            var buffer = [{
                depth: 1
            }, {
                depth: 1
            }, {
                depth: 2
            }, {
                depth: 2
            }];

            expect(getBufferItemsAtDepth(buffer, 1),
                'The result must be an array')
                .to.be.an('array');

            expect(getBufferItemsAtDepth(buffer, 3).length,
                'The returned array must be of length 0')
                .to.equal(0);
        });
    });
});
