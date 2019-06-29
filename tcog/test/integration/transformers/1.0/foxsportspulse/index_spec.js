const express = require('express'),
    expect = require('chai').expect,
    request = require('supertest'),
    middleware = require('../../../../../lib/middleware'),
    foxsportspulse = require('../../../../../transformers/1.0/foxsportspulse').middleware,
    nock = require('nock'),
    fs = require('fs'),
    path = require('path');

const text = `{"foo":"bar"}`;
const app = express();

app.get('/foxsportspulse/(*)', middleware.responseLocals, middleware.requestInitialiser, middleware.product, middleware.queryProcessor, foxsportspulse);

describe('/foxsportspulse', function() {
    afterEach(() => {
        nock.cleanAll();
    });

    it('resource', (done) => {
        const capi = nock(/awsapi.foxsportspulse.com/)
            .log(console.log)
            .get(/ladders/)
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
            .get('/foxsportspulse/v2/compdata/competitions/312013/ladders?t_product=HeraldSun&t_template=s3/fake/index&td_layout=fixturesandresults&td_limit=2')
            .end(function(err, res) {
                expect(res.statusCode).to.eq(200);
                expect(res.text).to.eq(text);
                done(err);
            });
    });
});
