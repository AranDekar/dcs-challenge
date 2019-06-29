'use strict';

var chai = require('chai'),
    should = chai.should(),
    _ = require('lodash'),
    base = '../../../../../../..',
    expect = require('chai').expect,
    normaliser;

describe('Check that normalisers restructure image data', function() {
    before(function() {
        normaliser = require(base + '/transformers/1.0/capi/v1/normalisers/restructure-images');
    });

    describe('#normalise', function() {
        var fixture;

        beforeEach(function() {
            fixture = require('./../../../../../../fixtures/api-search-text-sport.json');
        });

        it('produces a relatedItems map', function() {
            var relatedItemsCount = fixture.results.filter(function(item) {
                return item.related.length > 0;
            }).length;

            var objectToNormalise = { data: fixture };

            normaliser(objectToNormalise);

            fixture.results.filter(function(item) {
                return Object.keys(item.relatedMap).length > 0;
            }).length.should.equal(relatedItemsCount);
        });

        it('stores the image width as a property on each relatedItems map', function() {
            var objectToNormalise = { data: fixture };

            normaliser(objectToNormalise);

            fixture.results.forEach(function(item) {
                if (item.relatedMap && item.relatedMap.image) {
                    Object.keys(item.relatedMap.image).forEach(function(widthKey) {
                        var imageWidth = parseInt(widthKey);
                        imageWidth.should.be.a('number');
                        item.relatedMap.image[widthKey].width.should.equal(imageWidth);
                    });
                }
            });
        });
    });
});
