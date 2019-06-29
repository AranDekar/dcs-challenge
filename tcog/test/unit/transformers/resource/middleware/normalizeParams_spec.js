'use strict';

var path = '../../../../../transformers/resource/middleware/normalizeParams',
    expect = require('chai').expect,
    implementation = require(path);

describe('components/resource', function() {
    describe('middleware', function() {
        describe('normalizeParams', function() {
            it('adds params.resource & params.path', function(done) {
                var middleware = implementation({ cs: 'http://remote.com.au' }),

                    mock = {
                        req: {
                            params: {
                                '0': '/cs/foo/bar/buzz.json'
                            }
                        }
                    };

                middleware(mock.req, {}, function() {
                    expect(
                        mock.req.params.resource,
                        'correct remote resource set'
                    ).to.equal('http://remote.com.au');
                    expect(
                        mock.req.params.path,
                        'correct path set'
                    ).to.equal('foo/bar/buzz.json');
                    done();
                });
            });

            it('adds default params.contentType if resource.contentType set', function(done) {
                var middleware = implementation({
                        cs: {
                            url: 'http://remote.com.au',
                            contentType: 'application/json'
                        }}),

                    mock = {
                        req: {
                            params: {
                                '0': '/cs/foo/bar/buzz.json'
                            }
                        }
                    };

                middleware(mock.req, {}, function() {
                    expect(
                        mock.req.params.contentType,
                        'correct contentType set'
                    ).to.equal('application/json');
                    done();
                });
            });
        });
    });
});
