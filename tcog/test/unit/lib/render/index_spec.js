var modulePath = '../../../../lib/render/index_implementation',
    implementation = require(modulePath),
    sinon = require('sinon'),
    expect = require('chai').expect,

    getImplementation = function(dependencies) {
        return implementation(
            dependencies.JSON,
            dependencies.npath,
            dependencies.logger,
            dependencies.loader,
            dependencies.helpers,
            dependencies.responder
        );
    };

describe('Render', function() {
    var req = {
        app: {
            get: function() {}
        }
    };

    describe('#module.exports', function() {
        var stubs = {
                get: sinon.stub(req.app, 'get').returns('/foo/path')
            },
            mocks;

        beforeEach(function() {
            mocks = {
                data: {
                    'foo': 'bar'
                },
                view: 'blah',
                next: function() {},
                res: { locals: {} }
            };
            req.url = null;
        });

        describe('format', function() {
            describe('JSON', function() {
                it('calls JSON.stringify with correct arguments', function() {
                    var called = false,
                        render = getImplementation({
                            JSON: {
                                stringify: function(data) {
                                    called = true;
                                    expect(data).to.eql(mocks.data);
                                }
                            }
                        });

                    render.sendPayload = function() { return function() {}; };

                    mocks.res.locals.config = { output: 'json' };
                    render(req, mocks.res, mocks.next, mocks.view, mocks.data);
                    expect(called, 'helpers.stringifyJSON called').to.equal(true);
                });

                it('calls self.sendPayload with error if JSON.stringify fails', function() {
                    var called = false,
                        render = getImplementation({
                            JSON: {
                                stringify: function(data) {
                                    throw new Error('Stringify failed');
                                }
                            }
                        });

                    render.sendPayload = function(req, res, next, view) {
                        return function payload(err) {
                            expect(err.message, 'JSON.stringify failed')
                                .to.equal('Stringify failed');
                            called = true;
                        };
                    };

                    mocks.res.locals.config = { output: 'json' };
                    render(req, mocks.res, mocks.next, mocks.view, mocks.data);
                    expect(called, 'payoad called').to.equal(true);
                });

                it('calls self.sendPayload with correct arguments', function() {
                    var called = false,
                        render = getImplementation({
                            JSON: { stringify: function() {} }
                        });

                    render.sendPayload = function(req, res, next, view) {
                        called = true;
                        expect(view, 'view path is correct').to.equal('JSON');
                        return function() {};
                    };

                    mocks.res.locals.config = { output: 'json' };
                    render(req, mocks.res, mocks.next, mocks.view, mocks.data);
                    expect(called, 'self.sendPayload called').to.equal(true);
                });
            });

            describe('HTML', function() {
                it('retrieves default view path', function(done) {
                    var viewPath = '/foo/path/common',
                        dependencies = {
                            npath: {
                                join: function() {
                                    return viewPath;
                                }
                            },
                            loader: function(defaultViewPath) {
                                expect(defaultViewPath).to.equal(viewPath);
                                done();
                            }
                        },
                        render = getImplementation(dependencies);

                    render(req, mocks.res, mocks.next, mocks.view, mocks.data);
                });

                it('calls self.sendPayload with correct arguments', function() {
                    var called = false,
                        dependencies = {
                            npath: {
                                join: function() { return ''; }
                            },
                            loader: function() {}
                        },
                        render = getImplementation(dependencies);

                    render.sendPayload = function(req, res, next, view) {
                        called = true;
                        expect(view, 'view path is correct').to.equal('blah');
                        return function() {};
                    };

                    render(req, mocks.res, mocks.next, mocks.view, mocks.data);
                    expect(called, 'self.sendPayload called').to.equal(true);
                });

                it('calls template loader with correct arguments', function(done) {
                    var viewPath = '/foo/path/common',
                        dependencies = {
                            npath: {
                                join: function() {
                                    return viewPath;
                                }
                            },
                            loader: function(defaultViewPath, view, data, cb) {
                                expect(arguments.length).to.equal(4);
                                expect(view).to.equal(mocks.view);
                                expect(data).to.equal(mocks.data);
                                expect(cb).to.be.a('function');
                                done();
                            }
                        },
                        render = getImplementation(dependencies);

                    render(req, mocks.res, mocks.next, mocks.view, mocks.data);
                });
            });
        });

        describe('sendPayload', function() {
            it('calls next if error returned', function(done) {
                var error = new Error('fail'),
                    called = false,
                    next = function(err) {
                        expect(err.message).to.equal(error.message);
                        expect(called).to.equal(true);
                        done();
                    },
                    dependencies = {
                        'logger': {
                            error: function() {
                                called = true;
                            }
                        }
                    },
                    sendPayload = getImplementation(dependencies).sendPayload;

                sendPayload({}, {}, next, null)(error, null);
            });

            it('calls cacheIfOk & respond if no error', function(done) {
                var rendered = '<p>foo</p>',
                    output = rendered,
                    dependencies = {
                        'helpers': {
                            cacheIfOk: function(url, statusCode, dataToCache) {
                                expect(statusCode).to.equal(mocks.res.statusCode);
                                expect(dataToCache).to.equal(rendered);
                            },
                            'responder': {
                                'respond': function(req, res, document, statusCode) {
                                    expect(document).to.equal(rendered);
                                    expect(statusCode).to.equal(mocks.res.statusCode);
                                    done();
                                }
                            }
                        }
                    },
                    sendPayload = getImplementation(dependencies).sendPayload;

                mocks.res.statusCode = 200;
                mocks.res.locals.config = { output: 'html' };

                sendPayload(req, mocks.res, null, null)(null, output);
            });
        });
    });
});
