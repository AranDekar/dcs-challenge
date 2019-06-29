import { expect } from 'chai';
import * as express from 'express';
import * as nock from 'nock';
import * as supertest from 'supertest';
import { parse } from 'url';
import { redis } from '../../../src/lib/redis';
import { initialize } from './../../../src/controllers/agentController';
import { v2Fixtures } from './../../fixtures/capi/v2';
import { v3Fixtures } from './../../fixtures/capi/v3';
import { compareSync } from 'bcrypt-nodejs';

const agentController = initialize();
const service = express().get('/(:protocol(http|https)\:\/\/)?(:url(*+))', agentController);
const request = supertest(service);

describe('AgentController', () => {
    afterEach((done) => {
        nock.cleanAll();
        redis.flushdb(done);
    });

    describe('GET /', () => {
        describe('CAPI', () => {
            // tslint:disable-next-line
            let capi: nock.Scope;

            describe('v3', () => {
                beforeEach((done) => {
                    for (const name of Object.keys(v3Fixtures)) {
                        const fixture = v3Fixtures[name];

                        const url = parse(fixture.url),
                        capi = nock(<string>`http://${url.host}/`)
                            .log(console.log)
                            .get(<string>url.path)
                            .reply(fixture.status, fixture.body);
                    }

                    done();
                });

                describe('a search on collections', () => {
                    it('write to redis', (done) => {
                        const fixture = v3Fixtures.collectionSearch;

                        request
                            .get(`/${ fixture.url }`)
                            .expect(200)
                            .end((err: Error, resp: any) => {
                                if (err) return done(err);
                                redis.keys('*', (err: Error, keys: string[]) => {
                                    expect(keys).to.have.same.members([
                                        'https://content.api.news/v3/collections?api_key=h9qby8sp25f4cvygu9dapbqe&dateUpdatedFrom=2019-04-20T10:00&dateUpdatedTo=2019-04-20T13:00&fetchDraftIfLatest=false&includeArchived=false&showExpired=false&showFutureDated=false&showInactive=false&showKilled=false&sortBy=dateUpdated&sortOrder=ASC',
                                        'sref-https://content.api.news/v3/collections?api_key=h9qby8sp25f4cvygu9dapbqe&dateUpdatedFrom=2019-04-20T10%3A00&dateUpdatedTo=2019-04-20T13%3A00&fetchDraftIfLatest=false&includeArchived=false&showExpired=false&showFutureDated=false&showInactive=false&showKilled=false&sortBy=dateUpdated&sortOrder=ASC-adca5769efa726f0de53f68901f91933',
                                        'sref-https://content.api.news/v3/collections?api_key=h9qby8sp25f4cvygu9dapbqe&dateUpdatedFrom=2019-04-20T10%3A00&dateUpdatedTo=2019-04-20T13%3A00&fetchDraftIfLatest=false&includeArchived=false&showExpired=false&showFutureDated=false&showInactive=false&showKilled=false&sortBy=dateUpdated&sortOrder=ASC-cb5aebdfc1b9627f0aa1133d3fb45bd7',
                                        'sref-https://content.api.news/v3/collections?api_key=h9qby8sp25f4cvygu9dapbqe&dateUpdatedFrom=2019-04-20T10%3A00&dateUpdatedTo=2019-04-20T13%3A00&fetchDraftIfLatest=false&includeArchived=false&showExpired=false&showFutureDated=false&showInactive=false&showKilled=false&sortBy=dateUpdated&sortOrder=ASC-de1c64c0af1003ee45486ef147599c7d'
                                    ]);

                                    done(err);
                                });
                            });
                    });
                });

                describe('article', () => {
                    it('write to redis', (done) => {
                        const fixture = v3Fixtures.article;

                        request
                            .get(`/${ fixture.url }`)
                            .expect(200)
                            .end((err: Error, resp: any) => {
                                if (err) return done(err);

                                redis.keys('*', (err: Error, keys: string[]) => {
                                    expect(keys).to.have.same.members([
                                        'http://content-sit.api.news/v3/articles/839deb2c4c7024630910d4ef57d58f78?api_key=wy745368rhtznnrprnqzp5dt'
                                    ]);

                                    done(err);
                                });
                            });
                    });
                });
            });

            describe('v2', () => {
                beforeEach((done) => {
                    for (const name of Object.keys(v2Fixtures)) {
                        const fixture = v2Fixtures[name];

                        const url = parse(fixture.url),
                        capi = nock(<string>`http://${url.host}/`)
                            .log(console.log)
                            .get(<string>url.path)
                            .reply(fixture.status, fixture.body, fixture.headers);
                    }

                    done();
                });

                describe('collections', () => {
                    describe('omniture', () => {
                        it('write to redis', (done) => {
                            const fixture = v2Fixtures.omnitureCollection;

                            request
                                .get(`/${ fixture.url }`)
                                .expect(200)
                                .end((err: Error, resp: any) => {
                                    if (err) return done(err);

                                    redis.keys('*', (err: Error, keys: string[]) => {
                                        expect(keys).to.have.same.members([
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-05871dcb25361af97cb307faa6cd03a3',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-c9c5837bbfe233a7f53f16d18792746c',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-054046cb7b6f2d266222bea3904ff7ef',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-80c1b7ac7dd80740c9abf5b8b5d43aeb',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-664dc1a9f0420f1e159e237e7e562cee',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-afa3ada0eb653301e3d91ef8133a6d58',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-ff14f94ae1053a08bc15ced44c8c0300',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-e44156f59843ba97bc05562890b9ce1e',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-2600320842a595063e757a299da33595',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-aaa77c6108be4877f6ad42b5baba47e4',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-2df10d4944c3c072bc29e0f08e3e0cff',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-25d1c6453ff10d156be0c234825f38fa',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-c173b6b3ab858cfcee372b7133982328',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-8e7c3ac8c005e371437989bc3b216254',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-3500f2773e916af6a4171c7e7ffdc231',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-e8dfdd518cf1e05ec2d6535cf4b44c34',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-36318d654581a2cb031783f39f6acb40',
                                            'http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-ccafa309d3806c76018644d00c9cdf7c',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-b78d66195d966256dbb10fa4e9286829',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7-c4fbffc7b44fa8abf63f54d3ed56bde1'
                                        ]);

                                        done(err);
                                    });
                                });
                        });
                    });

                    describe('CONTENT_API', () => {
                        it('write to redis', (done) => {
                            const fixture = v2Fixtures.capiCollection;

                            request
                                .get(`/${ fixture.url }`)
                                .expect(200)
                                .end((err: Error, resp: any) => {
                                    if (err) return done(err);

                                    redis.keys('*', (err: Error, keys: string[]) => {
                                        expect(keys).to.have.same.members([
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-05871dcb25361af97cb307faa6cd03a3',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-c9c5837bbfe233a7f53f16d18792746c',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-054046cb7b6f2d266222bea3904ff7ef',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-80c1b7ac7dd80740c9abf5b8b5d43aeb',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-664dc1a9f0420f1e159e237e7e562cee',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-afa3ada0eb653301e3d91ef8133a6d58',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-ff14f94ae1053a08bc15ced44c8c0300',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-e44156f59843ba97bc05562890b9ce1e',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-2600320842a595063e757a299da33595',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-aaa77c6108be4877f6ad42b5baba47e4',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-2df10d4944c3c072bc29e0f08e3e0cff',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-25d1c6453ff10d156be0c234825f38fa',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-c173b6b3ab858cfcee372b7133982328',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-8e7c3ac8c005e371437989bc3b216254',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-3500f2773e916af6a4171c7e7ffdc231',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-e8dfdd518cf1e05ec2d6535cf4b44c34',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-36318d654581a2cb031783f39f6acb40',
                                            'http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-ccafa309d3806c76018644d00c9cdf7c',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-b78d66195d966256dbb10fa4e9286829',
                                            'cref-http://cdn.newsapi.com.au/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c72-c4fbffc7b44fa8abf63f54d3ed56bde1'
                                        ]);

                                        done(err);
                                    });
                                });
                        });
                    });
                });

                describe('news story', () => {
                    it('write to redis', (done) => {
                        const fixture = v2Fixtures.newsStory;

                        request
                            .get(`/${ fixture.url }`)
                            .expect(200)
                            .end((err: Error, resp: any) => {
                                if (err) return done(err);

                                redis.keys('*', (err: Error, keys: string[]) => {
                                    expect(keys).to.have.same.members([
                                        'http://cdn.newsapi.com.au/content/v2/9155b97f7c44c2cffc222113d00df0fd?api_key=rfh8ceqd6keytvasasnxtaa4'
                                    ]);

                                    done(err);
                                });
                            });
                    });
                });
            });
        });

        describe('SPP', () => {
            const url = 'http://theaustralian.com.au/spp-api/v1/pages?spp_api_key=xyz&spp_api_pagename=story/budget-2017';
            let wordpress: nock.Scope;

            beforeEach(() => {
                wordpress = nock('http://theaustralian.com.au:80/spp-api/v1/pages/')
                        .log(console.log)
                        .get('?spp_api_key=xyz&spp_api_pagename=story%2Fbudget-2017')
                        .reply(200, { wordpress: 'data' });
            });

            it('write to redis', (done) => {
                request.get(`/${ url }`)
                    .expect(200)
                    .end((err: Error, resp: any) => {
                        redis.keys('*', (err: Error, keys: string[]) => {
                            expect(keys).to.have.same.members(['http://theaustralian.com.au/spp-api/v1/pages?spp_api_key=xyz&spp_api_pagename=story/budget-2017']);
                            expect(wordpress.isDone()).to.to.be.true;
                            done(err);
                        });
                    });
            });

            it('does not cache if the X-No-Cache tag is present', (done) => {
                request.get(`/${ url }`)
                    .set('X-No-Cache', 'true')
                    .expect(200)
                    .end((err: Error, resp: any) => {
                        redis.keys('*', (err: Error, keys: string[]) => {
                            expect(keys).to.have.same.members([]);
                            expect(wordpress.isDone()).to.to.be.true;
                            done(err);
                        });
                    });
            });

            it('returns HTML from upstream API call', (done) => {
                const mockHtml = `<HTML><HEAD><meta http-equiv=\"content-type\" content=\"text/html;charset=utf-8\">\\n<TITLE>301 Moved</TITLE></HEAD>
                            <BODY>\\n<H1>301 Moved</H1>\\nThe document has moved\\n<A HREF=\"http://www.google.com.au/\">here</A>.\\n</BODY></HTML>`;

                const google = nock('http://google.com')
                            .log(console.log)
                            .get('/')
                            .reply(200, mockHtml);

                request.get('/http://google.com')
                    .expect(200)
                    .end((err: Error, resp: any) => {
                        if (err) return done(err);
                        expect(google.isDone()).to.to.be.true;
                        expect(resp.text).to.equal(mockHtml);
                        done();
                   });
            });
        });
    });
});
