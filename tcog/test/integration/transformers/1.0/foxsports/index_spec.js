const express = require('express'),
    expect = require('chai').expect,
    request = require('supertest'),
    middleware = require('../../../../../lib/middleware'),
    foxsports = require('../../../../../transformers/1.0/foxsports').middleware,
    nock = require('nock'),
    fs = require('fs'),
    path = require('path');

const text = `{"foo":"bar"}`;
const app = express();

app.get('/foxsports/(*)', middleware.responseLocals, middleware.requestInitialiser, middleware.product, middleware.queryProcessor, foxsports);

describe('/foxsports', function() {
    afterEach(() => {
        nock.cleanAll();
    });

    it('resource', (done) => {
        const capi = nock(/api.stats.foxsports.com.au/)
            .log(console.log)
            .get(/fixturesandresults.json/)
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
            .get('/foxsports/3.0/api/sports/afl/series/1/seasons/121/fixturesandresults.json?t_product=DailyTelegraph&t_template=s3/chronicle-tg_tlc_scoreboard/index&td_layout=fixturesandresults&td_limit=2')
            .end(function(err, res) {
                expect(res.statusCode).to.eq(200);
                expect(res.text).to.eq(text);
                done(err);
            });
    });
});
