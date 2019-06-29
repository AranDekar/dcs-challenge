var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',
    expect = require('chai').expect,
    pickRelated = require(componentPath + '/helpers/pickRelated');

describe('/component/article', function() {
    describe('#interleaveMedia.pickRelated', function() {
        it('Finds the related media object for a paragraph object', function() {
            var related = [{
                'id': {
                    'value': 'a'
                }
            }, {
                'id': {
                    'value': 'b'
                }
            }, {
                'id': {
                    'value': 'c'
                }
            }];

            expect(pickRelated(related, {
                id: 'a'
            }),
            'The nth result item must be an object')
                .to.be.an('object');

            expect(pickRelated(related, {
                id: 'a'
            }),
            'The returned value must equal the nth value ' +
                    'within the results array')
                .to.equal(related[0]);

            expect(pickRelated(related, {
                id: 'b'
            }),
            'The returned value must equal the nth value ' +
                    'within the results array')
                .to.equal(related[1]);

            expect(pickRelated(related, {
                id: 'c'
            }),
            'The returned value must equal the nth value ' +
                    'within the results array')
                .to.equal(related[2]);
        });

        describe('Generates error messages for template debugging', function() {
            it('Returns an error paragraph if the passed-in' +
                ' object does not have an id property',
            function() {
                var related = [{
                    'id': {
                        'value': 'a'
                    }
                }, {
                    'id': {
                        'value': 'b'
                    }
                }, {
                    'id': {
                        'value': 'c'
                    }
                }];

                expect(pickRelated(related, {}),
                    'The result item must be an object')
                    .to.be.an('object');

                expect(~related.indexOf(pickRelated(related, {})),
                    'The returned object must not be within the results array')
                    .to.not.be.ok;

                expect(pickRelated(related, {}).html,
                    'The result must contain an error message')
                    .to.contain('did not have a valid ID');
            });

            it('Returns an error paragraph if the provided id' +
                " can't be found within the related array",
            function() {
                var related = [{
                    'id': {
                        'value': 'a'
                    }
                }, {
                    'id': {
                        'value': 'b'
                    }
                }, {
                    'id': {
                        'value': 'c'
                    }
                }];

                expect(pickRelated(related, {
                    id: 'nonexisting'
                }),
                'The result item must be an object')
                    .to.be.an('object');

                expect(~related.indexOf(pickRelated(related, {})),
                    'The returned object must not be within the results array')
                    .to.not.be.ok;

                expect(pickRelated(related, {
                    id: 'nonexisting'
                }).html,
                'The result must contain the right error message')
                    .to.contain('nonexisting');
            });
        });
    });
});
