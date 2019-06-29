'use strict';

var path = '../../../../../transformers/resource/middleware/guard',
    expect = require('chai').expect,
    implementation = require(path);

describe('components/resource', function() {
    describe('middleware', function() {
        describe('guard', function() {
            it('skips guard if param.contentType === "application/json"', function(done) {
                var middleware = implementation({
                        extname: function(path) {
                            throw new Error('path.extanme should not be called');
                        }
                    }),

                    mock = {
                        req: {
                            params: {
                                path: '/foo',
                                contentType: 'application/json'
                            }
                        },
                        res: {}
                    };

                middleware(mock.req, mock.res, done);
            });

            it('calls next if extension is JSON', function(done) {
                var middleware = implementation({
                        extname: function(path) {
                            expect(path).to.equal('/foo.json');
                            return '.json';
                        }
                    }),

                    mock = {
                        req: { params: { path: '/foo.json' } },
                        res: {
                            writeHead: function() {
                                throw new Error('I should not be called');
                            }
                        }
                    };

                middleware(mock.req, mock.res, done);
            });

            it('ends request if document not JSON', function() {
                var middleware = implementation({
                        extname: function(path) {
                            expect(path).to.equal('/foo.js');
                            return '.js';
                        }
                    }),

                    mock = {
                        req: { params: { path: '/foo.js' } },
                        res: {
                            writeHead: function(status) {
                                expect(status).to.equal(400);
                            },
                            end: function(message) {
                                expect(message)
                                    .to.equal('You must specify a ".json" document.');
                            }
                        }
                    };

                middleware(mock.req, mock.res, function() {
                    throw new Error('I should not be called');
                });
            });

            it('does nothing if not JSON & request ended', function() {
                var middleware = implementation({
                        extname: function(path) {
                            expect(path).to.equal('/foo.js');
                            return '.js';
                        }
                    }),

                    mock = {
                        req: { params: { path: '/foo.js' } },
                        res: {
                            writeHead: function(status) {
                                throw new Error('I should not be called');
                            },
                            end: function(message) {
                                throw new Error('I should not be called');
                            },
                            ended: true
                        }
                    };

                middleware(mock.req, mock.res, function() {
                    throw new Error('I should not be called');
                });
            });
        });
    });
});
