'use strict';

let basePath = '../../../../../../../transformers/1.0/components/article',
    implementation = require(basePath + '/middleware/route-enforcer_implementation'),
    expect = require('chai').expect,
    async = require('async');

describe('route enforcer middleware', function() {
    describe('context', function() {
        const tests = {
            'res.locals.config.articleId': {
                locals: { config: {}, data: {} }
            },
            'res.locals.data': {
                locals: { config: { articleURL: {} } }
            },
            'res.locals.data.dynamicMetadata': {
                locals: {
                    config: { articleURL: {} },
                    data: {}
                }
            },
            'res.locals( data || config.articleId )': {
                locals: { config: {} }
            }
        };

        const keys = Object.keys(tests);

        async.each(keys, function(test, cb) {
            it('calls next if cannot obtain ' + test, function() {
                let fixture = tests[test],
                    enforcer = implementation();

                enforcer({ headers: {} }, fixture, cb);
            });
        });

        it('calls next if context is not akamai', function(done) {
            const enforcer = implementation();
            enforcer.rules = [function() {
                throw new Error('This function should not have executed.');
            }];

            enforcer({ headers: {} }, {
                locals: { config: { articleURL: {} }, data: {} }
            }, function() {
                done();
            });
        });

        it('calls next if context is akamai and x-tcog-product not set', function(done) {
            const enforcer = implementation();
            enforcer.rules = [function() {
                throw new Error('This function should not have executed.');
            }];

            enforcer({ headers: {} }, {
                locals: { config: { articleURL: {} }, data: {} }
            }, function() {
                done();
            });
        });
    });

    describe('rules', function() {
        it('does not redirect if no rules specified', function(done) {
            const enforcer = implementation();

            enforcer.rules = [];

            enforcer({ headers: {} }, {
                redirect: function() {
                    throw new Error('This function should not have executed.');
                },
                locals: { data: {}, config: { articleURL: {} } }
            }, done);
        });

        it('evaluates rules if present', function(done) {
            let called = false,
                enforcer = implementation();

            enforcer.rule.somerule = function(context) {
                called = true;
                expect(context).to.be.an('object');
                expect(Object.keys(context).sort())
                    .to.eql(['data', 'domain', 'media']);
            };

            enforcer.rules = ['somerule'];

            enforcer({ headers: { 'x-tcog-product': 'tcog' } }, {
                redirect: function() {
                    throw new Error('This function should not have executed.');
                },
                locals: {
                    data: { dynamicMetadata: {} },
                    config: {
                        articleURL: {},
                        trouter: true
                    }
                }
            }, function() {
                expect(called).to.equal(true);
                done();
            });
        });

        it('overrides a previous rules value', function(done) {
            let called = false,
                enforcer = implementation({
                    parse: function() { return { query: {} }; },
                    format: function() { return 'bar'; }
                });

            enforcer.rule.a = function(context) { return 'foo'; };
            enforcer.rule.b = function(context) { return false; };
            enforcer.rule.c = function(context) { return 'bar'; };

            enforcer.rules = ['a', 'b', 'c'];

            enforcer({}, {
                redirect: function(status, uri) {
                    expect(uri).to.equal('bar');
                    done();
                },
                locals: {
                    data: { dynamicMetadata: {} },
                    config: {
                        articleURL: {},
                        trouter: true
                    }
                }
            }, function() {
                throw new Error('This function should not have executed.');
            });
        });

        it('executes rules in the correct order', function() {
            let enforcer = implementation(),
                rules = ['legacy', 'route', 'syndicated'],
                called = [];

            rules.forEach(function(rule) {
                enforcer.rule[rule] = function() {
                    called.push(rule);
                    return false;
                };
            });

            enforcer({}, {
                locals: {
                    data: { dynamicMetadata: {} },
                    config: {
                        articleURL: {},
                        trouter: true
                    }
                }
            }, function() {
                expect(called.length).to.equal(enforcer.rules.length);
                expect(called).to.eql(enforcer.rules);
            });
        });

        it('calls self.normalize if rule returns a url', function(done) {
            let called = false,
                redirectUrl = 'http://www.masthead.com.au/foo/bar/123456',
                enforcer = implementation({
                    parse: function() { return { query: {} }; },
                    format: function() { return redirectUrl; }
                });

            enforcer.rule.somerule = function(context) { return redirectUrl; };
            enforcer.rules = ['somerule'];

            enforcer.normalize = function(url) {
                called = true;
                expect(url).to.equal(redirectUrl);
                return redirectUrl;
            };

            enforcer({}, {
                redirect: function(status, link) {
                    expect(called).to.be.ok;
                    expect(status).to.equal(301);
                    expect(link).to.equal(redirectUrl);
                    done();
                },
                locals: {
                    data: { dynamicMetadata: {} },
                    config: {
                        articleURL: {},
                        trouter: true
                    }
                }
            }, function() {
                throw new Error('This function should not have executed.');
            });
        });

        it('calls res.redirect if rule returns a url', function(done) {
            let redirectUrl = 'http://www.masthead.com.au/foo/bar/123456',
                enforcer = implementation({
                    parse: function() { return { query: {} }; },
                    format: function() { return redirectUrl; }
                });

            enforcer.rule.somerule = function(context) { return redirectUrl; };
            enforcer.rules = ['somerule'];

            enforcer({}, {
                redirect: function(status, link) {
                    expect(status).to.equal(301);
                    expect(link).to.equal(redirectUrl);
                    done();
                },
                locals: {
                    data: { dynamicMetadata: {} },
                    config: {
                        articleURL: {},
                        trouter: true
                    }
                }
            }, function() {
                throw new Error('This function should not have executed.');
            });
        });

        it('calls res.redirect with query string parameters if supplied( no ? )', function(done) {
            let called = false,
                redirectUrl =
                    'http://www.masthead.com.au/foo/bar/123456',
                enforcer = implementation({
                    parse: function() { return { query: {} }; },
                    format: function() {
                        const result = !called ? '?foo=bar&fizz=buzz' : redirectUrl;
                        called = true;
                        return result;
                    }
                });

            enforcer.rule.somerule = function(context) { return redirectUrl; };
            enforcer.rules = ['somerule'];

            enforcer({ headers: { 'x-tcog-product': 'tcog' } }, {
                redirect: function(status, link) {
                    expect(status).to.equal(301);
                    expect(link).to.equal(redirectUrl + '?foo=bar&fizz=buzz');
                    done();
                },
                locals: {
                    data: { dynamicMetadata: {} },
                    config: {
                        articleURL: {},
                        trouter: true
                    },
                    query: {
                        foo: 'bar',
                        fizz: 'buzz'
                    }
                }
            }, function() {
                throw new Error('This function should not have executed.');
            });
        });

        it('calls res.redirect with query string parameters if supplied( with ? )', function(done) {
            let called = false,
                redirectUrl =
                    'http://www.masthead.com.au/foo/bar/123456?param=123456',
                enforcer = implementation({
                    parse: function() { return { query: {} }; },
                    format: function() {
                        const result = !called ? '?foo=bar&fizz=buzz' : redirectUrl;
                        called = true;
                        return result;
                    }
                });

            enforcer.rule.somerule = function(context) { return redirectUrl; };
            enforcer.rules = ['somerule'];

            enforcer({ headers: { 'x-tcog-product': 'tcog' } }, {
                redirect: function(status, link) {
                    expect(status).to.equal(301);
                    expect(link).to.equal(redirectUrl + '&foo=bar&fizz=buzz');
                    done();
                },
                locals: {
                    data: { dynamicMetadata: {} },
                    config: {
                        articleURL: {},
                        trouter: true
                    },
                    query: {
                        foo: 'bar',
                        fizz: 'buzz'
                    }
                }
            }, function() {
                throw new Error('This function should not have executed.');
            });
        });

        describe('normalize', function() {
            it('is a function', function() {
                const normalize = implementation().normalize;
                expect(normalize).to.be.a('function');
                expect(normalize.length).to.equal(1);
            });

            it('calls url.parse with the correct arguments', function() {
                let testUrl = 'http://url',
                    normalize = implementation({
                        parse: function(url, expandQuery) {
                            expect(url).to.equal(testUrl);
                            expect(expandQuery).to.be.ok;
                            return { query: {} };
                        },
                        format: function() { return testUrl; }
                    }).normalize,

                    result = normalize(testUrl);

                expect(result).to.equal(testUrl);
            });

            it('calls url.format with the correct arguments', function() {
                let parsed = { query: {} },
                    testUrl = 'http://url',
                    normalize = implementation({
                        parse: function(url, expandQuery) {
                            return parsed;
                        },
                        format: function(url) {
                            expect(url).to.eql(parsed);
                            return testUrl;
                        }
                    }).normalize,

                    result = normalize(testUrl);

                expect(result).to.equal(testUrl);
            });

            it('returns a url with sv parameter removed if found', function() {
                let testUrl = 'http://url/?sv=123456&foo=bar',
                    parsed = {
                        query: {
                            sv: '123456',
                            foo: 'bar'
                        }
                    },
                    normalize = implementation({
                        parse: function(url, expandQuery) {
                            return parsed;
                        },
                        format: function(url) {
                            expect(url).to.eql(parsed);
                            return 'http://url/?foo=bar';
                        }
                    }).normalize,

                    result = normalize(testUrl);

                expect(result).to.equal('http://url/?foo=bar');
            });
        });

        describe('rule', function() {
            describe('legacy', function() {
                let fixtures;

                beforeEach(function() {
                    fixtures = {

                        // a correctly formatted request with
                        // a valid route
                        //
                        // eg: foo/bar/this-is-a-test

                        correct: {
                            data: {
                                dynamicMetadata: {
                                    link: 'http://foo.bar',
                                    linkOrigin: 'fatwire'
                                }
                            },
                            media: {
                                uri: '/foo/bar/this-is-a-test',
                                origin: 'fatwire'
                            }
                        },

                        // an incorrectly formatted request with
                        // an invalid route
                        //
                        // eg: foo/bar/this-is-a-test =>  foo/bizz/this-is-a-test

                        incorrect: {
                            data: {
                                dynamicMetadata: {
                                    link: 'http://foo.bar/buzz/bizz/this-is-a-test',
                                    linkOrigin: 'spp'
                                }
                            },
                            media: {
                                uri: '/foo/bar/this-is-a-test',
                                origin: 'fatwire'
                            }
                        }

                    };
                });

                const legacy = implementation().rule.legacy;

                it('is a function', function() {
                    expect(legacy).to.be.a('function');
                    expect(legacy.length).to.equal(1);
                });

                it('return a uri if route incorrect', function() {
                    const result = legacy(fixtures.incorrect);
                    expect(result)
                        .to.equal('http://foo.bar/buzz/bizz/this-is-a-test');
                });

                it('return false if route is correct', function() {
                    const result = legacy(fixtures.correct);
                    expect(result).to.equal(false);
                });

                it('return false if request link origin unknown', function() {
                    delete fixtures.correct.media.origin;

                    const result = legacy(fixtures.correct);
                    expect(result).to.equal(false);
                });

                it('return false if metadata link origin unknown', function() {
                    delete fixtures.correct.data.dynamicMetadata.linkOrigin;

                    const result = legacy(fixtures.correct);
                    expect(result).to.equal(false);
                });

                it('return false if request & metadata link origin unknown', function() {
                    delete fixtures.correct.data.dynamicMetadata.linkOrigin;
                    delete fixtures.correct.media.origin;

                    const result = legacy(fixtures.correct);
                    expect(result).to.equal(false);
                });
            });

            describe('route', function() {
                let fixtures;

                beforeEach(function() {
                    fixtures = {

                        // a correctly formatted request with
                        // a valid route
                        //
                        // eg: foo/bar/this-is-a-test

                        correct: {
                            data: {
                                dynamicMetadata: {
                                    link: 'http://foo.bar/foo/bar/this-is-a-test'
                                }
                            },
                            media: {
                                uri: '/foo/bar/this-is-a-test'
                            }
                        },

                        // an incorrectly formatted request with
                        // an invalid route
                        //
                        // eg: foo/bar/this-is-a-test =>  foo/bizz/this-is-a-test

                        incorrect: {
                            data: {
                                dynamicMetadata: {
                                    link: 'http://foo.bar/buzz/bizz/this-is-a-test'
                                }
                            },
                            media: {
                                uri: '/foo/bar/this-is-a-test'
                            }
                        }

                    };
                });

                it('is a function', function() {
                    const route = implementation(function() {}).rule.route;
                    expect(route).to.be.a('function');
                    expect(route.length).to.equal(1);
                });

                it('calls url.parse method with correct arguments', function() {
                    const route = implementation({
                        parse: function(url) {
                            expect(url).to.equal('http://foo.bar/foo/bar/this-is-a-test');
                            return {
                                pathname: '/foo/bar/this-is-a-test'
                            };
                        }
                    }).rule.route;
                    route(fixtures.correct);
                });

                it('return a uri if route incorrect', function() {
                    let route = implementation({
                            parse: function() {
                                return {
                                    pathname: ''
                                };
                            }
                        }).rule.route,
                        result = route(fixtures.incorrect);
                    expect(result).to.equal('http://foo.bar/buzz/bizz/this-is-a-test');
                });

                it('return false if route is correct', function() {
                    let route = implementation({
                            parse: function() {
                                return {
                                    pathname: '/foo/bar/this-is-a-test'
                                };
                            }
                        }).rule.route,
                        result = route(fixtures.correct);
                    expect(result).to.equal(false);
                });

                it('returns canonical if metadata.link not valid', function() {
                    let fixture = {
                            data: {
                                dynamicMetadata: {
                                    canonical: 'canonical'
                                }
                            }
                        },
                        route = implementation().rule.route;

                    ['', undefined, null].forEach(function(value) {
                        fixture.data.dynamicMetadata.link = value;
                        expect(route(fixture)).to.equal('canonical');
                    });
                });

                describe('paths with cache route values', function() {
                    const fixture = {
                        data: {
                            dynamicMetadata: {
                                link: 'http://foo.bar/foo/bar/this-is-a-test'
                            }
                        },
                        media: {}
                    };

                    it('return false if route is correct up to 2 levels', function() {
                        [
                            '/foo/bar',
                            '/one/foo/bar',
                            '/one/two/foo/bar'
                        ].forEach(function(sections) {
                            fixture.media.uri = sections + '/this-is-a-test';

                            let route = implementation({
                                    parse: function() {
                                        return {
                                            pathname: '/foo/bar/this-is-a-test'
                                        };
                                    }
                                }).rule.route,
                                result = route(fixture);

                            expect(result).to.equal(false);
                        });
                    });

                    it('return url if route exceeds 2 cache levels', function() {
                        fixture.media.uri =
                            'one/two/three/foo/bar/this-is-a-test';

                        let route = implementation({
                                parse: function() {
                                    return {
                                        pathname: '/foo/bar/this-is-a-test'
                                    };
                                }
                            }).rule.route,
                            result = route(fixture);
                        expect(result)
                            .to.equal('http://foo.bar/foo/bar/this-is-a-test');
                    });
                });
            });

            describe('syndicated', function() {
                let tests = {
                        'returns false if domain is syndicated': {
                            fixture: {
                                data: {
                                    dynamicMetadata: {
                                        syndicated: true
                                    }
                                }
                            },
                            result: false
                        },
                        'returns false if domain not syndicated & no link or canonical': {
                            fixture: {
                                data: {
                                    dynamicMetadata: {
                                        syndicated: false
                                    }
                                }
                            },
                            result: false
                        },
                        'returns false if link & canonical are the same and domain correct': {
                            fixture: {
                                data: {
                                    dynamicMetadata: {
                                        syndicated: false,
                                        link: 'http://www.foo.bar',
                                        canonical: 'http://www.foo.bar'
                                    }
                                },
                                domain: 'foo.bar'
                            },
                            result: false
                        },
                        'returns false if no request domain set': {
                            fixture: {
                                data: {
                                    dynamicMetadata: {
                                        syndicated: false,
                                        link: 'http://www.foo.bar',
                                        canonical: 'http://www.foo.bar'
                                    }
                                }
                            },
                            result: false
                        },
                        'ignores environment specific canonicals & returns false if domain correct': {
                            fixture: [
                                // vanilla
                                {
                                    data: {
                                        dynamicMetadata: {
                                            syndicated: false,
                                            link: 'http://www.foo.bar',
                                            canonical: 'http://www.foo.bar'
                                        }
                                    },
                                    domain: 'www.foo.bar'
                                },

                                // dev

                                {
                                    data: {
                                        dynamicMetadata: {
                                            syndicated: false,
                                            link: 'http://www.foo.bar',
                                            canonical: 'http://www.foodev.bar'
                                        }
                                    },
                                    domain: 'www.foo.bar'
                                },

                                // uat

                                {
                                    data: {
                                        dynamicMetadata: {
                                            syndicated: false,
                                            link: 'http://www.foo.bar',
                                            canonical: 'http://www.foouat.bar'
                                        }
                                    },
                                    domain: 'www.foo.bar'
                                },

                                // sit

                                {
                                    data: {
                                        dynamicMetadata: {
                                            syndicated: false,
                                            link: 'http://www.foo.bar',
                                            canonical: 'http://www.foosit.bar'
                                        }
                                    },
                                    domain: 'www.foo.bar'
                                },

                                // sit2

                                {
                                    data: {
                                        dynamicMetadata: {
                                            syndicated: false,
                                            link: 'http://www.foo.bar',
                                            canonical: 'http://www.foosit2.bar'
                                        }
                                    },
                                    domain: 'www.foo.bar'
                                },

                                {
                                    data: {
                                        dynamicMetadata: {
                                            syndicated: false,
                                            link: 'http://sit2.foo.bar',
                                            canonical: 'http://sit2.foo.bar'
                                        }
                                    },
                                    domain: 'www.foo.bar'
                                },

                                // amp

                                {
                                    data: {
                                        dynamicMetadata: {
                                            syndicated: false,
                                            link: 'http://sit2.foo.bar',
                                            canonical: 'http://sit2.foo.bar'
                                        }
                                    },
                                    domain: 'amp.foo.bar'
                                },

                                {
                                    data: {
                                        dynamicMetadata: {
                                            syndicated: false,
                                            link: 'http://sit2.foo.bar',
                                            canonical: 'http://sit2.foo.bar'
                                        }
                                    },
                                    domain: 'amp.uat.foo.bar'
                                }
                            ],
                            result: false
                        },
                        'returns canonical uri if link & canonical are the same but req domain not correct': {
                            fixture: {
                                data: {
                                    dynamicMetadata: {
                                        syndicated: false,
                                        link: 'http://foo.bar',
                                        canonical: 'http://foo.bar'
                                    }
                                },
                                domain: 'incorrect.bar'
                            },
                            result: 'http://foo.bar'
                        },
                        'returns canonical uri if link & canonical are the same but req domain not correct but syndicated=true': {
                            fixture: {
                                data: {
                                    dynamicMetadata: {
                                        syndicated: true,
                                        link: 'http://foo.bar',
                                        canonical: 'http://foo.bar'
                                    }
                                },
                                domain: 'incorrect.bar'
                            },
                            result: 'http://foo.bar'
                        },
                        'returns false if content available and link and canonical do not match available': {
                            fixture: {
                                data: {
                                    dynamicMetadata: {
                                        available: true,
                                        link: 'http://buzz.bar',
                                        canonical: 'http://bizz.bar'
                                    }
                                },
                                domain: 'http://buzz.bar'
                            },
                            result: false
                        },
                        'returns canonical if escape content attempted to be accessed via a metro': {
                            fixture: {
                                data: {
                                    dynamicMetadata: {
                                        available: true,
                                        link: 'http://www.dailytelegraph.com.au',
                                        canonical: 'http://www.escape.com.au'
                                    }
                                },
                                domain: 'http://www.dailytelegraph.com.au'
                            },
                            result: 'http://www.escape.com.au'
                        }
                    },

                    syndicated = implementation().rule.syndicated;

                it('is a function', function() {
                    expect(syndicated).to.be.a('function');
                    expect(syndicated.length).to.equal(1);
                });

                Object.keys(tests).forEach(function(name) {
                    const test = tests[name];
                    it(name, function() {
                        const fixture = Array.isArray(test.fixture)
                            ? test.fixture : [test.fixture];

                        fixture.forEach(function(fix) {
                            const result = syndicated(fix);
                            expect(result).to.equal(test.result);
                        });
                    });
                });
            });
        });
    });
});
