var basePath = '../../../../../../../transformers/1.0/components/spp-image-resolver',
    implementation =
        require(basePath + '/middleware/redirect-to-correct-crop_implementation');
expect = require('chai').expect;

describe('/components/spp-image-resolver/middleware/redirectToCorrectCrop', function() {
    it('should be a function', function() {
        var redirectToCorrectCrop = implementation();
        expect(redirectToCorrectCrop, 'redirectToCorrectCrop should be a valid function').to.be.a('function');
        expect(redirectToCorrectCrop.length, 'redirectToCorrectCrop should have an arity of 2').to.equal(2);
    });

    it('redirects when valid crop found', function() {
        var calledCount = 0,
            redirectToCorrectCrop = implementation();

        redirectToCorrectCrop.write404 = function(res, reason) {
            throw new Error('I should not be called');
        };

        redirectToCorrectCrop({}, {
            redirect: function(statusCode, location) {
                calledCount++;
                expect(
                    statusCode,
                    'status code should equal 301'
                ).to.equal(301);
                expect(
                    location,
                    'location should equal passed location'
                ).to.equal('http://img.com');
            },
            locals: {
                query: { width: 100, height: 100 },
                data: { results: [{ width: 100, height: 100, link: 'http://img.com' }] }
            }
        });

        expect(calledCount, 'res.redirect should have been called once').to.equal(1);
    });

    it('correctly resolves the crop with the closest height if the closest ' +
        'crop height is lower', function() {
        var calledCount = 0,
            redirectToCorrectCrop = implementation();

        redirectToCorrectCrop.write404 = function(res, reason) {
            throw new Error('I should not be called');
        };

        redirectToCorrectCrop({}, {
            redirect: function(statusCode, location) {
                calledCount++;
                expect(
                    statusCode,
                    'status code should equal 301'
                ).to.equal(301);
                expect(
                    location,
                    'location should equal passed location'
                ).to.equal('http://img2.com');
            },
            locals: {
                query: { width: 100, height: 100 },
                data: {
                    results: [
                        { width: 100, height: 120, link: 'http://img1.com' },
                        { width: 100, height: 97, link: 'http://img2.com' },
                        { width: 100, height: 5, link: 'http://img3.com' },
                        { width: 100, height: 700, link: 'http://img4.com' },
                        { width: 100, height: 900, link: 'http://img5.com' },
                        { width: 100, height: 200, link: 'http://img6.com' },
                        { width: 100, height: 20, link: 'http://img7.com' }
                    ]
                }
            }
        });

        expect(calledCount, 'res.redirect should have been called once').to.equal(1);
    });

    it('correctly resolves the crop with the closest height if the closest ' +
        'crop height is higher', function() {
        var calledCount = 0,
            redirectToCorrectCrop = implementation();

        redirectToCorrectCrop.write404 = function(res, reason) {
            throw new Error('I should not be called');
        };

        redirectToCorrectCrop({}, {
            redirect: function(statusCode, location) {
                calledCount++;
                expect(
                    statusCode,
                    'status code should equal 301'
                ).to.equal(301);
                expect(
                    location,
                    'location should equal passed location'
                ).to.equal('http://img1.com');
            },
            locals: {
                query: { width: 100, height: 100 },
                data: {
                    results: [
                        { width: 100, height: 120, link: 'http://img1.com' },
                        { width: 100, height: 20, link: 'http://img2.com' },
                        { width: 100, height: 5, link: 'http://img3.com' },
                        { width: 100, height: 700, link: 'http://img4.com' },
                        { width: 100, height: 900, link: 'http://img5.com' },
                        { width: 100, height: 200, link: 'http://img6.com' },
                        { width: 100, height: 20, link: 'http://img7.com' }
                    ]
                }
            }
        });

        expect(calledCount, 'res.redirect should have been called once').to.equal(1);
    });

    describe('write404', function() {
        var mocks,
            noop = function() {};

        beforeEach(function() {
            mocks = {
                res: {
                    locals: { query: {}, data: { results: [] } }
                }
            };
        });

        it('should be a function', function() {
            var write404 = implementation().write404;
            expect(write404, 'write404 should be a valid function').to.be.a('function');
            expect(write404.length, 'write404 should have an arity of 2').to.equal(2);
        });

        it('calls res.writeHead with the correct arguments', function() {
            var write404 = implementation({
                stringify: noop
            }).write404;
            write404({
                end: noop,
                writeHead: function(statusCode, payload) {
                    expect(
                        statusCode,
                        'res.writeHead should receive a status code of 400'
                    ).to.equal(400);
                    expect(
                        payload,
                        'res.writeHead should receive a correctly formatted payload'
                    ).to.eql({
                        'Content-type': 'application/json',
                        'X-Reason': 'a reason'
                    });
                }
            }, 'a reason');
        });

        it('calls res.end with the correct arguments', function() {
            var write404 = implementation().write404;
            write404({
                end: function(payload) {
                    expect(
                        payload,
                        'res.end should recieve a correctly formatted payload'
                    ).to.equal('{"code":404,"message":"a reason"}');
                },
                writeHead: noop
            }, 'a reason');
        });

        it('called with the correct arguments when no results', function() {
            var calledCount = 0,
                redirectToCorrectCrop = implementation();

            mocks.res.redirect = function() {
                throw new Error('I should not be called');
            };

            redirectToCorrectCrop.write404 = function(res, reason) {
                calledCount++;
                expect(res).to.eql(mocks.res);
                expect(
                    reason,
                    'write404 should receive a valid reason'
                ).to.equal('No images with this sourceId were found.');
            };

            redirectToCorrectCrop({}, mocks.res);
            expect(calledCount,
                'write404 should have been called once').to.equal(1);
        });

        it('called with the correct arguments when no valid crops found ( width )', function() {
            var calledCount = 0,
                redirectToCorrectCrop = implementation();

            redirectToCorrectCrop.write404 = function(res, reason) {
                calledCount++;
                expect(
                    res,
                    'req when supplied should match original req input'
                ).to.eql(mocks.res);
                expect(
                    reason,
                    'write404 should receive a valid reason'
                ).to.equal('No valid crop sizes for this image were found.');
            };

            mocks.res.locals.data.results = [{ width: 101, height: 100 }];
            mocks.res.locals.query = { width: 100, height: 100 };

            redirectToCorrectCrop({}, mocks.res);
            expect(calledCount,
                'write404 should have been called once').to.equal(1);
        });

        it('called with the correct arguments when no valid image link found', function() {
            var calledCount = 0,
                redirectToCorrectCrop = implementation();

            mocks.res.redirect = function() {
                throw new Error('I should not be called');
            };

            mocks.res.locals.data.results = [{}];

            redirectToCorrectCrop.write404 = function(res, reason) {
                calledCount++;
                expect(res, 'req object not correct').to.eql(mocks.res);
                expect(
                    reason,
                    'write404 should receive a valid reason'
                ).to.equal('No valid link for this image crop was found.');
            };

            redirectToCorrectCrop({}, mocks.res);
            expect(calledCount,
                'write404 should have been called once').to.equal(1);
        });
    });
});
