'use strict';

var modulePath = '../../../../../../../../transformers/1.0/components' +
                      '/article/middleware/interleave-media',
    expect = require('chai').expect,

    implementation = require(modulePath + '/index_implementation'),
    noop = function() {};

describe('/component/article', function() {
    describe('#interleaveMedia', function() {
        it('should be a function', function() {
            var interleavemedia = implementation();
            expect(interleavemedia).to.be.a('function');
            expect(
                interleavemedia.length,
                'has an arity of 3'
            ).to.equal(3);
        });

        it('calls next with error if interleave fails', function(done) {
            var interleavemedia = implementation({
                    body: function(input, locals, callback) {
                        callback(new Error('interleave error'));
                    },
                    link: noop
                }),

                resMock = {
                    locals: {
                        data: {
                            body: '<p>foo</p>'
                        }
                    }
                };

            interleavemedia({}, resMock, function(err) {
                expect(
                    err,
                    'error correctly returned'
                ).to.be.an('error');

                expect(
                    err.message,
                    'error message correct'
                ).to.equal('interleave error');

                done();
            });
        });

        it('interleave.body called with correct arguments', function(done) {
            var localsMock = { data: { body: '<p>foo</p>' } },
                interleavemedia = implementation({
                    body: function(input, locals, callback) {
                        expect(
                            input,
                            'input correctly passed'
                        ).to.equal(localsMock.data.body);
                        expect(
                            locals,
                            'locals correctly passed'
                        ).to.eql(localsMock);
                        expect(
                            callback,
                            'callback correctly passed'
                        ).to.be.a('function');
                        done();
                    },
                    link: noop
                });

            interleavemedia({}, {
                locals: localsMock
            }, function() {});
        });

        it('interleave.link called with correct arguments', function(done) {
            var localsMock = {
                    data: {
                        body: '<p>foo</p>',
                        standFirst: 'standFirst',
                        description: 'description',
                        bulletList: ['a', 'b', 'c']
                    }
                },
                results = [],
                interleavemedia = implementation({
                    body: noop,
                    link: function(input, locals, callback) {
                        results.push({
                            input: input,
                            locals: locals,
                            callback: callback
                        });
                    }
                });

            interleavemedia({}, {
                locals: localsMock
            }, function() {
                var expectedInputs = [
                    'standFirst',
                    'description',
                    '<p>a</p>',
                    '<p>b</p>',
                    '<p>c</p>'
                ];

                results.forEach(function(result, index) {
                    expect(
                        result.input,
                        'supplied input is correct'
                    ).to.equal(expectedInputs[index]);
                    expect(
                        result.locals,
                        'locals correctly passed'
                    ).to.eql(localsMock);
                    expect(
                        result.callback,
                        'callback correctly passed'
                    ).to.be.a('function');
                });

                done();
            });
        });
    });
});
