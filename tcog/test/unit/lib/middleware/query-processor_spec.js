var queryProcessor = require('../../../../lib/middleware/query-processor'),
    responseLocals = require('../../../../lib/middleware/response-locals'),
    expect = require('chai').expect;

describe('Query Parser/Processor', function() {
    describe('Key Cameliser', function() {
        it('should convert dashed and underscored keys to camel-case appropriately', function() {
            expect(queryProcessor.camelise('foo-bar-baz')).to.equal('fooBarBaz');
            expect(queryProcessor.camelise('foo_bar_baz')).to.equal('fooBarBaz');
            expect(queryProcessor.camelise('foo-_bar_BAZ')).to.equal('fooBarBAZ');
            expect(queryProcessor.camelise('x-tcog-keyName')).to.equal('xTcogKeyName');
        });
    });

    describe('Query Processor', function() {
        var req, res = {};

        beforeEach(function(done) {
            req = {
                'query': {},
                'headers': {},
                'params': {}
            };

            responseLocals(null, res, done);
        });

        it("should create relevant objects on res.locals where they don't already exist",
            function() {
                var called = false;
                queryProcessor(req, res, function() {
                    expect(res.locals.config).to.be.ok;
                    expect(res.locals.config).to.be.an('object');
                    expect(res.locals.display).to.be.ok;
                    expect(res.locals.display).to.be.an('object');
                    expect(res.locals.query).to.be.ok;
                    expect(res.locals.query).to.be.an('object');
                    expect(res.locals.param).to.be.ok;
                    expect(res.locals.param).to.be.an('object');
                    called = true;
                });
                expect(called).to.be.ok;
            });

        it('should preserve objects on res.locals where they already exist',
            function() {
                var called = false;
                var config = res.locals.config = { 'foobar': 'foobar' },
                    display = res.locals.display = { 'foobar': 'foobar' },
                    query = res.locals.query = { 'foobar': 'foobar' };

                queryProcessor(req, res, function() {
                    expect(res.locals.config).to.be.ok;
                    expect(res.locals.config).to.equal(config);
                    expect(res.locals.display).to.be.ok;
                    expect(res.locals.display).to.equal(display);
                    expect(res.locals.query).to.be.ok;
                    expect(res.locals.query).to.equal(query);
                    called = true;
                });
                expect(called).to.be.ok;
            });

        it('should pluck query key names starting with `t_`, camelise, and put them on res.locals.config',
            function() {
                var called = false;
                req.query = {
                    't_foo': 'bar',
                    't_foo-bar-baz': 'fud',
                    't_display_query_blah': 'test'
                };

                queryProcessor(req, res, function() {
                    expect(res.locals.config.foo).to.equal('bar');
                    expect(res.locals.config.fooBarBaz).to.equal('fud');
                    expect(res.locals.config.displayQueryBlah).to.equal('test');
                    called = true;
                });
                expect(called).to.be.ok;
            });

        it('should pluck query key names starting with `tc_`, camelise, and put them on res.locals.config',
            function() {
                var called = false;
                req.query = {
                    'tc_foo': 'bar',
                    'tc_foo-bar-baz': 'fud',
                    'tc_display_query_blah': 'test'
                };

                queryProcessor(req, res, function() {
                    expect(res.locals.config.foo).to.equal('bar');
                    expect(res.locals.config.fooBarBaz).to.equal('fud');
                    expect(res.locals.config.displayQueryBlah).to.equal('test');
                    called = true;
                });
                expect(called).to.be.ok;
            });

        it('should pluck query key names starting with `td_`, camelise, and put them on res.locals.display',
            function() {
                var called = false;
                req.query = {
                    'td_foo': 'bar',
                    'td_foo-bar-baz': 'fud',
                    'td_display_query_blah': 'test'
                };

                queryProcessor(req, res, function() {
                    expect(res.locals.display.foo).to.equal('bar');
                    expect(res.locals.display.fooBarBaz).to.equal('fud');
                    expect(res.locals.display.displayQueryBlah).to.equal('test');
                    called = true;
                });
                expect(called).to.be.ok;
            });

        it('should pluck legacy query key names starting with `display:`, camelise, and put them on res.locals.display',
            function() {
                var called = false;
                req.query = {
                    'display:foo': 'bar',
                    'display:foo-bar-baz': 'fud',
                    'display:display_query_blah': 'test'
                };

                queryProcessor(req, res, function() {
                    expect(res.locals.display.foo).to.equal('bar');
                    expect(res.locals.display.fooBarBaz).to.equal('fud');
                    expect(res.locals.display.displayQueryBlah).to.equal('test');
                    called = true;
                });
                expect(called).to.be.ok;
            });

        it('should pluck legacy query key names starting with `tcog:`, camelise, and put them on res.locals.config',
            function() {
                var called = false;
                req.query = {
                    'tcog:foo': 'bar',
                    'tcog:foo-bar-baz': 'fud',
                    'tcog:display_query_blah': 'test'
                };

                queryProcessor(req, res, function() {
                    expect(res.locals.config.foo).to.equal('bar');
                    expect(res.locals.config.fooBarBaz).to.equal('fud');
                    expect(res.locals.config.displayQueryBlah).to.equal('test');
                    called = true;
                });
                expect(called).to.be.ok;
            });

        it('should pluck anything not prefaced with tc_, t_, td_, or display: and be place them on res.locals.query',
            function() {
                var called = false;
                req.query = {
                    'foo': 'bar',
                    'foo-bar-baz': 'fud',
                    'display_query_blah': 'test'
                };

                queryProcessor(req, res, function() {
                    expect(res.locals.query['foo']).to.equal('bar');
                    expect(res.locals.query['foo-bar-baz']).to.equal('fud');
                    expect(res.locals.query['display_query_blah']).to.equal('test');
                    called = true;
                });
                expect(called).to.be.ok;
            });

        it('should pluck header values prefaced with x-tcog and place them on res.locals.config',
            function() {
                var called = false;
                req.headers = {
                    'x-tcog-foo': 'bar',
                    'x-tcog-foo-bar-baz': 'fud',
                    'x-tcog-display_query_blah': 'test',
                    'not-included': 'foo'
                };

                queryProcessor(req, res, function() {
                    expect(res.locals.config.foo).to.equal('bar');
                    expect(res.locals.config.fooBarBaz).to.equal('fud');
                    expect(res.locals.config.displayQueryBlah).to.equal('test');
                    // We don't want the non-prefixed item included.
                    expect(Object.keys(res.locals.config).length).to.equal(3);
                    called = true;
                });
                expect(called).to.be.ok;
            });

        it('should rewrite x-tcog-template external/article-couriermail/index',
            function() {
                var called = false;
                req.headers = {
                    'x-tcog-template': 'external/article-couriermail/index'
                };

                queryProcessor(req, res, function() {
                    expect(res.locals.config.template).to.equal('s3/chronicle-questnews/index');
                    expect(Object.keys(res.locals.config).length).to.equal(1);
                    called = true;
                });
                expect(called).to.be.ok;
            });
    });
});
