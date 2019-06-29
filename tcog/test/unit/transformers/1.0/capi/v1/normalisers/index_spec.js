var base = '../../../../../../..',
    expect = require('chai').expect,
    normalisers = require(base + '/transformers/1.0/capi/v1/normalisers/index');

describe('Normalisers', function() {
    it('contains the correct normalisers', function() {
        expect(normalisers.addResultsArray).to.be.ok;
        expect(normalisers.flattenCollection).to.be.ok;
        expect(normalisers.getSectionFromUrl).to.be.ok;
        expect(normalisers.restructureDateGroup).to.be.ok;
        expect(normalisers.restructureImages).to.be.ok;
        expect(normalisers.resultReferenceIds).to.be.ok;
        expect(normalisers.testControl).not.to.be.ok;
        expect(Object.keys(normalisers).length).to.equal(7);
    });
});
