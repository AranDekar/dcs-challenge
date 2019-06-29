import { expect } from 'chai';
import * as supertest from 'supertest';
import * as express from 'express';
import { toJsonApiResponse } from '../../utils';
import { redis } from './../../../src/lib/redis';
import { middleware } from './../../../src/middleware/cacheReader';
import { newsStory } from './../../fixtures/capi/v2/newsStory1';
import { write } from '../../../src/cache/write';
import { clone } from 'ramda';

const server = express();

server.use(middleware());

const request = supertest(server);

const newsStoryBody = JSON.parse(newsStory.body);
const newsStoryId = newsStoryBody.id.value;

const jsonApiResponse = toJsonApiResponse(newsStory);

describe('cacheReader middleware', () => {
    after((done) => {
        redis.flushdb(done);
    });

    describe('cache hit', () => {
        it('GET /http://cdn.newsapi.com.au/content/v2/9155b97f7c44c2cffc222113d00df0fd?api_key=rfh8ceqd6keytvasasnxtaa4', (done) => {
            write(jsonApiResponse, (err, result) => {
                request
                    .get(`/${ newsStory.url }`)
                    .expect('Content-Type', /json/)
                    .expect(410)
                    .end((err, resp) => {
                        // .expect('Content-Length', newsStory.body.length.toString())
                        expect(resp.body).to.deep.equal(newsStoryBody);
                        done();
                    });
            });
        });

        describe('cache miss', () => {
            it('GET /http://example.com/not-in-cache?foo=bar', (done) => {
                request
                    .get('/http://example.com/not-in-cache?foo=bar')
                    .expect(404, done);
            });
        });
    });
});

