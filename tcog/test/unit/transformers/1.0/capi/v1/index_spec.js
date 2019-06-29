var sinon = require('sinon'),
    mockAgentMiddleware = sinon.spy(),
    expect = require('chai').expect,
    templateHandler = sinon.spy();

describe('capi/v1/transformer/retrieve', function() {
    describe('routes', function() {
        it('contains the correct routes', function() {
            var transformer = require('./../../../../../../transformers/1.0/capi/v1/index_implementation')(
                { capiV2CDN: 'http://www.blah.com/' },
                mockAgentMiddleware,
                templateHandler
            );
            expect(Object.keys(transformer.routes).length).to.equal(2);
            expect(transformer.routes['/news/content/v1/:id']).to.be.ok;
            expect(transformer.routes['/news/content/v1/methode/:id']).to.be.ok;
        });
    });
});
