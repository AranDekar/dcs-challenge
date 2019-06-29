const implementation = require('../../../../lib/middleware/product_implementation'),
    expect = require('chai').expect,
    getImplementation = function(deps) {
        deps = deps || {};

        deps.logger = deps.logger || {
            'debug': function() { }
        };

        return implementation(deps.config, deps.logger);
    };

describe('Product Middleware', function() {
    it('executes the next middleware in the chain if neither query/t_product nor header/x-tcog-product are set', function(done) {
        var req = { 'query': {}, 'headers': {} },
            res = { 'locals': {} },
            productMiddleware = getImplementation();

        productMiddleware(req, res, function() {
            expect(res.locals.product).to.equal(undefined);
            expect(res.productScanned).to.equal(true);
            done();
        });
    });

    it('populates res.locals.product if query/t_product is set, only', function(done) {
        var req = { 'query': { 't_product': 'foooooo' }, 'headers': {} },
            res = { 'locals': {} },
            productValue = { capiV2APIKey: 'key', name: 'foooooo' },
            debugCalled = false,

            productMiddleware = getImplementation({
                config: {
                    'products': {
                        'foooooo': { capiV2APIKey: 'key' }
                    }
                },
                logger: {
                    'debug': function(message) {
                        expect(message).to.equal('Product identified: foooooo');
                        debugCalled = true;
                    }
                }
            });

        productMiddleware(req, res, function() {
            expect(res.locals.product).to.eql(productValue);
            expect(res.locals.product.name).to.equal('foooooo');
            expect(debugCalled).to.equal(true);
            done();
        });
    });

    it('populates res.locals.product if headers/x-tcog-product is set, only', function(done) {
        var req = { 'query': {}, 'headers': { 'x-tcog-product': 'foooooo' } },
            res = { 'locals': {} },
            productValue = { capiV2APIKey: 'key', name: 'foooooo' },
            debugCalled = false,

            productMiddleware = getImplementation({
                config: {
                    'products': {
                        'foooooo': { capiV2APIKey: 'key' }
                    }
                },
                logger: {
                    'debug': function(message) {
                        expect(message).to.equal('Product identified: foooooo');
                        debugCalled = true;
                    }
                }
            });

        productMiddleware(req, res, function() {
            expect(res.locals.product).to.eql(productValue);
            expect(res.locals.product.name).to.equal('foooooo');
            expect(debugCalled).to.equal(true);
            done();
        });
    });

    it('does not populate res.locals.product if the config data is not found', function(done) {
        var req = { 'query': {}, 'headers': { 'x-tcog-product': 'foooooo' } },
            res = { 'locals': {} },

            productMiddleware = getImplementation({
                config: {
                    'products': {}
                },
                logger: {
                    'debug': function(message) {
                        throw new Error('The product was identified even though the config was missing.');
                    }
                }
            });

        productMiddleware(req, res, function() {
            expect(res.locals.product).to.equal(undefined);
            done();
        });
    });

    it('should not populate res.locals.product if case does not match', function(done) {
        var req = { 'query': {}, 'headers': { 'x-tcog-product': 'fOoOoOo' } },
            res = { 'locals': {} },
            productValue = {},
            debugCalled = false,

            productMiddleware = getImplementation({
                config: {
                    'products': {
                        'foooooo': productValue
                    }
                },
                logger: {
                    'debug': function(message) {
                        expect(message).to.equal('Product identified: foooooo');
                        debugCalled = true;
                    }
                }
            });

        productMiddleware(req, res, function() {
            expect(res.locals.product).to.not.be.ok;
            expect(debugCalled).to.equal(false);
            done();
        });
    });
});
