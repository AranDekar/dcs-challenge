var transformer =
    require('../../../../../../transformers/1.0/components/spp-image-resolver');
expect = require('chai').expect;

describe('SPP Image resolver transformer', function() {
    describe('routes', function() {
        it('contains the correct routes', function() {
            expect(Object.keys(transformer.routes).length).to.equal(1);
            expect(transformer
                .routes['/component/spp-image-resolver/']).to.be.ok;
        });
    });
});
