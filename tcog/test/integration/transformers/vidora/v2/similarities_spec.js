'use strict';

const express = require('express'),
    request = require('supertest'),
    generateSimilarities = require('../../../../../transformers/vidora/v2/similarities'),
    middleware = require('../../../../../lib/middleware'),
    nock = require('nock'),
    expect = require('chai').expect,
    conf = require('../../../../../conf'),
    userId = '123',
    itemId = 'xyz';

const app = express();

app.get('/:user_id/items/:item_id/similars', middleware.requestInitialiser, generateSimilarities());

const vidoraData = { items:
[ '8f20c752114bf3fc06fec908e28ebb19',
    '6ba0d31afb914181770794abbd2c5bbb',
    '3072c5780556b0816d3ebba506607856',
    'c2c02ed1d53f1c173b9277b6a0427e75',
    '76d50806c5e1b84a40997779bccf6aed',
    '2aef7e4e7a684d1e021c1330bbab5633',
    'd946dd5836fe5cc4d32969dfa2bc069f',
    '03d4c4fd81b89fa5b4db70ad14e0ef20',
    '5b1e694fce4244385b4154dfa8db100c',
    'e842ea94c3af4990b50a9fee4cff9fe2' ] };

let vidora, capi, capiQueries;

describe('Vidora integration: similarities V2', () => {
    beforeEach((done) => {
        capi = nock(`${conf.capiV2CDN}`)
                .log(console.log)
                .get(/content\/v2\/.*\/?api_key=.*/)
                .times(5)
                .reply(200, (uri, requestBody) => {
                    capiQueries.push(uri);
                    return { fakeArticle: uri };
                });

        capiQueries = [];
        done();
    });

    afterEach((done) => {
        nock.cleanAll();
        done();
    });

    describe('Vidora 200', () => {
        it('with a valid userId and itemId', (done) => {
            vidora = nock(`${conf.vidoraAPI}`)
                        .log(console.log)
                        .get(`/v1/users/${userId}/items/${itemId}/similars?api_key=${conf.vidoraApiKey}`)
                        .reply(200, (uri, requestBody) => {
                            return vidoraData;
                        });

            request(app)
                .get(`/${userId}/items/${itemId}/similars?t_product=HeraldSun&t_output=json`)
                .end(function(err, res) {
                    expect(vidora.isDone()).to.be.true;
                    expect(capi.isDone()).to.be.true;
                    done(err);
                });
        });

        it('with query param', (done) => {
            vidora = nock(`${conf.vidoraAPI}`)
                        .log(console.log)
                        .get(`/v1/users/${userId}/items/${itemId}/similars?api_key=${conf.vidoraApiKey}&category=entertainment`)
                        .reply(200, (uri, requestBody) => {
                            return vidoraData;
                        });

            request(app)
                .get(`/${userId}/items/${itemId}/similars?category=entertainment&t_product=HeraldSun&t_output=json`)
                .end(function(err, res) {
                    expect(vidora.isDone()).to.be.true;
                    expect(capi.isDone()).to.be.true;
                    done(err);
                });
        });
    });

    it('loads the Vidora API key by product', (done) => {
        vidora = nock(`${conf.vidoraAPI}`)
                    .log(console.log)
                    .get(`/v1/users/${userId}/items/${itemId}/similars?api_key=${conf.products.AdelaideNow.vidoraApiKey}`)
                    .reply(200, (uri, requestBody) => {
                        return vidoraData;
                    });

        request(app)
            .get(`/${userId}/items/${itemId}/similars?t_product=AdelaideNow&td_device=desktop&t_output=json`)
            .end(function(err, res) {
                if (err) {
                    return done(err);
                }

                expect(vidora.isDone()).to.be.true;
                done();
            });
    });

    describe('Error conditions', () => {
        beforeEach((done) => {
            vidora = nock(`${conf.vidoraAPI}`)
                        .log(console.log)
                        .get(`/v1/users/${userId}/recommendations/?api_key=${conf.vidoraApiKey}`)
                        .reply(500);

            done();
        });

        it('respond with a 404 if the itemId is missing', (done) => {
            request(app)
            .get(`/${userId}/items/similars?t_product=HeraldSun&td_device=desktop&t_output=json`)
            .end(function(err, res) {
                expect(res.status).to.equal(404);
                done();
            });
        });

        it('handles vidora failure gracefully', (done) => {
            request(app)
                .get('/${ userId }/items/${ itemId }/similars?t_product=AdelaideNow&td_device=desktop&t_output=json')
                .end(function(err, res) {
                    expect(res.status).to.equal(500);
                    done();
                });
        });
    });
});
