var componentPath = '../../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave',
    expect = require('chai').expect,
    findAssetByIdInRelatedArray = require(componentPath + '/helpers/findAssetByIdInRelatedArray');

describe('/component/article', function() {
    describe('#interleaveMedia.findAssetByIdInRelatedArray', function() {
        it('Returns a related media object for a valid ID', function() {
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

            expect(findAssetByIdInRelatedArray('a', related),
                'The returned value must be an object')
                .to.be.an('object');

            expect(findAssetByIdInRelatedArray('a', related).id,
                "The returned object's ID must match the ID we searched for")
                .to.equal(related[0].id);
        });

        it('Returns a falsey value for an invalid ID', function() {
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
            }, {
                'idonthaveanid': {}
            }];

            expect(findAssetByIdInRelatedArray('nonexisting', related),
                'The returned value must be falsy')
                .to.not.be.ok;
        });
    });
});
