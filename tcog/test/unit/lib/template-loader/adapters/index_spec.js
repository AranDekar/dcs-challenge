var adapters = require('./../../../../../lib/template-loader/adapters/index'),
    expect = require('chai').expect;

describe('#/lib/template-loader/adapters', function() {
    describe('exports the correct adapters', function() {
        var requiredAdapter = [
            'core',
            's3'
        ];

        requiredAdapter.forEach(function(name) {
            it(name + ' should exist', function() {
                expect(adapters[name]).to.be.ok;
            });
        });

        it('should not contain the test control middleware', function() {
            expect(adapters.testControl).to.not.be.ok;
        });

        it('should contain the right amount of middleware', function() {
            expect(Object.keys(adapters).length).to.equal(
                requiredAdapter.length);
        });
    });
});
