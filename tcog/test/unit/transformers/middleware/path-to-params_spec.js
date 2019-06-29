var pathToParams = require('../../../../transformers/middleware/path-to-params'),
    expect = require('chai').expect;

describe('path to params', function() {
    const req = {
        params: {},
        path: 'firestore/v1/projects/ncau-ed-taus-lists/databases/(default)/documents/rich-250?t_product=tcog&t_output=json'
    };
    const res = {};

    it('req.params should contain firestore/v1/', function(done) {
        pathToParams(req, res, function() {
            /* This assert is to ensure that the req.params is in the right format with the right data before it's passed on to the normalizeParams.js middleware */
            expect(req.params[0]).to.have.string('firestore/v1/projects/ncau-ed-taus-lists/databases/(default)/documents/rich-250');
            done();
        });
    });
});
