var implementation = require('../../../../../transformers/popular/normalisers/legacy-normalise_implementation'),
    expect = require('chai').expect,
    noop = function() {};

describe('normalisers/legacyNormalise', function() {
    it('returns early if no locals.legacy', function(done) {
        var legacyNormalise = implementation(),
            mock = {
                req: {},
                res: { locals: { config: {} } }
            };

        legacyNormalise(mock.req, mock.res, function() {
            expect(
                mock.res.locals.config.isLegacy,
                'res.locals.config.isLegacy should not be defined'
            ).to.be.an('undefined');
            done();
        });
    });

    it('flatten collection called with correct arguments', function(done) {
        var legacyNormalise = implementation(

                function flattenCollection(locals) {
                    expect(
                        locals.data,
                        'correctly passed locals'
                    ).to.eql({
                        results: [
                            { contentType: 'COLLECTION' },
                            { contentType: 'COLLECTION' }
                        ]
                    });
                    return locals;
                }
            ),

            mock = {
                res: {
                    locals: {
                        config: {},
                        data: {
                            results: [
                                { contentType: 'COLLECTION' },
                                { contentType: 'COLLECTION' }
                            ]
                        }
                    }
                },
                req: {
                    locals: {},
                    query: {
                        origin: 'omniture',
                        domain: 'foo.com',
                        category: 'foo/bar'
                    }
                }
            };

        legacyNormalise(mock.req, mock.res, done);
    });

    describe('locals.config', function() {
        it('restored if legacy.config defined', function() {
            var legacyNormalise = implementation(
                    function flattenCollection(locals) { return locals; }
                ),

                mock = {
                    res: {
                        locals: {
                            config: {
                                foo: 'override'
                            },
                            data: { results: [] },
                            legacy: {
                                config: {
                                    foo: 'bar'
                                }
                            }
                        }
                    },
                    req: { }
                };

            legacyNormalise(mock.req, mock.res, function() {
                var locals = mock.res.locals;
                expect(
                    locals.config,
                    'restores config object'
                ).to.eql({
                    foo: 'bar'
                });
            });
        });

        it('remains the same if legacy.config not defined', function() {
            var legacyNormalise = implementation(
                    function flattenCollection(locals) { return locals; }
                ),

                mock = {
                    res: {
                        locals: {
                            config: {
                                foo: 'override'
                            },
                            data: { results: [] },
                            legacy: { }
                        }
                    },
                    req: { }
                };

            legacyNormalise(mock.req, mock.res, function() {
                var locals = mock.res.locals;
                expect(
                    locals.config,
                    'does not restore config object'
                ).to.eql({
                    foo: 'override'
                });
            });
        });
    });

    describe('locals.query', function() {
        it('restored if legacy.query defined', function() {
            var legacyNormalise = implementation(
                    function flattenCollection(locals) { return locals; }
                ),

                mock = {
                    res: {
                        locals: {
                            config: {},
                            query: {
                                foo: 'override'
                            },
                            data: { results: [] },
                            legacy: {
                                query: {
                                    foo: 'bar'
                                }
                            }
                        }
                    },
                    req: { }
                };

            legacyNormalise(mock.req, mock.res, function() {
                var locals = mock.res.locals;
                expect(
                    locals.query,
                    'restores query object'
                ).to.eql({
                    foo: 'bar'
                });
            });
        });

        it('remains the same if legacy.query not defined', function() {
            var legacyNormalise = implementation(
                    function flattenCollection(locals) { return locals; }
                ),

                mock = {
                    res: {
                        locals: {
                            config: {},
                            query: {
                                foo: 'override'
                            },
                            data: { results: [] },
                            legacy: { }
                        }
                    },
                    req: { }
                };

            legacyNormalise(mock.req, mock.res, function() {
                var locals = mock.res.locals;
                expect(
                    locals.query,
                    'does not restore query object'
                ).to.eql({
                    foo: 'override'
                });
            });
        });
    });

    describe('req.url', function() {
        it('restored if legacy.url defined', function() {
            var legacyNormalise = implementation(
                    function flattenCollection(locals) { return locals; }
                ),

                mock = {
                    res: {
                        locals: {
                            config: {},
                            query: {},
                            data: { results: [] },
                            legacy: { url: '/my/path' }
                        }
                    },
                    req: { }
                };

            legacyNormalise(mock.req, mock.res, function() {
                expect(
                    mock.req.url,
                    'restores req.url'
                ).to.equal('/my/path');
            });
        });

        it('remains the same if legacy.url not defined', function() {
            var legacyNormalise = implementation(
                    function flattenCollection(locals) { return locals; }
                ),

                mock = {
                    res: {
                        locals: {
                            config: {},
                            query: {},
                            data: { results: [] },
                            legacy: { }
                        }
                    },
                    req: { url: '/existing/path/' }
                };

            legacyNormalise(mock.req, mock.res, function() {
                expect(
                    mock.req.url,
                    'does not restore req.url'
                ).to.equal('/existing/path/');
            });
        });
    });
});
