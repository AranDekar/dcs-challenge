var implementation = require('../../../../../transformers/1.0/chartbeat/index_implementation'),
    expect = require('chai').expect,
    noop = function() {};

describe('chartbeat/transformer', function() {
    describe('routes', function() {
        it('contains the correct routes', function() {
            var transformer = implementation({}, noop, noop, noop);
            expect(Object.keys(transformer.routes).length).to.equal(1);
            expect(transformer.routes['/chartbeat/(*)']).to.be.ok;
        });
    });
});
