var fresh = require('../../../../lib/middleware/fresh'),
    sinon = require('sinon'),
    leche = require('leche'),
    expect = require('chai').expect;

describe('The Fresh Prince of Middleware', function() {
    var req = {},
        res = {};

    beforeEach(function() {
        req = {
            headers: {}
        };
        res = {
            statusCode: null,
            setHeader: function() {},
            end: function() {}
        };

        fresh.dateNow = function() {
            return 1413867254443;
        };
    });

    afterEach(function() {
        fresh.dateNow = Date.now();
    });

    it('does not run if res.finished = true', function(done) {
        res.finished = true;
        res.setHeader = function() {
            throw new Error('I should not have been called');
        };
        fresh(req, res, done);
    });

    it('sets an etag header', function() {
        res.setHeader = sinon.spy();
        fresh(req, res, function() {});
        expect(res.setHeader.getCall(0).args[0]).to.equal('ETag');
        expect(res.setHeader.getCall(0).args[1]).to.equal('W/"4712890"');
    });

    it('sets a cache-control header', function() {
        res.setHeader = sinon.spy();
        fresh(req, res, function() {});
        expect(res.setHeader.getCall(1).args[0]).to.equal('Cache-Control');
        expect(res.setHeader.getCall(1).args[1]).to.equal('public, max-age=300, must-revalidate');
    });

    it('sets a shorter cache-control header for Akamai', function() {
        res.setHeader = sinon.spy();
        req.isAkamai = true;
        fresh(req, res, function() {});
        expect(res.setHeader.getCall(1).args[0]).to.equal('Cache-Control');
        expect(res.setHeader.getCall(1).args[1]).to.equal('public, max-age=60, must-revalidate');
    });

    it('immediately calls next without assigning a status code or ending if no if-none-match header is present', function() {
        var called = false;
        res.end = function() {
            throw new Error('Called res.end!');
        };
        fresh(req, res, function() {
            called = true;
        });

        expect(called).to.be.ok;
        expect(res.statusCode).to.equal(null);
    });

    it("ends the request with a 304 if if-none-match equals '*'", function() {
        var called = false;

        req.headers['if-none-match'] = '*';
        res.end = function() {
            called = true;
        };
        fresh(req, res, function() {});

        expect(called).to.be.ok;
        expect(res.statusCode).to.equal(304);
    });

    it('ends the request with a 304 if if-none-match equals the expected etag', function() {
        var called = false;

        req.headers['if-none-match'] = 'W/"4712890"';
        res.end = function() {
            called = true;
        };
        fresh(req, res, function() {});

        expect(called).to.be.ok;
        expect(res.statusCode).to.equal(304);
    });

    it('ends the request with a 304 if if-none-match equals the truncated date value', function() {
        var called = false;

        req.headers['if-none-match'] = '4712890';
        res.end = function() {
            called = true;
        };
        fresh(req, res, function() {});

        expect(called).to.be.ok;
        expect(res.statusCode).to.equal(304);
    });

    it('ends the request with a 304 if if-none-match equals the truncated date value, quoted', function() {
        var called = false;

        req.headers['if-none-match'] = '"4712890"';
        res.end = function() {
            called = true;
        };
        fresh(req, res, function() {});

        expect(called).to.be.ok;
        expect(res.statusCode).to.equal(304);
    });

    it('calls next without assigning a status code or ending if an invalid or expired etag is present', function() {
        var called = false;
        req.headers['if-none-match'] = 'W/"4712891"';
        res.end = function() {
            throw new Error('Called res.end!');
        };
        fresh(req, res, function() {
            called = true;
        });

        expect(called).to.be.ok;
        expect(res.statusCode).to.equal(null);
    });
});
