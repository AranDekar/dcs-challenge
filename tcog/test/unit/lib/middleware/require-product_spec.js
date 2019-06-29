var requireProduct = require('../../../../lib/middleware/require-product'),
    expect = require('chai').expect;

describe('Require-product middleware', function() {
    it('Sets the status code to 403 and ends the request should res.locals.product be undefined', function(done) {
        var res = {
            'locals': {},
            'end': function(message) {
                expect(res.statusCode).to.equal(403);
                expect(message).to.equal('Missing or invalid product identifier.');
                done();
            }
        };

        requireProduct(null, res, function() {
            throw new Error('This should *not* be called.');
        });
    });

    it('Sets the status code to 403 and ends the request should res.locals.product.name be undefined', function(done) {
        var res = {
            'locals': { 'product': '' },
            'end': function(message) {
                expect(res.statusCode).to.equal(403);
                expect(message).to.equal('Missing or invalid product identifier.');
                done();
            }
        };

        requireProduct(null, res, function() {
            throw new Error('This should *not* be called.');
        });
    });

    it('Lets the request fall through if the product and product name are set on locals', function(done) {
        var res = {
            'statusCode': 200,
            'locals': { 'product': { 'name': 'done' } },
            'end': function(message) {
                throw new Error('This should *not* be called.');
            }
        };

        requireProduct(null, res, function() {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });
});
