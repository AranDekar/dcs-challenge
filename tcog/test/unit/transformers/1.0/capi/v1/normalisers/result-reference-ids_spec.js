'use strict';

var normaliser,
    expect = require('chai').expect,
    base = '../../../../../../..';

describe('Video and gallery references', function() {
    before(function() {
        normaliser = require(base + '/transformers/1.0/capi/v1/normalisers/result-reference-ids');
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

    it('adds a video property to the result objects if there are secondary video references', function() {
        var objectToNormalise = {
            'data': {
                results: [
                    {
                        'dateLive': '2014-04-28T00:58:00.000Z',
                        'references': [
                            { 'id': 'abc', 'referenceType': 'SECONDARY', 'contentType': 'VIDEO' },
                            { 'id': 'xyz', 'referenceType': 'SECONDARY', 'contentType': 'VIDEO' }
                        ]
                    }
                ]
            }
        };

        expect(objectToNormalise.data.results[0].video).to.be.not.ok;
        normaliser(objectToNormalise);
        expect(objectToNormalise.data.results[0].video).to.be.ok;
    });

    it('does not add a video property to the result objects if there are no secondary video references', function() {
        var objectToNormalise = {
            'data': {
                results: [
                    {
                        'dateLive': '2014-04-28T00:58:00.000Z',
                        'references': [
                        ]
                    }
                ]
            }
        };

        expect(objectToNormalise.data.results[0].video).to.be.not.ok;
        normaliser(objectToNormalise);
        expect(objectToNormalise.data.results[0].video).to.be.not.ok;
    });

    it('takes the reference from the last secondary video in the references', function() {
        var objectToNormalise = {
            'data': {
                results: [
                    {
                        'dateLive': '2014-04-28T00:58:00.000Z',
                        'references': [
                            { 'id': 'abc', 'referenceType': 'SECONDARY', 'contentType': 'VIDEO' },
                            { 'id': 'xyz', 'referenceType': 'SECONDARY', 'contentType': 'VIDEO' }
                        ]
                    }
                ]
            }
        };

        expect(objectToNormalise.data.results[0].video).to.be.not.ok;
        normaliser(objectToNormalise);
        expect(objectToNormalise.data.results[0].video).to.be.ok;
        expect(objectToNormalise.data.results[0].video.id).to.equal('xyz');
    });

    it('adds an empty gallery array property to the result objects if there are no related image galleries', function() {
        var objectToNormalise = {
            'data': {
                results: [
                    {
                        'dateLive': '2014-04-28T00:58:00.000Z',
                        'references': [
                            { 'id': 'abc', 'referenceType': 'SECONDARY', 'contentType': 'VIDEO' },
                            { 'id': 'xyz', 'referenceType': 'SECONDARY', 'contentType': 'VIDEO' }
                        ]
                    }
                ]
            }
        };

        expect(objectToNormalise.data.results[0].gallery).to.be.not.ok;
        normaliser(objectToNormalise);
        expect(objectToNormalise.data.results[0].gallery).to.be.a('array');
    });

    it('adds a list of related image IDs for all galleries related to a result', function() {
        var objectToNormalise = {
            'data': {
                results: [
                    {
                        'related': [
                            {
                                'contentType': 'IMAGE_GALLERY',
                                'related': [
                                    { 'originId': 'abc' },
                                    { 'originId': 'def' }
                                ]
                            },
                            {
                                'contentType': 'IMAGE_GALLERY',
                                'related': [
                                    { 'originId': 'ghi' }
                                ]
                            }
                        ]
                    }
                ]
            }
        };

        expect(objectToNormalise.data.results[0].gallery).to.be.not.ok;
        normaliser(objectToNormalise);
        expect(objectToNormalise.data.results[0].gallery).to.be.ok;
        expect(objectToNormalise.data.results[0].gallery.length).to.equal(3);
    });

    it('adds a list of related image IDs for all galleries related to all result', function() {
        var objectToNormalise = {
            'data': {
                results: [
                    {
                        'related': [
                            {
                                'contentType': 'IMAGE_GALLERY',
                                'related': [
                                    { 'originId': 'abc' },
                                    { 'originId': 'def' }
                                ]
                            },
                            {
                                'contentType': 'IMAGE_GALLERY',
                                'related': [
                                    { 'originId': 'ghi' }
                                ]
                            }
                        ]
                    },
                    {
                        'related': [
                            {
                                'contentType': 'IMAGE_GALLERY',
                                'related': [
                                    { 'originId': 'def' }
                                ]
                            },
                            {
                                'contentType': 'IMAGE_GALLERY',
                                'related': [
                                    { 'originId': 'ghi' }
                                ]
                            }
                        ]
                    }
                ]
            }
        };

        expect(objectToNormalise.data.results[0].gallery).to.be.not.ok;
        expect(objectToNormalise.data.results[1].gallery).to.be.not.ok;
        normaliser(objectToNormalise);
        expect(objectToNormalise.data.results[0].gallery).to.be.ok;
        expect(objectToNormalise.data.results[1].gallery).to.be.ok;
        expect(objectToNormalise.data.results[0].gallery.length).to.equal(3);
        expect(objectToNormalise.data.results[1].gallery.length).to.equal(2);
    });
});
