var modulePath = '../../../../../../../transformers/1.0/capi/v1/middleware/assets_implementation',
    expect = require('chai').expect,
    implementation = require(modulePath),

    getImplementation = function(deps) {
        deps = deps || {};
        return implementation(deps.logger, deps.agent, deps.config, deps._);
    };

describe('Assets Middleware', function() {
    var res;

    beforeEach(function() {
        res = {
            'locals': {
                'data': {
                    results: [
                        { originId: 0 },
                        { originId: '0-secondary' },
                        { originId: 1 },
                        { originId: '1-secondary' },
                        { originId: 2 },
                        { originId: '2-secondary' },
                        { originId: 3 },
                        { originId: '3-secondary' },
                        { originId: 4 },
                        { originId: '4-secondary' }
                    ]
                },
                'product': {
                    'capiV2APIKey': 'abc'
                }
            }
        };
    });

    it('constructs a valid host url', function(done) {
        var assets = getImplementation({
            agent: function(host, options, cb) {
                expect(host).to.be.equal('http://newsaustralia.api.mashery.com/dev/content/v1');
            }
        });
        assets({}, res, done);
    });

    it('calls next if no valid references extracted', function(done) {
        res.locals.data.results.push({
            originId: '12345',
            references: []
        });

        var assets = getImplementation({
            agent: function(host, options, cb) {
                throw new Error('I should not be called');
            }
        });
        assets({}, res, done);
    });

    it('calls agent if reference ids extracted', function(done) {
        res.locals.data.results.push({
            originId: '12345',
            references: [{
                'originId': '123456',
                'referenceType': 'PRIMARY'
            }]
        });

        var assets = getImplementation({
            agent: function(host, options, cb) {
                expect(options.query.originId[0]).to.equal('123456');
                done();
            },
            config: {
                capiV2CDN: 'http://www.foo.com'
            }
        });

        assets({}, res, function() {});
    });

    it('call back with error if request failed', function(done) {
        res.locals.data.results.push({
            originId: '12345',
            references: [{
                'originId': '123456',
                'referenceType': 'PRIMARY'
            }]
        });

        var assets = getImplementation({
            agent: function(host, options, cb) {
                cb(new Error('cannot requests'));
            },
            config: {
                capiV2CDN: 'http://www.foo.com'
            },
            logger: {
                error: function(options, message) {
                    expect(options.product).to.equal('foo');
                    expect(message)
                        .to.equal('Could not build primary assets for collection');
                }
            }
        });

        assets({
            tcogProduct: 'foo'
        }, res, function(err) {
            done();
        });
    });
});
