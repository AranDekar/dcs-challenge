var endpointMiddleware = require('../../../../lib/middleware/tracking-pixel-endpoint'),
    expect = require('chai').expect;

describe('Tracking Pixel Endpoint Middleware', function() {
    it("allows requests which do not match '/track' to continue",
        function(done) {
            var req = {
                url: '/foo/bar?baz=qux',
                setHeader: function() {
                    throw new Error('res.setHeader Called!');
                },
                end: function() {
                    throw new Error('res.end Called!');
                }
            };

            endpointMiddleware(req, {}, done);
        });

    it("writes an empty gif to requests which match '/track', and ends",
        function(done) {
            var expectedHeaderValues = {
                'Content-Type': 'image/gif',
                'Content-Length': 43,
                'Pragma': 'no-cache',
                'Expires': '0',
                'Cache-Control':
     'private, no-cache, no-store, must-revalidate'
            };

            var callCount = 0,
                res = {
                    writeHead: function(code, values) {
                        callCount++;
                        expect(code,
                            'Tracking pixel endpoint should send 200 status')
                            .to.equal(200);

                        expect(values,
                            'Tracking pixel endpoint should set an object ' +
       'map of headers')
                            .to.be.an('object');

                        expect(values,
                            'Headers should match expected values')
                            .to.eql(expectedHeaderValues);
                    },
                    end: function(data) {
                        callCount++;
                        expect(data).to.equal(endpointMiddleware.emptyGif);
                        expect(callCount).to.equal(2);
                        done();
                    }
                },
                req = {
                    url: '/track/foo/bar?baz=qux'
                };

            endpointMiddleware(req, res, function() {
                throw new Error('I should not be called');
            });
        });
});
