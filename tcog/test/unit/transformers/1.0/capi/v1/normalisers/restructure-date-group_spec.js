'use strict';

var normaliser,
    expect = require('chai').expect,
    base = '../../../../../../..';

describe('Restructuring date group', function() {
    before(function() {
        normaliser =
            require(base + '/transformers/1.0/capi/v1/normalisers/restructure-date-group');
    });

    it('does not modify the response if the API response contains a collection', function() {
        var objectToNormalise = { 'data': { results: [ { 'contentType': 'COLLECTION' } ] } };
        normaliser(objectToNormalise);
        expect(objectToNormalise).to.deep.equal({ 'data': { results: [ { 'contentType': 'COLLECTION' } ] } });
    });

    it('does not modify the response if the API response contains no results', function() {
        var objectToNormalise = { 'data': { results: [] } };
        normaliser(objectToNormalise);
        expect(objectToNormalise).to.deep.equal({ 'data': { results: [] } });
    });

    it('marks the first item for each day in the API results', function() {
        var objectToNormalise = {
            'data': {
                results: [
                    { 'dateLive': '2014-04-28T00:58:00.000Z' },
                    { 'dateLive': '2014-04-28T00:58:00.000Z' },
                    { 'dateLive': '2014-04-28T00:58:00.000Z' },
                    { 'dateLive': '2014-04-29T00:58:00.000Z' },
                    { 'dateLive': '2014-04-29T00:58:00.000Z' },
                    { 'dateLive': '2014-04-29T00:58:00.000Z' },
                    { 'dateLive': '2014-04-30T00:58:00.000Z' },
                    { 'dateLive': '2014-05-01T00:58:00.000Z' }
                ]
            }
        };
        normaliser(objectToNormalise);
        expect(objectToNormalise.data.results[0].markDate).to.equal(true);
        expect(objectToNormalise.data.results[1].markDate).to.equal(false);
        expect(objectToNormalise.data.results[2].markDate).to.equal(false);
        expect(objectToNormalise.data.results[3].markDate).to.equal(true);
        expect(objectToNormalise.data.results[4].markDate).to.equal(false);
        expect(objectToNormalise.data.results[5].markDate).to.equal(false);
        expect(objectToNormalise.data.results[6].markDate).to.equal(true);
        expect(objectToNormalise.data.results[7].markDate).to.equal(true);
    });
});
