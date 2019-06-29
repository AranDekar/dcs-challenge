const express = require('express'),
    expect = require('chai').expect,
    request = require('supertest'),
    middleware = require('../../../../../../../lib/middleware'),
    v2 = require('../../../../../../../transformers/1.0/capi/v2/').middleware,
    nock = require('nock');

const app = express();

app.get('/news/content/v2/(*)', middleware.responseLocals, middleware.requestInitialiser, middleware.product, middleware.queryProcessor, v2);

describe('/news/content/v2', function() {
    afterEach(() => {
        nock.cleanAll();
    });

    it('collection', (done) => {
        const capi = nock(/tabula/)
            .log(console.log)
            .get(/v2\/\?/)
            .reply(200, () => {
                return { foo: 'bar' };
            });

        const s3 = nock(/resources.newscdn.com.au/)
            .log(console.log)
            .get(/ncatemp/)
            .reply(200, (a, b) => {
                return { template: 'function template(e){ return e.data; }' };
            });

        request(app)
            .get('/news/content/v2/?t_product=newscomau&t_domain=news.com.au&esi=true&td_part=bottom&td_device=desktop&td_section=military&t_template=s3/ncatemp/index@promo')
            .end(function(err, res) {
                expect(capi.isDone()).to.be.true;
                expect(s3.isDone()).to.be.true;
                expect(res.statusCode).to.eq(200);
                expect(res.text).to.eq('{"foo":"bar"}');
                done(err);
            });
    });

    it('resource', (done) => {
        const capi = nock(/tabula/)
            .log(console.log)
            .get('/http://cdn.newsapi.com.au/content/v2/2395dd15647c6bafab01d6c42c8ceabe?api_key=5u77xavpr4hfq2ncjkgc4wz5')
            .reply(200, () => {
                return { foo: 'bar' };
            });

        const s3 = nock(/resources.newscdn.com.au/)
            .log(console.log)
            .get(/index.json/)
            .reply(200, (a, b) => {
                return { template: 'function template(e){ return e.data; }' };
            });

        request(app)
            .get('/news/content/v2/2395dd15647c6bafab01d6c42c8ceabe?t_product=DailyTelegraph&t_template=s3/chronicle-tg_tlc_promo/index&td_loadTlcCss=true&td_device=desktop&td_clientDebug=false')
            .end(function(err, res) {
                expect(capi.isDone()).to.be.true;
                expect(s3.isDone()).to.be.true;
                expect(res.statusCode).to.eq(200);
                expect(res.text).to.eq('{"foo":"bar"}');
                done(err);
            });
    });
});
