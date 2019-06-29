const express = require('express'),
    expect = require('chai').expect,
    request = require('supertest'),
    middleware = require('../../../../../../lib/middleware'),
    author = require('../../../../../../transformers/1.0/components/author').middleware,
    nock = require('nock'),
    fs = require('fs'),
    path = require('path');

const app = express();

app.get('/component/author/:id', middleware.responseLocals, middleware.requestInitialiser, middleware.product, middleware.queryProcessor, author);

describe('/component/author/', function() {
    afterEach(() => {
        nock.cleanAll();
    });

    it('resource', (done) => {
        const capi = nock(/tabula/)
            .log(console.log)
            .get(/author\/v1\/169f6e6f2377002466c5c2ffd2674246/)
            .reply(200, () => {
                return { foo: 'bar' };
            });

        const s3 = nock(/resources.newscdn.com.au/)
            .log(console.log)
            .get(/austemp/)
            .reply(200, (a, b) => {
                return { template: 'function template(e){ return e.data; }' };
            });

        request(app)
            .get('/component/author/169f6e6f2377002466c5c2ffd2674246/?esi=true&t_product=the-australian&t_template=s3/austemp-article_common/vertical/author/widget&td_bio=false&td_bylinetitle=Associate%20editor')
            .end(function(err, res) {
                expect(capi.isDone()).to.be.true;
                expect(s3.isDone()).to.be.true;
                expect(res.statusCode).to.eq(200);
                expect(res.text).to.eq('{"foo":"bar"}');
                done(err);
            });
    });
});
