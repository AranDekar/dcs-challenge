var middlewarePath = './../../../../lib/middleware/normalize-request-url',
    implementation = require(middlewarePath + '_implementation'),
    nurl = require('url'),
    expect = require('chai').expect;

describe('#/lib/middleware/normalize-request-url', function() {
    it('should be a function', function() {
        var normalizeRequestUrl = implementation();
        expect(normalizeRequestUrl, 'is a valid function').to.be.a('function');
        expect(normalizeRequestUrl.length, 'has an arity of 3').to.equal(3);
    });

    it('prefixes params with "t_" if equivalent params do not exist', function(done) {
        var normalizeRequestUrl = implementation(),
            req = {
                url: '/foo/bar?param=value',
                headers: {
                    'x-tcog-product': 'product',
                    'x-tcog-template': 'template'
                }
            };

        normalizeRequestUrl(req, null, function() {
            var url = nurl.parse(req.url, true);
            expect(
                url.query['t_product'],
                'x-tcog-product appended as t_product'
            ).to.equal('product');
            expect(
                url.query['t_template'],
                'x-tcog-template appended as t_template'
            ).to.equal('template');
            done();
        });
    });

    describe('generates a bad request', function() {
        it('when both t_product & x-tcog-product exist', function(done) {
            var normalizeRequestUrl = implementation(),
                req = {
                    url: '/foo/bar?param=value&t_product=foo',
                    headers: {
                        'x-tcog-product': 'product'
                    }
                },
                res = {
                    end: function(body) {
                        expect(
                            res.statusCode,
                            'correct statusCode set for bad request'
                        ).to.equal(400);

                        expect(
                            body,
                            'correct response body provided for bad request'
                        ).to.equal(
                            'Ambigious parameter usage: use either x-tcog-headers ' +
                            'or query params, not both'
                        );

                        done();
                    }
                };

            normalizeRequestUrl(req, res, function() {
                throw new Error('I should not be called');
            });
        });

        it('when both t_template & x-tcog-template exist', function(done) {
            var normalizeRequestUrl = implementation(),
                req = {
                    url: '/foo/bar?param=value&t_template=foo',
                    headers: {
                        'x-tcog-template': 'template'
                    }
                },
                res = {
                    end: function(body) {
                        expect(
                            res.statusCode,
                            'correct statusCode set for bad request'
                        ).to.equal(400);

                        expect(
                            body,
                            'correct response body provided for bad request'
                        ).to.equal(
                            'Ambigious parameter usage: use either x-tcog-headers ' +
                            'or query params, not both'
                        );

                        done();
                    }
                };

            normalizeRequestUrl(req, res, function() {
                throw new Error('I should not be called');
            });
        });
    });

    describe('when req.url contains query params (?param=value)', function() {
        it('does not modify url if no x-tcog headers found', function(done) {
            var normalizeRequestUrl = implementation(),
                req = {
                    url: '/foo/bar?param=value',
                    headers: {
                        'foo': 'product'
                    }
                };

            normalizeRequestUrl(req, null, function() {
                var url = nurl.parse(req.url, true);
                expect(url.query['t_product']).to.be.an('undefined');
                expect(url.query['t_template']).to.be.an('undefined');
                expect(url.search).to.equal('?param=value');
                done();
            });
        });

        it('appends x-tcog-product header to req.url', function(done) {
            var normalizeRequestUrl = implementation(),
                req = {
                    url: '/foo/bar?param=value',
                    headers: {
                        'x-tcog-product': 'product'
                    }
                };

            normalizeRequestUrl(req, null, function() {
                var url = nurl.parse(req.url, true);
                expect(url.query['t_product']).to.equal('product');
                expect(url.search).to.equal('?param=value&t_product=product');
                done();
            });
        });

        it('appends x-tcog-template header to req.url', function(done) {
            var normalizeRequestUrl = implementation(),
                req = {
                    url: '/foo/bar?param=value',
                    headers: {
                        'x-tcog-template': 'template'
                    }
                };

            normalizeRequestUrl(req, null, function() {
                var url = nurl.parse(req.url, true);
                expect(url.query['t_template']).to.equal('template');
                expect(url.search).to.equal('?param=value&t_template=template');
                done();
            });
        });

        it('appends x-tcog-( product & template ) header to req.url', function(done) {
            var normalizeRequestUrl = implementation(),
                req = {
                    url: '/foo/bar?param=value',
                    headers: {
                        'x-tcog-product': 'product',
                        'x-tcog-template': 'template'
                    }
                };

            normalizeRequestUrl(req, null, function() {
                var url = nurl.parse(req.url, true);
                expect(url.query['t_product']).to.equal('product');
                expect(url.query['t_template']).to.equal('template');
                expect(url.search).to.equal('?param=value&t_product=product&t_template=template');
                done();
            });
        });
    });

    describe('when req.url does not contain query params', function() {
        it('does not modify url if no x-tcog headers found', function(done) {
            var normalizeRequestUrl = implementation(),
                req = {
                    url: '/foo/bar',
                    headers: {
                        'foo': 'product'
                    }
                };

            normalizeRequestUrl(req, null, function() {
                var url = nurl.parse(req.url, true);
                expect(url.query['t_product']).to.be.an('undefined');
                expect(url.query['t_template']).to.be.an('undefined');

                // note, when running with node 10.x url.search is null
                // when with 8.11.x it returns an empty string
                expect(url.search).to.equal(null);
                done();
            });
        });

        it('appends x-tcog-product header to req.url', function(done) {
            var normalizeRequestUrl = implementation(),
                req = {
                    url: '/foo/bar',
                    headers: {
                        'x-tcog-product': 'product'
                    }
                };

            normalizeRequestUrl(req, null, function() {
                var url = nurl.parse(req.url, true);
                expect(url.query['t_product']).to.equal('product');
                expect(url.search).to.equal('?t_product=product');
                done();
            });
        });

        it('appends x-tcog-template header to req.url', function(done) {
            var normalizeRequestUrl = implementation(),
                req = {
                    url: '/foo/bar',
                    headers: {
                        'x-tcog-template': 'template'
                    }
                };

            normalizeRequestUrl(req, null, function() {
                var url = nurl.parse(req.url, true);
                expect(url.query['t_template']).to.equal('template');
                expect(url.search).to.equal('?t_template=template');
                done();
            });
        });

        it('appends x-tcog-( product & template ) header to req.url', function(done) {
            var normalizeRequestUrl = implementation(),
                req = {
                    url: '/foo/bar',
                    headers: {
                        'x-tcog-product': 'product',
                        'x-tcog-template': 'template'
                    }
                };

            normalizeRequestUrl(req, null, function() {
                var url = nurl.parse(req.url, true);
                expect(url.query['t_product']).to.equal('product');
                expect(url.query['t_template']).to.equal('template');
                expect(url.search).to.equal('?t_product=product&t_template=template');
                done();
            });
        });
    });
});
