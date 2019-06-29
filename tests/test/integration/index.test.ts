import { expect } from 'chai';
import * as supertest from 'supertest';
import { redis, size } from '../lib/redis';
import * as sqs from '../lib/sqs';
import * as lambda from '../lib/capi-events-adapter';

describe.skip('tabula', () => {
    const request = supertest('http://localhost:3001');

    describe('healthcheck', () => {
        it('GET /healthcheck', (done) => {
            request
                .get('/healthcheck')
                .expect(200)
                .end(done);
        });
    });

    describe('proxy', () => {
        describe('capi', () => {
            it('GET /http://api.newsapi.com.au/...', (done) => {
                request
                    .get('/http://mock-server/content/v2/15e1847a075d7d293062d302da150668')
                    .expect(200)
                    .end(done);
            });
        });

        describe('foxsports', () => {
            it('GET /http://api.stats.foxsports.com.au/...', (done) => {
                request
                    .get('/http://mock-server/3.0/api/sports/afl/series/1/seasons/121/fixturesandresults.json')
                    .expect(200)
                    .end(done);
            });
        });
    });
});

describe.skip('capi-events-adapter', () => {
    describe('transform', () => {
        const awsAccessKeyId = 'id',
            capiId = '1226696902608',
            body = `{ "capiId" : "${capiId}", "status" : "DELETED" }`,
            queueName = 'test-queue',
            queueUrl = sqs.getUrl(queueName);

        it('removes keys from cache', (done) => {
            const key = `capi-article-http://mock-server/content/v2/${capiId}`;
            redis.set(key, '...', () => {
                sqs.createQueue(queueName, awsAccessKeyId, () => {
                    sqs.createMessage(queueName, body, awsAccessKeyId, () => {
                        size((before) => {
                            lambda.invoke(() => {
                                setTimeout(() => {
                                    redis.get(key, (err, result) => {
                                        expect(result).to.eq(undefined);
                                        done();
                                    });
                                }, 500);
                            });
                        });
                    });
                });
            });
        }).timeout(1000);
    });
});
