var componentPath = '../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave/link',

    implementation = require(componentPath + '_implementation'),
    expect = require('chai').expect,
    interleaveLink = require(componentPath);

describe('/component/article', function() {
    describe('#interleaveMedia/link', function() {
        it('should be a function', function() {
            expect(interleaveLink).to.be.a('function');
            expect(
                interleaveLink.length,
                'has an arity of 3'
            ).to.eql(3);
        });

        describe('correctly interleaves', function() {
            it('if related assets present', function() {
                var html = '<p class="standfirst-content"><a class="capi-link" ' +
                                 'capiid="1234">CHP story</a> standfirst <a capiid="5678"' +
                                 ' class="capi-link">KL story link</a></p>',

                    result = interleaveLink(html, {
                        data: {
                            related: [
                                {
                                    id: { value: '1234' },
                                    link: 'http://foo.bar'
                                }, {
                                    id: { value: '5678' },
                                    link: 'http://buzz.bizz'
                                }
                            ]
                        }
                    }, function() {});

                expect(
                    result,
                    'returned html correctly interleaved'
                ).to.equal(
                    '<p class="standfirst-content"><a class="capi-link" data-id="1234" ' +
                    'href="http://foo.bar">CHP story</a> standfirst <a class="capi-link" ' +
                    'data-id="5678" href="http://buzz.bizz">KL story link</a></p>'
                );
            });

            it('if related assets not present', function() {
                var html = '<p class="standfirst-content"><a class="capi-link" ' +
                                 'capiid="1234">CHP story</a> standfirst <a capiid="5678"' +
                                 ' class="capi-link">KL story link</a></p>',

                    result = interleaveLink(html, {
                        data: { related: [] }
                    }, function() {});

                expect(
                    result,
                    'returned html correctly interleaved'
                ).to.equal(
                    '<p class="standfirst-content"><a class="capi-link" data-id="1234"' +
                    '>CHP story</a> standfirst <a class="capi-link" ' +
                    'data-id="5678">KL story link</a></p>'
                );
            });

            it('when input is an array and items wrapped in p tag', function() {
                var html = [
                        '<a capiid="1234" class="capi-link">kurator story link BL</a>',
                        '<a capiid="1234" class="capi-link">kurator story link BL</a>'
                    ],

                    locals = { data: { related: [] } },
                    results = html.reduce(function(acc, current) {
                        current = '<p>' + current + '</p>';
                        current = interleaveLink(current, locals, function() {});
                        current = current.substring(3, current.length - 4);
                        acc.push(current);
                        return acc;
                    }, []);

                expect(
                    results,
                    'returned html correctly interleaved'
                ).to.eql([
                    '<a class="capi-link" data-id="1234">kurator story link BL</a>',
                    '<a class="capi-link" data-id="1234">kurator story link BL</a>'
                ]);
            });
        });
    });
});
