var _ = require('lodash'),
    modulePath = '../../../../lib/template-loader/index_implementation',
    implementation = require(modulePath),
    expect = require('chai').expect,
    leche = require('leche'),
    sinon = require('sinon'),
    adapters = ['core', 's3'],

    getImplementation = function(depsIn) {
        depsIn = depsIn || {};

        var dependencies = _.extend({
                adapters: leche.fake(leche.create(adapters))
            }, depsIn),

            moduleToTest = implementation(
                dependencies.npath,
                dependencies.logger,
                dependencies.sandbox,
                dependencies.validateView,
                dependencies.adapters,
                dependencies.now
            );

        return moduleToTest;
    },

    npath = require('path'),
    tpl = require('util').format,
    jade = require('jade');

describe('Template Loader', function() {
    var defaultViewPath = '/some/path/common/';

    describe('loadTemplate ( public )', function() {
        it('"idonotexist/some/path" should select adapter "core"', function(done) {
            var loadAdapter = 'idonotexist',
                loadView = 'x',
                inView = npath.join(loadAdapter, loadView),
                loadData = {},
                called = false,

                loader = getImplementation({
                    npath: {
                        join: function() {
                            return '/some/path/common/idonotexist/x';
                        }
                    },
                    logger: leche.create(['debug']),
                    adapters: leche.create(['core']),
                    validateView: function(view, adapters, callback) {
                        callback(null, 'core', '/some/path/common/idonotexist/x');
                    }
                });

            sinon.stub(loader, '_load', function(adapter, view, data) {
                expect(adapter).to.equal('core');
                expect(view).to.equal(npath.join(defaultViewPath, inView));
                expect(data).to.equal(loadData);
                done();
            });

            loader(defaultViewPath, inView, loadData, function() {
                throw new Error('This should never be executed.');
            });
        });

        adapters.forEach(function(loadAdapter) {
            var label = '"%s/some/path" should select adapter "%s"';

            it(tpl(label, loadAdapter, loadAdapter), function(done) {
                var loadView = 'x',
                    inView = npath.join(loadAdapter, loadView),
                    called = false,
                    loadData = {},

                    loader = getImplementation({
                        npath: {
                            join: function() {
                                return '/some/path/common/x';
                            }
                        },
                        validateView: function(view, adapters, callback) {
                            callback(null, loadAdapter, loadView);
                        }
                    });

                sinon.stub(loader, '_load', function(adapter, view, data) {
                    expect(adapter).to.equal(loadAdapter);
                    expect(view).to.equal(~view.indexOf(defaultViewPath)
                        ? defaultViewPath + loadView : loadView);
                    expect(data).to.equal(loadData);

                    done();
                });

                loader(defaultViewPath, inView, loadData, function() {
                    throw new Error('This should never be executed.');
                });
            });
        });
    });

    describe('#load (private)', function() {
        var fiveMinutes = 3e5,
            nineMinutes = 54e4,
            tenMinutes = 6e5;

        describe('executes a compiled adapter template', function() {
            describe('from cache', function() {
                it('where the compiled template is from an adapter which cannot expire', function() {
                    var data = {
                            foo: 'bar'
                        },
                        loader = getImplementation({
                            logger: leche.create(['debug'])
                        }),
                        cachedTemplate = function(context) {
                            expect(context).to.eql(data);
                            return 'testing testing 123';
                        };

                    loader.templates = {
                        'external/foo/bar': cachedTemplate
                    };

                    loader._load('external', 'foo/bar', data, function(err, data) {
                        expect(err).to.not.be.ok;
                        expect(data).to.equal('testing testing 123');
                    });
                });

                it('where the compiled template is still fresh', function() {
                    var data = {
                            foo: 'bar'
                        },
                        loader = getImplementation({
                            logger: leche.create(['debug']),
                            now: function() {
                                return 0;
                            }
                        }),
                        cachedTemplate = function(context) {
                            expect(context).to.eql(data);
                            return 'testing testing 123';
                        };

                    cachedTemplate.timestamp = tenMinutes;

                    loader.templates = {
                        'fresh/foo/bar': cachedTemplate
                    };

                    loader._load('fresh', 'foo/bar', data, function(err, data) {
                        expect(err).to.not.be.ok;
                        expect(data).to.equal('testing testing 123');
                    });
                });
            });

            describe('directly from the adapter', function() {
                it('where the cached template has expired & can expire', function(done) {
                    var compiledTemplate = sinon.stub(),
                        data = {
                            foo: 'bar'
                        },
                        loader = getImplementation({
                            logger: leche.create(['debug']),
                            now: function() {
                                return 1234;
                            },
                            adapters: {
                                fresh: function(path, callback) {
                                    expect(path).to.equal('foo/bar');
                                    var code = 'output = "foo";';
                                    callback(null, code);
                                }
                            },
                            sandbox: function() {
                                return compiledTemplate;
                            }
                        }),
                        cachedTemplate = function(context) {
                            expect(context).to.eql(data);
                            return 'testing testing 123';
                        };

                    cachedTemplate.timestamp = -Infinity;

                    loader.templates = {
                        'fresh/foo/bar': cachedTemplate
                    };

                    sinon.stub(loader, 'processTemplate', function(template, data,
                        callback) {
                        expect(template).to.equal(compiledTemplate);
                        expect(template.timestamp).to.equal(1234);
                        callback(null, 'testing testing 123');
                    });

                    loader._load('fresh', 'foo/bar', data, function(err, templateOuput) {
                        expect(err).to.not.be.ok;
                        expect(templateOuput).to.equal('testing testing 123');
                        done();
                    });
                });

                it('where there is no available cached compiled template', function(done) {
                    var calledCount = 0,
                        compiledTemplate = sinon.stub(),
                        data = {
                            foo: 'bar'
                        },
                        loader = getImplementation({
                            logger: leche.create(['debug']),
                            now: function() {
                                calledCount++;
                                return 1234;
                            },
                            adapters: {
                                fresh: function(path, callback) {
                                    expect(path).to.equal('foo/bar');
                                    var code = 'output = "foo";';
                                    callback(null, code);
                                }
                            },
                            sandbox: function() {
                                return compiledTemplate;
                            }
                        });

                    sinon.stub(loader, 'processTemplate', function(template, data,
                        callback) {
                        expect(template).to.equal(compiledTemplate);
                        expect(template.timestamp).to.equal(1234);
                        callback(null, 'testing testing 123');
                    });

                    loader._load('fresh', 'foo/bar', data, function(err, templateOuput) {
                        expect(err).to.not.be.ok;
                        expect(calledCount).to.equal(1);
                        expect(templateOuput).to.equal('testing testing 123');
                        done();
                    });
                });
            });
        });

        describe('calls back with error', function() {
            it('when a template adapter returns an error', function(done) {
                var loader = getImplementation({
                    logger: leche.create(['debug']),
                    adapters: {
                        test: function(path, callback) {
                            expect(path).to.be.a('string');
                            expect(callback).to.be.a('function');
                            callback(new Error('foo'));
                        }
                    }
                });

                loader.templates = {};

                loader._load('test', 'foo', {}, function(err, result) {
                    expect(err).to.be.ok;
                    expect(err).to.be.an.instanceOf(Error);
                    expect(err.message).to.equal('foo');
                    expect(result).to.not.be.ok;
                    expect(loader.templates['test/foo/bar']).to.not.be.ok;
                    done();
                });
            });

            it('when a compiled template returns an error', function(done) {
                var loader = getImplementation({
                    logger: leche.create(['debug']),
                    adapters: {
                        test: function(path, callback) {
                            var code = 'output = "foo";';
                            callback(null, code);
                        }
                    },
                    sandbox: function() {
                        return function() {};
                    },
                    now: function() {
                        return 0;
                    }
                });

                loader.processTemplate = function(template, data, callback) {
                    callback(new Error('foo'));
                };

                loader._load('test', 'foo/bar', {}, function(err, data) {
                    // template was compiled and cached successfully

                    expect(loader.templates['test/foo/bar']).to.be.ok;

                    // however the compiled templates threw an error

                    expect(err).to.be.ok;
                    expect(err.message).to.equal('foo');
                    expect(data).to.not.be.ok;
                    done();
                });
            });
        });
    });
});
