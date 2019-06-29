const express = require('express'),
    expect = require('chai').expect,
    request = require('supertest'),
    middleware = require('../../../../../../../lib/middleware'),
    collection = require('../../../../../../../transformers/1.0/capi/v1/collection').middleware,
    nock = require('nock'),
    fs = require('fs'),
    path = require('path');

for (const route of ['/news/content/v1/collection/e5e3091cb2ad35e4a18ceee85eddf73d', '/collection/e5e3091cb2ad35e4a18ceee85eddf73d']) {
    describe(route, function() {
        afterEach((done) => {
            nock.cleanAll();
            done();
        });

        it('resource', (done) => {
            const app = express();
            app.get(route, middleware.responseLocals, middleware.requestInitialiser, middleware.product, middleware.queryProcessor, collection);

            const capi = nock(/tabula/)
                .log(console.log)
                .get(/content\/v1\//)
                .reply(200, () => {
                    return { foo: 'bar', results: [] };
                });

            const s3 = nock(/resources.newscdn.com.au/)
                .log(console.log)
                .get(/ncatemp/)
                .reply(200, (a, b) => {
                    return { template: 'function template(e){ return e.data; }' };
                });

            request(app)
                .get(route + '?t_product=AdelaideNow&pageSize=6&domain=adelaidenow.com.au&t_template=imageblock&td_imagewidth=650')
                .end(function(err, res) {
                    expect(capi.isDone()).to.be.true;
                    expect(res.statusCode).to.eq(200);
                    expect(res.text).to.eq(`<div class="module "><div class="module-content"></div></div>\n<img class="tcog-pixel" src="https://i1.wp.com/pixel.tcog.cp1.news.com.au/track${route}?t_product=AdelaideNow&pageSize=6&domain=adelaidenow.com.au&t_template=imageblock&td_imagewidth=650" style="opacity:0; height:0px; width:0px; position:absolute;" width="0" height="0" />\n`);
                    done(err);
                });
        });
    });
}
