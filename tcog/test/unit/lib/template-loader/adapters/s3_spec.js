var _ = require('lodash'),
    modulePath = '../../../../../lib/template-loader/adapters/s3_implementation',
    expect = require('chai').expect,
    implementation = require(modulePath),

    getImplementation = function(depsIn) {
        depsIn = depsIn || {};

        var dependencies = _.extend({}, depsIn),

            moduleToTest = implementation(
                dependencies.request,
                dependencies.JSON,
                dependencies.config
            );

        return moduleToTest;
    },

    remoteHost = 'http://www.foo.com.au/cs';

describe('template adapter', function() {
    describe('s3', function() {
        describe('calls agent with correct remote file path', function(done) {
            it('does not contain @ version', function(done) {
                var filePath = '/remote/latest/templates/component/index.json',
                    remotePath = remoteHost + filePath,
                    adapter = getImplementation({
                        request: function(uri, cb) {
                            expect(uri).to.equal(remotePath);
                            done();
                        },
                        config: {
                            api: { template: 'http://www.foo.com.au/cs' }
                        }
                    });

                adapter('remote/component/index', function() {});
            });

            it('does contain @ version', function(done) {
                var filePath = '/remote/v2.0.0/templates/component/index.json',
                    remotePath = remoteHost + filePath,
                    adapter = getImplementation({
                        request: function(uri, cb) {
                            expect(uri).to.equal(remotePath);
                            done();
                        },
                        config: {
                            api: { template: 'http://www.foo.com.au/cs' }
                        }
                    });

                adapter('remote/component/index@v2.0.0', function() {});
            });
        });

        it('calls agent with correct remote file path when namespaced', function(done) {
            var filePath = '/remote/name/space/latest/templates/component/index.json',
                remotePath = remoteHost + filePath,
                adapter = getImplementation({
                    request: function(uri, cb) {
                        expect(uri).to.equal(remotePath);
                        done();
                    },
                    config: {
                        api: { template: 'http://www.foo.com.au/cs' }
                    }
                });

            adapter('remote-name-space/component/index', function() {});
        });

        it('callback with error should remote request fail', function(done) {
            var error = new Error('fail'),
                adapter = getImplementation({
                    request: function(uri, callback) {
                        callback(error, {});
                    },
                    config: {
                        api: { template: 'http://www.foo.com.au/cs' }
                    }
                });

            adapter('remote/component/index', function(err, data) {
                expect(err).to.be.ok;
                expect(err.message).to.equal('fail');
                expect(data).to.not.be.ok;
                done();
            });
        });

        it('callback with error should remote request have a statusCode > 200', function(done) {
            var error = 'Unable to fetch remote template "/remote/latest/templates/' +
                        'component/index.json"',
                adapter = getImplementation({
                    request: function(uri, callback) {
                        callback(null, {
                            statusCode: 404
                        });
                    },
                    config: {
                        api: { template: 'http://www.foo.com.au/cs' }
                    }
                });

            adapter('remote/component/index', function(err, data) {
                expect(err).to.be.ok;
                expect(err.message).to.equal(error);
                expect(data).to.not.be.ok;
                done();
            });
        });

        it('callback with error should remote template parsing fail', function(done) {
            var remoteData = {
                    'template': 'function () {}'
                },
                adapter = getImplementation({
                    request: function(uri, callback) {
                        callback(null, {
                            statusCode: 200
                        }, JSON.stringify(remoteData));
                    },
                    JSON: {
                        parse: function() {
                            throw new Error('fail');
                        }
                    },
                    config: {
                        api: { template: 'http://www.foo.com.au/cs' }
                    }
                });

            adapter('remote/component/index', function(err, data) {
                expect(err).to.be.ok;
                expect(err.message).to.equal('fail');
                done();
            });
        });

        it('callback with code should remote request succeed', function(done) {
            var remoteData = {
                    'template': 'function () {}'
                },
                adapter = getImplementation({
                    request: function(uri, callback) {
                        callback(null, {
                            statusCode: 200
                        }, JSON.stringify(remoteData));
                    },
                    JSON: {
                        parse: function() {
                            return remoteData;
                        }
                    },
                    config: {
                        api: { template: 'http://www.foo.com.au/cs' }
                    }
                });

            adapter('remote/component/index', function(err, data) {
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                expect(data)
                    .to.equal('var template = ' + remoteData.template +
                        ';\noutput = template(data);');
                done();
            });
        });
    });
});
