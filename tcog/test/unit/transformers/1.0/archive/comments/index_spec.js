var implementation = require('../../../../../../transformers/1.0/archive/comments/index_implementation'),
    expect = require('chai').expect,
    noop = function() {};

describe('archive/comments/transformer', function() {
    describe('routes', function() {
        it('contains the correct routes', function() {
            var transformer = implementation({
                archiveComments: {}
            }, noop, noop, noop);
            expect(Object.keys(transformer.routes).length).to.equal(1);
            expect(transformer.routes['/archive/comments/(*)']).to.be.ok;
        });
    });
});
