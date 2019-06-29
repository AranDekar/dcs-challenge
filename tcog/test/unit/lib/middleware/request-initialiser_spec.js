var requestInitialiser = require('../../../../lib/middleware/request-initialiser'),
    expect = require('chai').expect,
    req, res;

describe('content template handler', function() {
    describe('template parameters', function() {
        beforeEach(function() {
            req = {
                query: {
                    'tc_display': 'breaking'
                },
                headers: {
                    host: 'localhost:3002'
                }
            };

            res = {
                locals: {
                    data: {
                    }
                }
            };
        });

        afterEach(function() {
            res = null;
            req = null;
        });

        it('Parses the query if it does not exist', function(done) {
            delete req.query;
            req.url = '/foo?bar=baz';

            requestInitialiser(req, res, function() {
                expect(req.query).to.be.ok;
                expect(req.query).to.be.an('object');
                expect(req.query.bar).to.equal('baz');
                done();
            });
        });

        it('makes available a host parameter', function(done) {
            requestInitialiser(req, res, function() {
                expect(req.headers.host).to.equal('localhost:3002');
                done();
            });
        });
    });
});
