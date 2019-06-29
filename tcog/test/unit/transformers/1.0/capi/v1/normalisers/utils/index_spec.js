var base = '../../../../../../../..',
    expect = require('chai').expect,
    utils = require(base + '/transformers/1.0/capi/v1/normalisers/utils');

describe('normaliser utils - #containsCollection', function() {
    it('returns true with a contentType of Collection', function() {
        var doc = [
            {
                contentType: 'NEWS_STORY'
            },
            {
                contentType: 'COLLECTION'
            }
        ];
        expect(utils.containsCollection(doc)).to.be.true;
    });

    it('returns false otherwise', function() {
        var doc = [
            {
                contentType: 'NEWS_STORY'
            }
        ];
        expect(utils.containsCollection(doc)).to.be.false;
    });
});
