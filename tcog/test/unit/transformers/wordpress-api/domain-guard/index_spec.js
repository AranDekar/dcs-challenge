'use strict';

const domainGuard = require('../../../../../transformers/wordpress-api/domain-guard'),
    expect = require('chai').expect,
    async = require('async');

describe('transformer/spp-api', function() {
    const productsMock = {
        spp: { domain: 'masthead.com.au' },
        bar: { domain: 'override.com.au' },
        foo: {}
    };

    describe('guard middleware', function() {
        it('calls req.next should all required params be present', function(done) {
            let guard = domainGuard(productsMock),

                errorHandler = function(text) {
                    throw new Error('Should not have been called!');
                },

                res = {
                    end: errorHandler,
                    writeHead: errorHandler,
                    locals: { config: {}, product: { domain: 'masthead.com.au' } }
                };

            guard({}, res, function() {
                expect(
                    res.locals.config.domain,
                    'domain correctly set'
                ).to.equal('masthead.com.au');
                done();
            });
        });

        describe('config.domain (t_domain)', function() {
            it('calls req.next if value in valid domain list', function(done) {
                let guard = domainGuard(productsMock),

                    errorHandler = function(text) {
                        throw new Error('Should not have been called!');
                    },

                    res = {
                        end: errorHandler,
                        writeHead: errorHandler,
                        locals: {
                            config: { domain: 'override.com.au' },
                            product: { domain: 'masthead.com.au' }
                        }
                    };

                guard({}, res, function() {
                    expect(
                        res.locals.config.domain,
                        'override domain correctly set'
                    ).to.equal('override.com.au');
                    done();
                });
            });

            it('supports partial domain matching', function(done) {
                let guard = domainGuard(productsMock),

                    errorHandler = function(text) {
                        throw new Error('Should not have been called!');
                    },

                    res = {
                        end: errorHandler,
                        writeHead: errorHandler,
                        locals: {
                            config: {},
                            product: { domain: 'masthead.com.au' }
                        }
                    },

                    envs = [
                        'dev.overridedev.com.au',
                        'sit.overridesit.com.au',
                        'sit2.overridesit2.com.au',
                        'uat.overrideuat.com.au',
                        'ls.overridels.com.au',
                        'alpha.overridealpha.com.au',
                        'beta.overridebeta.com.au'
                    ],
                    count = 0;

                async.each(envs, function(env, cb) {
                    res.locals.config.domain = env;

                    guard({}, res, function() {
                        expect(
                            res.locals.config.domain,
                            'override domain correctly set'
                        ).to.equal(res.locals.config.domain);
                        count++;
                        cb();
                    });
                }, function(err) {
                    if (err) { done(err); }
                    if (count === envs.length) {
                        return done();
                    } else {
                        const err = new Error('not all envs were guarded. Count = ' + count);
                        done(err);
                    }
                });
            });

            it(
                'calls res.end with an error status should config.domain ' +
                'not be in approved domains list',
                function() {
                    let guard = domainGuard(productsMock),

                        resEndCalled = false,
                        resWriteHeadCalled = false,

                        res = {
                            end: function(text) {
                                expect(
                                    text,
                                    'Ends request with correct message'
                                ).to.equal('A valid domain is required.');
                                resEndCalled = true;
                            },
                            writeHead: function(code) {
                                expect(
                                    code,
                                    'Ends request with correct status code'
                                ).to.equal(400);
                                resWriteHeadCalled = true;
                            },
                            locals: {
                                config: { domain: 'unknowndomain.com.au' },
                                product: { domain: 'masthead.com.au' }
                            }
                        },
                        req = {},
                        next = function() {
                            throw new Error('Next should not have been called!');
                        };

                    guard(req, res, next);

                    expect(resEndCalled).to.be.ok;
                    expect(resWriteHeadCalled).to.be.ok;
                }
            );
        });

        describe('calls res.end with an error status', function() {
            it('should product.domain be missing', function() {
                let guard = domainGuard(productsMock),

                    resEndCalled = false,
                    resWriteHeadCalled = false,

                    res = {
                        end: function(text) {
                            expect(
                                text,
                                'Ends request with correct message'
                            ).to.equal('A valid domain is required.');
                            resEndCalled = true;
                        },
                        writeHead: function(code) {
                            expect(
                                code,
                                'Ends request with correct status code'
                            ).to.equal(400);
                            resWriteHeadCalled = true;
                        },
                        locals: { config: {}, product: {} }
                    },
                    req = {},
                    next = function() {
                        throw new Error('Next should not have been called!');
                    };

                guard(req, res, next);
                expect(resEndCalled).to.be.ok;
                expect(resWriteHeadCalled).to.be.ok;
            });
        });
    });
});
