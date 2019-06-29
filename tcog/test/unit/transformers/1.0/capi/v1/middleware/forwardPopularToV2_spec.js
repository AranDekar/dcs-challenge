var basePath = '../../../../../../../transformers/1.0/capi/v1/middleware/',
    expect = require('chai').expect,
    modulePath = basePath + 'forwardPopularToV2_implementation',

    noop = function() {},
    middleware = require(modulePath),

    middlewareImplementation = middleware(noop);

describe('Forward Popular to V2 Middleware', function() {
    it('is a function', function() {
        expect(typeof middlewareImplementation).to.equal('function');
        expect(middlewareImplementation.length).to.equal(3);
    });

    it(
        'calls next v1 middleware if query parameters do not suggest its a popular-content request',
        function() {
            var next = function(arg) {
                    nextCalledWith = arg;
                },
                mocks = {
                    req: {},
                    locals: [
                        {
                            query: {
                                origin: 'methode',
                                category: 'some/category',
                                domain: 'www.foo.com',
                                foo: 'foo'
                            }
                        },
                        {
                            query: {
                                origin: 'origin',
                                domain: 'www.foo.com',
                                foo: 'foo'
                            }
                        },
                        {
                            query: {
                                origin: 'origin',
                                category: 'www.foo.com',
                                foo: 'foo'
                            }
                        }
                    ]
                },
                nextCalledWith = 'foo';

            mocks.locals.forEach(function(mockRes) {
                middlewareImplementation(mocks.req, {
                    locals: mockRes
                }, next);
                expect(nextCalledWith).to.equal(undefined);
            });
        }
    );

    describe(
        'forwards to /component/popular if query parameters suggest its a popular-content request',
        function() {
            it('sets the url and calls the next route', function() {
                var next = function(arg) {
                        nextCalledWith = arg;
                    },
                    mocks = {
                        res: {
                            locals: {
                                config: {},
                                query: {
                                    origin: 'omniture',
                                    domain: 'foo.com',
                                    category: 'foo/bar'
                                }
                            }
                        },
                        req: {
                        }
                    },
                    nextCalledWith;

                middlewareImplementation(mocks.req, mocks.res, next);

                expect(mocks.req.url).to.equal('/component/popular');
                expect(nextCalledWith).to.equal('route');
            });

            it('removes unsupported query parameters from res.locals.query', function() {
                var pickCalledCount = 0,
                    mocks = {
                        res: {
                            locals: {
                                config: {},
                                query: {
                                    origin: 'omniture',
                                    domain: 'foo.com',
                                    category: 'foo/bar',
                                    maxRelated: '1',
                                    pageSize: '1'
                                }
                            }
                        },
                        req: {

                        }
                    },
                    pickMock = function(obj, whitelist) {
                        var result = pickCalledCount === 0 ? {
                            maxRelated: obj.maxRelated,
                            pageSize: obj.pageSize
                        } : obj;
                        return result;
                    };

                middleware(pickMock)(mocks.req, mocks.res, noop);

                expect(mocks.res.locals.query).to.deep.equal({
                    maxRelated: '1',
                    pageSize: '1'
                });
            });

            it('sets properties on res.locals.config to be used by /coponent/popular', function() {
                var mocks = {
                    res: {
                        locals: {
                            config: {},
                            query: {
                                origin: 'omniture',
                                domain: 'foo.com',
                                category: 'foo/bar'
                            }
                        }
                    },
                    req: {}
                };

                middlewareImplementation(mocks.req, mocks.res, noop);

                expect(mocks.res.locals.config).to.deep.equal({
                    domain: 'foo.com',
                    category: '/foo/bar/'
                });
            });

            it('creates res.locals.legacy containing url, query & config', function() {
                var mocks = {
                    res: {
                        locals: {
                            config: {
                                foo: 'bar'
                            },
                            query: {
                                origin: 'omniture',
                                domain: 'foo.com',
                                category: 'foo/bar'
                            }
                        }
                    },
                    req: {
                        url: '/existing/url',
                        locals: {}
                    }
                };

                middleware(require('lodash/pick'))(mocks.req, mocks.res, noop);

                expect(mocks.res.locals.legacy).to.eql({
                    url: '/existing/url',
                    config: { foo: 'bar' },
                    query: {
                        origin: 'omniture',
                        domain: 'foo.com',
                        category: 'foo/bar'
                    }
                });
            });
        }
    );
});
