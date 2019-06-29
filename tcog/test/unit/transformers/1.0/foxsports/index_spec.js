var sinon = require('sinon'),
    mockAgentMiddleware = sinon.spy(),
    expect = require('chai').expect,
    templateHandler = sinon.spy();

describe('foxsports/transformer', function() {
    describe('routes', function() {
        it('contains the correct routes', function() {
            var transformer = require('./../../../../../transformers/1.0/foxsports/index_implementation')(
                { foxsportsAPI: 'http://www.blah.com/' },
                mockAgentMiddleware,
                templateHandler
            );

            expect(Object.keys(transformer.routes).length).to.equal(1);
            expect(transformer.routes['/foxsports/(*)']).to.be.ok;
        });
    });
});
