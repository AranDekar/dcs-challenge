const express = require('express'),
    expect = require('chai').expect,
    request = require('supertest'),
    middleware = require('../../../../../../../lib/middleware'),
    search = require('../../../../../../../transformers/1.0/capi/v1/search').middleware,
    nock = require('nock'),
    fs = require('fs'),
    path = require('path');

for (const route of ['/search', '/news/content/v1']) {
    describe(route, function() {
        afterEach((done) => {
            nock.cleanAll();
            done();
        });

        it('collection', (done) => {
            const app = express();
            app.get(route, middleware.responseLocals, middleware.requestInitialiser, middleware.product, middleware.queryProcessor, search);

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
                .get(route + '?category=/section/theaustralian.com.au/collection/popular-content/business/24hours/&format=module&t_product=the-australian&maxRelated=3&t_template=s3/ncatemp/index@test&origin=omniture&domain=theaustralian.com.au')
                .end(function(err, res) {
                    expect(capi.isDone()).to.be.true;
                    expect(res.statusCode).to.eq(200);
                    expect(res.text).to.eq('{"foo":"bar","results":[]}');
                    done(err);
                });
        });
    });
}
