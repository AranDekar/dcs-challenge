'use strict';

let express = require('express'),
    app = express(),
    request = require('supertest'),
    cheerio = require('cheerio'),
    async = require('async'),
    leche = require('leche'),
    sinon = require('sinon'),
    expect = require('chai').expect,

    modulePath = './../../../../lib/middleware/statusCodeResponder_implementation',
    middleware = require(modulePath),
    noop = function() {};

describe('statusCodeResponder middleware', function() {
    var responder = middleware(leche.create(['fatal', 'trace']));

    // status code
    // Ensure the correct status code is set

    describe('status codes', function() {
        async.each([200, 401, 404, 500, 501], function(status, cb) {
            it(status + ': returns the correct HTTP status code', function() {
                const route = '/status/' + status;
                app.get(route, responder(status));
                request(app)
                    .get(route)
                    .expect(status)
                    .end(function(err) {
                        if (err) {
                            return cb(err);
                        }
                        cb();
                    });
            });
        });
    });

    it('does not write a response if the response has already ended', function() {
        const middleware = responder(404);
        const res = {
            'finished': true,
            'sendFile': function() {
                throw new Error('Should not have sent file!');
            },
            'status': function() {
                throw new Error('Should not have attempted to set status!');
            },
            'end': function() {
                throw new Error('Should not have attempted to end the response!');
            }
        };

        middleware({}, res);
    });

    // templates
    // Ensure status codes return the correct template when specified
    describe('template', function() {
        const templates = [{
            status: 404,
            template: {
                path: '/404.html',
                root: './public'
            }
        }, {
            status: 500,
            template: {
                path: '/500.html',
                root: './public'
            }
        }];

        async.each(templates, function(item, cb) {
            it(item.status + ': returns the correct HTTP status code and correct template', function() {
                const route = '/template/' + item.status;
                app.get(route, responder(item.status, item.template));
                request(app)
                    .get(route)
                    .expect(item.status)
                    .end(function(err, res) {
                        if (err) return cb(err);
                        const $ = cheerio.load(res.text);
                        expect(parseInt($('h1').text(), 10)).to.equal(item.status);
                        cb();
                    });
            });
        });
    });

    // Error Handling
    // Ensure middleware calls the correct error handler

    describe('Error Handler', function() {
        let spies = {
                trace: sinon.spy(),
                fatal: sinon.spy()
            },

            // proxy in the middleware stubbing out the
            // logger

            mware = middleware({
                trace: spies.trace,
                fatal: spies.fatal
            });

        beforeEach(function() {
            spies.trace.reset();
            spies.fatal.reset();
        });

        it('raises a fatal log when an error argument is passed and instance of an error', function() {
            mware(500)(new Error('This is an error'), {}, {
                status: noop,
                end: function() {
                    const spyArgs = spies.fatal.args[0];

                    expect(spies.fatal.called).to.be.true;
                    expect(spies.trace.called).to.be.false;
                    expect(spyArgs[0].err).to.not.eql(null);
                }
            }, noop);
        });

        it('raises a fatal log when an error argument is passed but null', function() {
            mware(500)(null, {}, {
                status: noop,
                end: function() {
                    const spyArgs = spies.fatal.args[0];

                    expect(spies.fatal.called).to.be.true;
                    expect(spies.trace.called).to.be.false;
                    expect(spyArgs[0].err).to.eql(null);
                    expect(spyArgs[1]).to.eql('500 Unknown error.');
                }
            }, noop);
        });

        it('raise a trace log when no error argument is passed', function() {
            mware(200)({
                path: '/some/path'
            }, {
                status: noop,
                end: function() {
                    const spyArgs = spies.trace.args[0];
                    expect(spies.fatal.called).to.be.false;
                    expect(spies.trace.called).to.be.true;
                    expect(spyArgs[0].err).to.eql(undefined);
                    expect(spyArgs[1]).to.eql('200 /some/path');
                }
            }, noop);
        });
    });
});
