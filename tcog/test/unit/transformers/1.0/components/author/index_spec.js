var sinon = require('sinon'),
    mockAgentMiddleware = sinon.spy(),
    expect = require('chai').expect,
    mockMiddlewares = { templateHandler: sinon.spy() };

mockAgentMiddleware.parallel = sinon.spy();

describe('Author API transformer', function() {
    describe('routes', function() {
        it('contains the correct routes', function() {
            var transformer = require('./../../../../../../transformers/1.0/components/author/index_implementation')(
                { capiV2CDN: 'http://www.blah.com/' },
                mockAgentMiddleware,
                mockMiddlewares
            );
            expect(Object.keys(transformer.routes).length).to.equal(1);
            expect(transformer.routes['/component/author/:id']).to.be.ok;
        });
    });
});
