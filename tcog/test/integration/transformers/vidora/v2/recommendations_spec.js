'use strict';

const express = require('express'),
    request = require('supertest'),
    generateRecommendations = require('../../../../../transformers/vidora/v2/recommendations'),
    middleware = require('../../../../../lib/middleware'),
    nock = require('nock'),
    expect = require('chai').expect,
    conf = require('../../../../../conf'),
    userId = '123';

const app = express();

app.get('/:user_id', middleware.requestInitialiser, generateRecommendations());

const vidoraData = {
    items: [
        {'id': '4f1cb432c42ee68b741df246dff74283'},
        {'id': 'fe38f8bc6dc147bd5b02c3968e4bef68'},
        {'id': 'e2f7dd83cdc417b1cc6586ddcee60942'},
        {'id': 'ac240ec8aeb909eaa126a18d94b3b7dd'},
        {'id': 'a7f9e074e4d12e670e9904148050a0b5'},
        {'id': 'a6dc5f71b3e95ac796cc029e855c99f5'},
        {'id': 'e46dafd18c2ceef24e4317b8b6add50b'},
        {'id': '0e0d0d94058706b005b086301c00cd99'},
        {'id': '781b1fd19f35616acab53d38e9b90c5b'},
        {'id': '3930a3ea729dcc123d50359fd9365aa7'}]
};

let vidora, capi, capiQueries;

describe('Vidora integration: recommendations V2', () => {
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
        it('with a valid nk', (done) => {
            vidora = nock(`${conf.vidoraAPI}`)
                        .log(console.log)
                        .get(`/v1/users/${userId}/recommendations/?api_key=${conf.vidoraApiKey}`)
                        .reply(200, (uri, requestBody) => {
                            return vidoraData;
                        });

            request(app)
            .get('/123?t_product=HeraldSun&td_device=desktop&t_output=json')
            .end((err) => {
                expect(vidora.isDone()).to.be.true;
                expect(capi.isDone()).to.be.true;
                done(err);
            });
        });

        it('with query param', (done) => {
            vidora = nock(`${conf.vidoraAPI}`)
                        .log(console.log)
                        .get(`/v1/users/${userId}/recommendations/?api_key=${conf.vidoraApiKey}&payment_type=subscription`)
                        .reply(200, (uri, requestBody) => {
                            return vidoraData;
                        });

            request(app)
            .get('/123?payment_type=subscription&t_product=HeraldSun&td_device=desktop&t_output=json')
            .end((err) => {
                expect(vidora.isDone()).to.be.true;
                expect(capi.isDone()).to.be.true;
                done(err);
            });
        });

        it('uses the first 5 articles recommended', (done) => {
            vidora = nock(`${conf.vidoraAPI}`)
                        .log(console.log)
                        .get(`/v1/users/${userId}/recommendations/?api_key=${conf.vidoraApiKey}`)
                        .reply(200, (uri, requestBody) => {
                            return vidoraData;
                        });

            request(app)
            .get('/123?t_product=HeraldSun&td_device=desktop&t_output=json')
            .end((err) => {
                expect(capiQueries.length).to.equal(5);
                done(err);
            });
        });

        it('makes a Vidora call with category', (done) => {
            const category = 'ME%20All%20Local%20News%20and%20Photos';

            vidora = nock(`${conf.vidoraAPI}`)
                        .log(console.log)
                        .get(`/v1/users/${userId}/recommendations/?api_key=${conf.vidoraApiKey}&category=${category}`)
                        .reply(200, (uri, requestBody) => {
                            return vidoraData;
                        });

            request(app)
                .get(`/123?t_product=HeraldSun&td_device=desktop&t_output=json&category=${category}`)
                .end((err) => {
                    if (err) {
                        return done(err);
                    }

                    expect(vidora.isDone()).to.be.true;
                    done();
                });
        });

        it('loads the Vidora API key by product', (done) => {
            vidora = nock(`${conf.vidoraAPI}`)
                        .log(console.log)
                        .get(`/v1/users/${userId}/recommendations/?api_key=${conf.products.AdelaideNow.vidoraApiKey}`)
                        .reply(200, (uri, requestBody) => {
                            return vidoraData;
                        });

            request(app)
                .get(`/123?t_product=AdelaideNow&td_device=desktop&t_output=json`)
                .end((err) => {
                    if (err) {
                        return done(err);
                    }

                    expect(vidora.isDone()).to.be.true;
                    done();
                });
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

        it('respond with a 404 if the nk is missing', (done) => {
            request(app)
            .get('/?t_product=HeraldSun&td_device=desktop&t_output=json')
            .end((err, res) => {
                expect(res.status).to.equal(404);
                done();
            });
        });

        it('handles vidora failure gracefully', (done) => {
            request(app)
                .get('/123/?t_product=HeraldSun&td_device=desktop&t_output=json')
                .end((err, res) => {
                    expect(res.status).to.equal(500);
                    done();
                });
        });
    });
});
