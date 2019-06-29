var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',
    expect = require('chai').expect,
    augmentNode = require(componentPath + '/helpers/augmentNode'),
    cheerio = require('cheerio');

describe('/component/article', function() {
    describe('#interleaveMedia.augmentNode', function() {
        it('should be a function', function() {
            expect(augmentNode).to.be.a('function');
            expect(
                augmentNode.length,
                'has an arity of 2'
            ).to.equal(2);
        });

        describe('returns node untouched', function() {
            it('if no attributes', function() {
                var html = '<a />',
                    $ = cheerio.load(html),
                    node = $('a')[0];

                expect(
                    augmentNode({}, node),
                    'Returned node should be untouched'
                ).to.eql(node);
            });

            it('if attributes but no capiid attribute', function() {
                var html = '<a class="link" />',
                    $ = cheerio.load(html),
                    node = $('a')[0];

                expect(
                    augmentNode({}, node),
                    'Returned node should be untouched'
                ).to.eql(node);
            });

            it('if capiid attribute and class attribute is not "capi-link"', function() {
                var html = '<a class="foo" capiid />',
                    $ = cheerio.load(html),
                    node = $('a')[0];

                expect(
                    augmentNode({}, node),
                    'Returned node should be untouched'
                ).to.eql(node);
            });
        });

        describe('set embedType property of related asset', function() {
            it('when attributes capiid & class defined', function() {
                var html = '<a class="capi-link" capiid="12345678910" />',
                    $ = cheerio.load(html),
                    node = $('a')[0],

                    localsMock = {
                        data: {
                            related: [
                                {
                                    id: { value: '12345678910' },
                                    link: 'http://www.default.com.au',
                                    domainLinks: [
                                        {
                                            name: 'masthead.com.au',
                                            link: 'http://www.masthead.com.au'
                                        }
                                    ]
                                }
                            ]
                        },
                        query: { domain: 'masthead.com.au' }
                    },

                    result = augmentNode(localsMock, node);

                expect(
                    localsMock.data.related[0].embedType, 'embedType property correctly set'
                ).to.equal('capi-link');
            });

            it('never if class not defined', function() {
                var html = '<a capiid="12345678910" />',
                    $ = cheerio.load(html),
                    node = $('a')[0],

                    localsMock = {
                        data: {
                            related: [
                                {
                                    id: { value: '12345678910' },
                                    link: 'http://www.default.com.au',
                                    domainLinks: [
                                        {
                                            name: 'masthead.com.au',
                                            link: 'http://www.masthead.com.au'
                                        }
                                    ]
                                }
                            ]
                        },
                        query: { domain: 'masthead.com.au' }
                    },

                    result = augmentNode(localsMock, node);

                expect(
                    localsMock.data.related[0].embedType, 'embedType property should not be set'
                ).to.be.an('undefined');
            });
        });

        describe('when node has class of "capi-link"', function() {
            it('removes capiid attribute and assigns to data-id', function() {
                var html = '<a class="capi-link" capiid="12345678910" />',
                    $ = cheerio.load(html),
                    node = $('a')[0],

                    localsMock = {
                        data: { related: [] }
                    },

                    result = augmentNode(localsMock, node);

                expect(
                    result.attribs.capiid, 'Removes capiid attribute'
                ).to.be.an('undefined');

                expect(
                    result.attribs['data-id'], 'Adds data-id attribute'
                ).to.equal('12345678910');
            });

            describe('assigns href', function() {
                it('when local.query.domain matches item in domainLinks', function() {
                    var html = '<a class="capi-link" capiid="12345678910" />',
                        $ = cheerio.load(html),
                        node = $('a')[0],

                        localsMock = {
                            data: {
                                related: [
                                    {
                                        id: { value: '12345678910' },
                                        link: 'http://www.default.com.au',
                                        domainLinks: [
                                            {
                                                name: 'masthead.com.au',
                                                link: 'http://www.masthead.com.au'
                                            }
                                        ]
                                    }
                                ]
                            },
                            query: { domain: 'masthead.com.au' }
                        },
                        result = augmentNode(localsMock, node);

                    expect(
                        result.attribs.href, 'href attribute correctly assigned'
                    ).to.equal('http://www.masthead.com.au');
                });

                it(
                    'using default related.asset.link if no domain match',
                    function() {
                        var html = '<a class="capi-link" capiid="12345678910" />',
                            $ = cheerio.load(html),
                            node = $('a')[0],

                            localsMock = {
                                data: {
                                    related: [
                                        {
                                            id: { value: '12345678910' },
                                            link: 'http://www.default.com.au',
                                            domainLinks: [
                                                {
                                                    name: 'masthead.com.au',
                                                    link: 'http://www.masthead.com.au'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            },

                            result = augmentNode(localsMock, node);

                        expect(
                            result.attribs.href, 'href attribute correctly assigned'
                        ).to.equal('http://www.default.com.au');
                    }
                );

                it('never if no valid link found', function() {
                    var html = '<a class="capi-link" capiid="1234568910" />',
                        $ = cheerio.load(html),
                        node = $('a')[0],

                        localsMock = {
                            data: { related: [] }
                        },

                        result = augmentNode(localsMock, node);

                    expect(
                        result.attribs.href, 'href attribute is not assigned'
                    ).to.be.an('undefined');
                });
            });
        });
    });
});
