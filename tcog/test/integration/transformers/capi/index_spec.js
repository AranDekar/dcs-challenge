const express = require('express'),
    expect = require('chai').expect,
    request = require('supertest'),
    middleware = require('./../../../../lib/middleware'),
    transformers = require('./../../../../transformers/index'),
    nock = require('nock'),
    fs = require('fs'),
    path = require('path');

const app = express();

app.get('/news/v3/articles/:id', middleware.responseLocals, middleware.queryProcessor, transformers.capi.v3.byId('articles'));
app.get('/news/v3/articles', middleware.responseLocals, middleware.queryProcessor, transformers.capi.v3.bySearch('articles'));

describe('/news/v3/articles', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('transforms', (done) => {
        const fixture = fs.readFileSync(path.resolve(__dirname + /fixtures/, 'articles.json'), 'utf8');

        const capi = nock('https://content-sit.api.news')
            .log(console.log)
            .get(/articles/)
            .reply(200, fixture, { 'X-Cache-Tags': 'C:abc' });

        request(app)
            .get('/news/v3/articles/?t_product=tcog&t_output=json')
            .end(function(err, res) {
                expect(capi.isDone()).to.be.true;
                expect(res.statusCode).to.eq(200);
                expect(res.headers['x-cache-tags']).to.eq('C:abc');
                expect(res.text).to.include('"id":"839deb2c4c7024630910d4ef57d58f78"');
                done(err);
            });
    });
});

describe('/news/v3/articles/:id', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    describe('api_key', () => {
        it('if product capiV3APIKey unavailable defaults to env capiV3APIKey', (done) => {
            const capi = nock('https://content-sit.api.news')
                .log(console.log)
                .get(/v3\/articles\/839deb2c4c7024630910d4ef57d58f78\?api_key=wy745368rhtznnrprnqzp5dt/)
                .reply(200, '{}');

            request(app)
                .get('/news/v3/articles/839deb2c4c7024630910d4ef57d58f78?t_product=tcog&t_output=json')
                .end(function(err, res) {
                    expect(capi.isDone()).to.be.true;
                    expect(res.statusCode).to.eq(200);
                    done();
                });
        });

        it('if available use product capiV3APIKey', (done) => {
            const capi = nock('https://content-sit.api.news')
                .log(console.log)
                .get(/v3\/articles\/839deb2c4c7024630910d4ef57d58f78\?api_key=123/)
                .reply(200, '{}');

            request(app)
                .get('/news/v3/articles/839deb2c4c7024630910d4ef57d58f78?t_product=mock&t_output=json')
                .end(function(err, res) {
                    expect(capi.isDone()).to.be.true;
                    expect(res.statusCode).to.eq(200);
                    done(err);
                });
        });
    });

    it('transforms', (done) => {
        const fixture = require('./fixtures/article.json');

        const capi = nock('https://content-sit.api.news')
            .log(console.log)
            .get(/v3\/articles\/839deb2c4c7024630910d4ef57d58f78\?api_key=wy745368rhtznnrprnqzp5dt/)
            .reply(200, fixture, { 'X-Cache-Tags': 'C:abc' });

        request(app)
            .get('/news/v3/articles/839deb2c4c7024630910d4ef57d58f78?t_product=tcog&t_output=json')
            .end(function(err, res) {
                expect(capi.isDone()).to.be.true;
                expect(res.statusCode).to.eq(200);
                expect(res.headers['x-cache-tags']).to.eq('C:abc');
                expect(res.text).to.include('"id":"839deb2c4c7024630910d4ef57d58f78"');
                done(err);
            });
    });
});
