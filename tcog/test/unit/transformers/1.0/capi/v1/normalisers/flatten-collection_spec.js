var base = '../../../../../../..',
    flattenCollection =
        require(base + '/transformers/1.0/capi/v1/normalisers/flatten-collection'),
    _ = require('lodash'),
    expect = require('chai').expect,
    objectToNormalise;

describe('Flatten collection normaliser', function() {
    beforeEach(function() {
        objectToNormalise = {
            'data': {
                'results': [
                    {
                        'contentType': 'COLLECTION',
                        'related': [
                            {
                                'id': 'abc123',
                                'contentType': 'COLLECTION',
                                'dateLive': '2014-07-10T02:37:58.863Z'
                            },
                            {
                                'id': 'xyz123',
                                'contentType': 'COLLECTION',
                                'dateLive': '2014-07-12T02:37:58.863Z'
                            }
                        ]
                    }
                ]
            }
        };
    });

    it('adds the flattened result size to the response', function() {
        expect(objectToNormalise.data.resultSize).to.be.undefined;
        flattenCollection(objectToNormalise);
        expect(objectToNormalise.data.resultSize).to.be.defined;
        expect(objectToNormalise.data.resultSize).to.equal(2);
    });

    it('sorts the collection by date', function() {
        expect(objectToNormalise.data.results[0].related[0].id).to.equal('abc123');
        flattenCollection(objectToNormalise);
        expect(objectToNormalise.data.results[0].id).to.equal('xyz123');
    });

    it('retains a related map even where result collections may not contain one', function() {
        objectToNormalise = {
            'data': {
                'results': [
                    { 'contentType': 'COLLECTION' },
                    { 'contentType': 'COLLECTION' },
                    { 'contentType': 'COLLECTION' }
                ]
            }
        };

        flattenCollection(objectToNormalise);
        expect(objectToNormalise.data.results).to.be.an.instanceOf(Array);
        expect(objectToNormalise.data.results.length).to.equal(0);
        expect(objectToNormalise.data.results).to.eql([]);
    });

    it('retains a populated related map even where result collections may ' +
        'not contain one', function() {
        objectToNormalise = {
            'data': {
                'results': [
                    { 'contentType': 'COLLECTION', 'related': ['c'] },
                    { 'contentType': 'COLLECTION', 'related': ['a', 'b'] },
                    { 'contentType': 'COLLECTION' }
                ]
            }
        };

        flattenCollection(objectToNormalise);
        expect(objectToNormalise.data.results).to.be.an.instanceOf(Array);
        expect(objectToNormalise.data.results.length).to.equal(3);
        expect(objectToNormalise.data.results).to.eql(['c', 'a', 'b']);
    });
});
