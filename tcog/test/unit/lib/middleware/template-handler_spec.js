'use strict';

const _ = require('lodash'),
    modulePath = '../../../../lib/middleware/template-handler_implementation',
    sinon = require('sinon'),
    leche = require('leche'),
    implementation = require(modulePath),
    conf = require('../../../../conf'),
    expect = require('chai').expect,

    getImplementation = function(dependencies) {
        dependencies = dependencies || {};
        dependencies.moment = () => {};
        dependencies = _.merge(dependencies, {
            _: leche.create(['merge']),
            logger: leche.create(['debug']),
            validate: function() { return true; }
        });

        const moduleToTest = implementation(
            dependencies.logger,
            dependencies.render,
            _,
            dependencies.moment,
            dependencies.configs,
            dependencies.tcogHost
        );

        return moduleToTest;
    };

describe('templateHandler', function() {
    describe('templateHandlerMiddleware', function() {
        it('throws an error if validation fails', function() {
            let error = new Error('fail'),
                templateHandler = getImplementation({
                    validate: function() {
                        throw error;
                    }
                }),
                middleware = templateHandler(),
                mocks = { res: { locals: { config: {} } } };

            expect(function() {
                middleware({}, mocks.res);
            }).to.throw();
        });

        describe('getTemplateConfig', function() {
            it('called with the correct arguments', function(done) {
                let templateHandler = getImplementation({
                        render: sinon.stub(),
                        validate: function() { return true; }
                    }),
                    middleware = templateHandler(),
                    mocks = { res: { locals: { config: {} } } };

                mocks.res.locals.config.templateconfig = 'foobar';

                templateHandler.getTemplateConfig = function(configName) {
                    expect(configName).to.equal('foobar');
                    done();
                    return {};
                };

                middleware({}, mocks.res);
            });
        });

        describe('render', function() {
            it('called with the correct arguments', function(done) {
                let mocks = {
                        res: { locals: { config: { foo: 'bar' } } },
                        req: { next: function() {} }
                    },

                    templateHandler = getImplementation({
                        render: function(req, res, next) {
                            expect(req).to.equal(mocks.req);
                            expect(res).to.equal(mocks.res);
                            expect(next).to.equal(mocks.req.next);
                            done();
                        }
                    }),

                    middleware = templateHandler();
                templateHandler.getTemplateConfig = sinon.stub().returns({});
                middleware(mocks.req, mocks.res);
            });

            describe('template parameters', function() {
                it('uses the correct template when tc_templateconfig used', function(done) {
                    let mocks = {
                            res: { locals: { config: { templateconfig: 'breaking' } } },
                            req: { next: function() {} }
                        },

                        templateHandler = getImplementation({
                            configs: {
                                'breaking': {
                                    config: { style: 'compact' }
                                }
                            },
                            render: function(req, res, next, template) {
                                expect(template).to.equal('compact');
                                done();
                            }
                        }),

                        middleware = templateHandler();

                    middleware(mocks.req, mocks.res);
                });

                it('uses the correct template when t_template used', function(done) {
                    let mocks = {
                            res: { locals: { config: { template: 'override-it' } } },
                            req: { next: function() {} }
                        },

                        templateHandler = getImplementation({
                            render: function(req, res, next, template) {
                                expect(template).to.equal('override-it');
                                done();
                            }
                        }),

                        middleware = templateHandler();

                    middleware(mocks.req, mocks.res);
                });

                it('lets t_template takes priority over tc_templateconfig', function(done) {
                    let mocks = {
                            res: {
                                locals: {
                                    config: {
                                        template: 'template',
                                        templateconfig: 'templateconfig'
                                    }
                                }
                            },
                            req: { next: function() {} }
                        },

                        templateHandler = getImplementation({
                            configs: {
                                'templateconfig': {
                                    config: { style: 'compact' }
                                }
                            },
                            render: function(req, res, next, template) {
                                expect(template).to.equal('template');
                                done();
                            }
                        }),

                        middleware = templateHandler();

                    middleware(mocks.req, mocks.res);
                });

                it('otherwise uses the default template', function(done) {
                    let templateName = 'defaultTemplate',
                        mocks = {
                            res: {
                                locals: {
                                    config: {
                                        templateconfig: null
                                    }
                                }
                            },
                            req: { next: function() {} }
                        },

                        templateHandler = getImplementation({
                            render: function(req, res, next, template) {
                                expect(template).to.equal(templateName);
                                done();
                            }
                        }),

                        middleware = templateHandler(templateName);

                    middleware(mocks.req, mocks.res);
                });
            });
        });

        describe('mandatory viewCtx properties', () => {
            it('are passed through into the template', function(done) {
                let templateName = 'defaultTemplate',
                    mocks = {
                        res: {
                            locals: {
                                config: {
                                    templateconfig: null
                                },
                                display: {
                                    foo: 1
                                },
                                query: {
                                    foo: 1
                                },
                                product: {
                                    name: 'test'
                                },
                                url: '/news/v3/article/334sage3'

                            }
                        },
                        req: { next: function() {} }
                    },

                    templateHandler = getImplementation({
                        render: function(req, res, next, template, viewCtx) {
                            expect(viewCtx).to.be.ok;
                            expect(viewCtx.host).to.equal('a.tcog.news.com.au');
                            expect(viewCtx.display.foo).to.equal(1);
                            expect(viewCtx.query.foo).to.equal(1);
                            expect(viewCtx.product.name).to.equal('test');
                            expect(typeof viewCtx.moment).to.equal('function');
                            return done();
                        },
                        tcogHost: 'a.tcog.news.com.au'
                    }),

                    middleware = templateHandler(templateName);

                middleware(mocks.req, mocks.res);
            });
        });
    });

    describe('getTemplateConfig', function() {
        it('returns an empty object if config value is undefined', function() {
            const result = getImplementation().getTemplateConfig();
            expect(result).to.be.an('object');
            expect(Object.keys(result).length).to.equal(0);
        });

        it('requires and returns a config if config value passed', function() {
            let template = { config: { style: 'bar' } },
                result = getImplementation({
                    configs: {
                        'foo': template
                    }
                }).getTemplateConfig('foo');

            expect(result).to.equal(template.config);
        });

        it('returns an empty config if cannot load config', function() {
            const result = getImplementation({
                configs: {}
            }).getTemplateConfig('foo');

            expect(result).to.be.an('object');
            expect(Object.keys(result).length).to.equal(0);
        });
    });
});
