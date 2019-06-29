const expect = require('chai').expect;

describe('/component/article/middleware/api-key-override', function() {
    it('should override capiV2APIImageKey if override paramater specified', function(done) {
        var req = { 'query': {
                't_product': 'testproduct',
                't_product_imageApiKey': 'changed' }
            },
            middleware = require('../../../../../../../transformers/1.0/components/article/middleware/api-key-override'),

            res = {
                'locals': {
                    product: {
                        capiV2APIImageKey: 'original'
                    }
                }
            };

        middleware(req, res, function() {
            expect(res.locals.product.capiV2APIImageKey).to.equal('changed');
            done();
        });
    });

    it('should override capiV2APIKey if override paramater specified', function(done) {
        var req = { 'query': {
                't_product': 'testproduct',
                't_product_apiKey': 'changed' }
            },
            middleware = require('../../../../../../../transformers/1.0/components/article/middleware/api-key-override'),

            res = {
                'locals': {
                    product: {
                        capiV2APIKey: 'original'
                    }
                }
            };

        middleware(req, res, function() {
            expect(res.locals.product.capiV2APIKey).to.equal('changed');
            done();
        });
    });

    it('should override capiV2APIConfigKey if override paramater specified', function(done) {
        var req = { 'query': {
                't_product': 'testproduct',
                't_product_configApiKey': 'changed' }
            },
            middleware = require('../../../../../../../transformers/1.0/components/article/middleware/api-key-override'),

            res = {
                'locals': {
                    product: {
                        capiV2APIConfigKey: 'original'
                    }
                }
            };

        middleware(req, res, function() {
            expect(res.locals.product.capiV2APIConfigKey).to.equal('changed');
            done();
        });
    });

    it('should override multiple keys if override paramaters are specified', function(done) {
        var req = { 'query': {
                't_product': 'testproduct',
                't_product_imageApiKey': 'changed',
                't_product_apiKey': 'changed',
                't_product_configApiKey': 'changed'
            }
            },
            middleware = require('../../../../../../../transformers/1.0/components/article/middleware/api-key-override'),

            res = {
                'locals': {
                    product: {
                        capiV2APIImageKey: 'original',
                        capiV2APIConfigKey: 'original',
                        capiV2APIKey: 'original'
                    }
                }
            };

        middleware(req, res, function() {
            expect(res.locals.product.capiV2APIImageKey).to.equal('changed');
            expect(res.locals.product.capiV2APIConfigKey).to.equal('changed');
            expect(res.locals.product.capiV2APIKey).to.equal('changed');
            done();
        });
    });
});
