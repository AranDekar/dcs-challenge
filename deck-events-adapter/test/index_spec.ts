import * as express from 'express';
import * as Redis from 'ioredis';
import * as supertest from 'supertest';
import publisher from '../src/redis';
import router from '../src/router';

const server = express(),
    request = supertest(server),
    subscriber = Redis(process.env.REDIS_PUB_SUB_HOST || 'localhost');

server.use('/deck', router);

describe('deck events adapter', () => {
    describe('POST /deck/:id', () => {
        it('publish to redis', (done) => {
            subscriber.on('message', (channel: string, message: string) => {
                done();

                publisher.disconnect();
                subscriber.disconnect();
            });

            subscriber.subscribe('content', (err: any, count: any) => {
                request.post('/deck/123')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                    });
            });
        });

        it('returns errors', (done) => {
            request.post('/deck/123')
                .expect(500, '{"status":"Connection is closed."}')
                .end((err, res) => {
                    done(err);
                });
        });
    });
});
