// Require the actual component

var basePath = '../../../../../../../transformers/1.0/components/article/middleware/',
    deconstructArticleURL = require(basePath + '/deconstruct-article-url'),
    testURLs = require('./fixtures/deconstruct-article-url.json'),
    expect = require('chai').expect,

    generateUrls = function(url, callback) {
        var media = ['story', 'gallery', 'photos'],
            urls = ~url.indexOf('{media}-') ? media.map(function(item) {
                return url.replace('{media}', item);
            }) : [url];

        return urls;
    },

    cleanURL = function(url) {
        url = url.split('/').filter(function(item) {
            return item && item.length > 0;
        }).join('/');
        return '/' + url;
    };

describe('/component/article', function() {
    describe('#exports.deconstructArticleURL', function() {
        describe('Successfully deconstructs article URLs into an object on res.locals', function() {
            [
                {
                    name: 'Correctly places parsed article URL in res.locals from the URL',
                    process: function(url, test, fakeReq, fakeRes) {
                        expect(fakeRes.locals).to.be.an('object');
                        expect(fakeRes.locals.config.articleURL).to.be.an('object');
                    }
                }, {
                    name: 'Correctly creates a section array from the URL',
                    process: function(url, test, fakeReq, fakeRes) {
                        expect(fakeRes.locals.config.articleURL.section).to.be.an('array');
                        expect(url.replace(/\/\/+/g, '/').indexOf(fakeRes.locals.config.articleURL.section.join('/'))).to.be.greaterThan(-1);
                        expect(fakeRes.locals.config.articleURL.section.join('')).to.match(/^[a-z\-]*$/);
                    }
                }, {
                    name: 'Correctly extracts the slug from the URL',
                    process: function(url, test, fakeReq, fakeRes) {
                        if (test.slug) {
                            expect(url.indexOf(fakeRes.locals.config.articleURL.slug)).to.be.greaterThan(-1);
                            expect(fakeRes.locals.config.articleURL.slug).to.match(/[a-z\-]+/);
                        } else {
                            expect(fakeRes.locals.config.articleURL.slug).to.equal(undefined);
                        }
                    }
                }, {
                    name: 'Correctly parses the fatwire section ID from the URL',
                    process: function(url, test, fakeReq, fakeRes) {
                        if (test.sectionID) {
                            expect(url.indexOf(fakeRes.locals.config.articleURL.sectionID)).to.equal(-1);
                            expect(fakeRes.locals.config.articleURL.sectionID).to.be.a('number');
                            expect(fakeRes.locals.config.articleURL.sectionID).to.match(/[0-9]+/);
                        } else {
                            expect(fakeRes.locals.config.articleURL.sectionID).to.equal(null);
                        }
                    }
                }, {
                    name: 'Correctly extracts the ID from the URL',
                    process: function(url, test, fakeReq, fakeRes) {
                        expect(url.indexOf(fakeRes.locals.config.articleURL.id)).to.be.greaterThan(-1);
                        expect(fakeRes.locals.config.articleURL.id).to.be.a('string');
                        expect(fakeRes.locals.config.articleURL.id).to.match(/[a-z\-0-9]+/);
                    }
                }, {
                    name: 'Correctly determines the originID from the URL',
                    process: function(url, test, fakeReq, fakeRes) {
                        if (test.origin === 'methode') {
                            expect(fakeRes.locals.config.articleURL.origin).to.be.a('string');
                            expect(fakeRes.locals.config.articleURL.origin).to.equal('methode');
                        } else if (test.origin === 'capi') {
                            expect(fakeRes.locals.config.articleURL.origin).to.be.a('string');
                            expect(fakeRes.locals.config.articleURL.origin).to.equal('capi');
                        } else {
                            expect(fakeRes.locals.config.articleURL.origin).to.be.a('string');
                            expect(fakeRes.locals.config.articleURL.origin).to.equal('fatwire');
                        }
                    }
                }, {
                    name: 'Correctly creates a valid upstream ID from the URL',
                    process: function(url, test, fakeReq, fakeRes) {
                        var origin = fakeRes.locals.config.articleURL.origin,
                            id = fakeRes.locals.config.articleURL.id,
                            upstream = origin === 'capi' ? id : 'origin:' + origin + '.' + id;

                        // Upstream ID
                        expect(fakeRes.locals.config.articleURL.upstreamID).to.equal(upstream);
                    }
                }, {
                    name: 'Matches comparison test cases, key for key, from the URL',
                    process: function(url, test, fakeReq, fakeRes) {
                        var keys = Object.keys(fakeRes.locals.config.articleURL);
                        keys.forEach(function(key) {
                            var value = key === 'uri' ? cleanURL(url) : test[key];
                            expect(fakeRes.locals.config.articleURL[key]).to.eql(value);
                        });
                    }
                }

            ].forEach(function(suite) {
                describe(suite.name, function() {
                    testURLs.forEach(function(test) {
                        var fakeReq,
                            fakeRes = fakeReq = { 'locals': {} }; // jshint ignore:line

                        generateUrls(test.input).forEach(function(url) {
                            it(url, function() {
                                var processor = suite.process.bind(null,
                                    url,
                                    test.output,
                                    fakeReq,
                                    fakeRes);
                                fakeReq.params = [url];
                                deconstructArticleURL(fakeReq, fakeRes, processor);
                            });
                        });
                    });
                });
            });

            describe('Error conditions', function() {
                it('Ends request with a 404 if unable to determine id', function(done) {
                    var errorMsg = '{"message":"Content doesn\'t exist","code":404}',
                        fakeReq = {},
                        fakeRes = fakeReq = { 'locals': {} }; // jshint ignore:line

                    fakeReq.params = ['impossible-to-match'];

                    fakeRes.status = function(status) {
                        expect(status).to.equal(404);

                        return {
                            'end': function(message) {
                                expect(message).to.equal(errorMsg);
                                done();
                            }
                        };
                    };

                    deconstructArticleURL(fakeReq, fakeRes, function(err) {
                        throw new Error('This function should not have executed.');
                    });
                });

                it('Ends request with a 404 if fatwire id length < 13', function(done) {
                    var errorMsg = '{"message":"Content doesn\'t exist","code":404}',
                        fakeReq = {},
                        fakeRes = fakeReq = { 'locals': {} }; // jshint ignore:line

                    fakeReq.params = [
                        'entertainment/movies/movie-quotes-you-always-get-wrong/' +
                        'story-921f2944f4c87ff721d8e8949db122b0-1476014'
                    ];

                    fakeRes.status = function(status) {
                        expect(status).to.equal(404);

                        return {
                            'end': function(message) {
                                expect(message).to.equal(errorMsg);
                                done();
                            }
                        };
                    };

                    deconstructArticleURL(fakeReq, fakeRes, function(err) {
                        throw new Error('This function should not have executed.');
                    });
                });

                it('Ends request with a 404 if CAPI id length < 32 or > 32', function(done) {
                    var errorMsg = '{"message":"Content doesn\'t exist","code":404}',
                        fakeReq = {},
                        fakeRes = fakeReq = { 'locals': {} }; // jshint ignore:line

                    fakeReq.params = [
                        'entertainment/movies/movie-quotes-you-always-get-wrong/' +
                        'news-story/921f2944f4c87ff721d8e8949d'
                    ];

                    fakeRes.status = function(status) {
                        expect(status).to.equal(404);

                        return {
                            'end': function(message) {
                                expect(message).to.equal(errorMsg);
                                done();
                            }
                        };
                    };

                    deconstructArticleURL(fakeReq, fakeRes, function(err) {
                        throw new Error('This function should not have executed.');
                    });
                });
            });
        });
    });
});
