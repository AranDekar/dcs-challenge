'use strict';

var path = '../../../../../transformers/resource/middleware/toJSON',
    expect = require('chai').expect,
    implementation = require(path);

describe('components/resource', function() {
    describe('middleware', function() {
        describe('toJSON', function() {
            it('calls next if res.locals.data is object', function(done) {
                var toJSON = implementation({
                    parse: function() {
                        throw new Error('I should not be called');
                    }
                });

                toJSON({}, { locals: { data: {} } }, done);
            });

            it('calls next if res.locals.data not defined', function(done) {
                var toJSON = implementation({
                    parse: function() {
                        throw new Error('I should not be called');
                    }
                });

                toJSON({}, { locals: { } }, done);
            });

            it('parse res.locals.data to JSON', function() {
                var toJSON = implementation({
                        parse: function(obj) {
                            expect(obj).equals('{"foo":"bar"}');
                            return { 'foo': 'bar' };
                        }
                    }),

                    mock = { locals: { data: '{"foo":"bar"}' } };

                toJSON({}, mock, function() {
                    expect(mock.locals.data).to.eql({ 'foo': 'bar' });
                });
            });

            it('calls back with error if parsing fails', function() {
                var toJSON = implementation({
                        parse: function(obj) {
                            throw new Error('parse error');
                        }
                    }),

                    mock = { locals: { data: '{"fo}' } };

                toJSON({}, mock, function(err) {
                    expect(err).to.be.ok;
                    expect(err.message).to.equal('parse error');
                });
            });
        });
    });
});
