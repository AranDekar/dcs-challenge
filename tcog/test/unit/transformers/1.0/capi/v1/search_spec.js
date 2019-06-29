var sinon = require('sinon'),
    mockAgentMiddleware = sinon.spy(),
    mockForwardPopularToV2Middleware = sinon.spy(),
    expect = require('chai').expect,
    templateHandler = sinon.spy();

describe('capi/v1/transformer/search', function() {
    describe('routes', function() {
        it('contains the correct routes', function() {
            var transformer = require('./../../../../../../transformers/1.0/capi/v1/search_implementation')(
                { capiV2CDN: 'http://www.blah.com/' },
                mockAgentMiddleware,
                mockForwardPopularToV2Middleware,
                templateHandler
            );
            expect(Object.keys(transformer.routes).length).to.equal(3);
        });
    });
});
