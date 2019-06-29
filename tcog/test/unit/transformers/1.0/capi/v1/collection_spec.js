var sinon = require('sinon'),
    mockAgentMiddleware = sinon.spy(),
    assets = sinon.spy(),
    expect = require('chai').expect,
    templateHandler = sinon.spy();

describe('capi/v1/transformer/collection', function() {
    describe('routes', function() {
        it('contains the correct routes', function() {
            var transformer = require('./../../../../../../transformers/1.0/capi/v1/collection_implementation')(
                { capiV2CDN: 'http://www.blah.com/' },
                mockAgentMiddleware,
                assets,
                templateHandler
            );

            expect(Object.keys(transformer.routes).length).to.equal(2);
            expect(transformer.routes['/news/content/v1/collection/:id']).to.be.ok;
            expect(transformer.routes['/collection/:id']).to.be.ok;
        });
    });
});
