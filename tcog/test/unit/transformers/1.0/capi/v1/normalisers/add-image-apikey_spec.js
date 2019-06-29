var _ = require('lodash'),
    base = '../../../../../../..',
    conf = require(base + '/conf'),
    normaliser = require(base + '/transformers/1.0/capi/v1/normalisers/add-image-apikey'),
    fixture = require('../../../../../../fixtures/api-search1.json'),
    expect = require('chai').expect,
    url = require('url');

describe('Image Api Key normaliser', function() {
    it('adds api Key to Method Link', function() {
        var objectToNormalise = {
            data: _.cloneDeep(fixture)
        };
        objectToNormalise.data.results[0].thumbnailImage.origin = 'METHODE';
        objectToNormalise.data.results[0].related[0].origin = 'METHODE';
        objectToNormalise.product = {
            capiV2APIImageKey: 'testapikey'
        };
        expect(url.parse(objectToNormalise.data.results[0].thumbnailImage.link, true)
            .query['api_key']).to.not.be.ok;
        expect(url.parse(objectToNormalise.data.results[0].related[0].link, true)
            .query['api_key']).to.not.be.ok;
        normaliser(objectToNormalise);
        expect(url.parse(objectToNormalise.data.results[0].thumbnailImage.link, true)
            .query['api_key']).to.be.ok;
        expect(url.parse(objectToNormalise.data.results[0].thumbnailImage.link, true)
            .query['api_key']).to.be.equal('testapikey');
        expect(url.parse(objectToNormalise.data.results[0].related[0].link, true)
            .query['api_key']).to.be.equal('testapikey');
    });

    it('does not add API key to FATWIRE LINKS', function() {
        var objectToNormalise = {
            data: _.cloneDeep(fixture)
        };

        objectToNormalise.data.results[0].thumbnailImage.origin = 'FATWIRE';
        objectToNormalise.data.results[0].related[0].origin = 'FATWIRE';

        objectToNormalise.product = {
            capiV2APIImageKey: 'testapikey'
        };
        expect(url.parse(objectToNormalise.data.results[0].thumbnailImage.link, true)
            .query['api_key']).to.not.be.ok;
        expect(url.parse(objectToNormalise.data.results[0].related[0].link, true)
            .query['api_key']).to.not.be.ok;

        normaliser(objectToNormalise);

        expect(url.parse(objectToNormalise.data.results[0].thumbnailImage.link, true)
            .query['api_key']).to.not.be.ok;
        expect(url.parse(objectToNormalise.data.results[0].related[0].link, true)
            .query['api_key']).to.not.be.ok;
    });

    it('can handle images without links', function() {
        var objectToNormalise = {
            data: _.cloneDeep(fixture)
        };
        objectToNormalise.product = {
            capiV2APIImageKey: 'testapikey'
        };

        expect(objectToNormalise.data.results[0].related[0].link).to.be.ok;
        delete objectToNormalise.data.results[0].related[0].link;

        objectToNormalise.data.results[0].related[0].origin = 'METHODE';
        normaliser(objectToNormalise);

        expect(objectToNormalise.data.results[0].related[0].link).to.not.be.ok;
    });
});
