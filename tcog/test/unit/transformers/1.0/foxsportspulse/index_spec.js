var sinon = require('sinon'),
    mockAgentMiddleware = sinon.spy(),
    expect = require('chai').expect,
    templateHandler = sinon.spy();

describe('foxsports/transformer', function() {
    describe('routes', function() {
        it('contains the correct routes', function() {
            var transformer = require('./../../../../../transformers/1.0/foxsportspulse/index_implementation')(
                { foxsportspulseAPI: 'http://www.blah.com/' },
                mockAgentMiddleware,
                templateHandler
            );

            expect(Object.keys(transformer.routes).length).to.equal(1);
            expect(transformer.routes['/foxsportspulse/(*)']).to.be.ok;
        });
    });
});
