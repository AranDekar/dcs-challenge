const express = require('express'),
    expect = require('chai').expect,
    request = require('supertest'),
    middleware = require('../../../../../lib/middleware'),
    chartbeat = require('../../../../../transformers/1.0/chartbeat').middleware,
    nock = require('nock'),
    fs = require('fs'),
    path = require('path');

const text = `{"foo":"bar"}`;
const app = express();

app.get('/chartbeat/(*)', middleware.responseLocals, middleware.requestInitialiser, middleware.product, middleware.queryProcessor, chartbeat);

describe('/chartbeat', function() {
    afterEach(() => {
        nock.cleanAll();
    });

    it('resource', (done) => {
        const capi = nock(/api.chartbeat.com/)
            .log(console.log)
            .get(/toppages\/v3\//)
            .reply(200, () => {
                return { foo: 'bar' };
            });

        const s3 = nock(/resources.newscdn.com.au/)
            .log(console.log)
            .get(/trending.json/)
            .reply(200, (a, b) => {
                return { template: 'function template(e){ return e.data; }' };
            });

        request(app)
            .get('/chartbeat/live/toppages/v3/?t_product=WeeklyTimesNow&limit=10&host=weeklytimesnow.com.au&sort_by=social&type=article&t_template=s3/chronicle-tg_tcog_fragments/trending&td_disableCss=true')
            .end(function(err, res) {
                expect(res.statusCode).to.eq(200);
                expect(res.text).to.eq(text);
                done(err);
            });
    });
});
