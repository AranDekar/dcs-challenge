var _ = require('lodash'),
    base = '../../../../../../..',
    conf = require(base + '/conf'),
    normaliser =
        require(base + '/transformers/1.0/capi/v1/normalisers/add-results-array'),
    doc = require('../../../../../../fixtures/api-content-retrieve1.json'),
    expect = require('chai').expect,
    docWithResults = require('../../../../../../fixtures/api-search1.json');

describe('Results array normaliser', function() {
    it('normalises responses without a "results" property', function() {
        var objectToNormalise = { data: _.clone(doc) };
        normaliser(objectToNormalise);
        expect(objectToNormalise.data.results).to.be.an.instanceOf(Array);
        expect(objectToNormalise.data.results.length).to.equal(1);
        expect(objectToNormalise.data.results[0]).to.deep.equal(doc);
    });

    it('does not normalise responses that already contain a "results" property', function() {
        var objectToNormalise = { data: docWithResults };
        normaliser(objectToNormalise);
        expect(objectToNormalise.data.results).to.be.an.instanceOf(Array);
        expect(objectToNormalise.data).to.deep.equal(docWithResults);
    });
});
