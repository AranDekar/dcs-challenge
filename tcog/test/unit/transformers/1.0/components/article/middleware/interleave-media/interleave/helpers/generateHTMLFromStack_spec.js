var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',
    expect = require('chai').expect,
    generateHTMLFromStack = require(componentPath + '/helpers/generateHTMLFromStack'),
    cheerio = require('cheerio');

describe('/component/article', function() {
    describe('#interleaveMedia.generateHTMLFromStack', function() {
        it('Returns an empty string if the stack and' +
            ' buffer are empty',
        function() {
            var stack = [],
                buffer = [],
                expectedOutput = '';

            expect(generateHTMLFromStack(stack, buffer),
                'The returned string must be empty').to.equal(expectedOutput);
        });

        it('Returns correct html for a given stack and buffer', function() {
            var html = '<p>text 1<span>text 2<i>text 3</i></span></p>',
                $ = cheerio.load(html),
                stack = [{
                    type: 'TAG',
                    node: $('p')[0]
                }, {
                    type: 'TAG',
                    node: $('span')[0]
                }, {
                    type: 'TAG',
                    node: $('i')[0]
                }],
                buffer = [{
                    type: 'TEXT',
                    node: $('p')[0].children[0],
                    depth: 0
                }, {
                    type: 'TEXT',
                    node: $('span')[0].children[0],
                    depth: 1
                }, {
                    type: 'TEXT',
                    node: $('i')[0].children[0],
                    depth: 2
                }];

            expect(generateHTMLFromStack(stack, buffer),
                'The returned value must be a string')
                .to.be.a('string');

            expect(generateHTMLFromStack(stack, buffer),
                'The returned string must match the expected output')
                .to.equal(html);
        });
    });
});
