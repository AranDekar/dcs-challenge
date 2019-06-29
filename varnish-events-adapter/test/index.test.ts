import * as mocha from 'mocha';
import * as supertest from 'supertest';
import * as superagent from 'superagent';
import * as Redis from 'ioredis';
import { listen } from '../src/adapter';

const request = supertest('http://varnish:80');

describe('redis subscription event', () => {
    before((done) => {
        setTimeout(() => {
            superagent('BAN', 'http://varnish/')
                .set('X-Cache-Tags', '.')
                .end(() => { request.get('/cat.jpg').end(done) });
        }, 2000);
    });
  
    it('invalidates matching X-Cache-Tags in varnish', (done) => {
        const message = JSON.stringify({
            source: 'CAPI',
            sourceId: 'ABC'
        });

        const channel = 'test';

        request
            .get('/cat.jpg')
            .expect(200)
            .expect('X-Cache', 'HIT')
            .expect('X-Cache-Hits', '1')
            .expect('X-Cache-Tags', '123 456 C:ABC')
            .end((err, res) => {
                if (err) return done(err);

                listen('redis', channel, 'varnish');
                
                Redis('redis')
                    .publish(channel, message, () => {
                        setTimeout(() => {
                            request
                                .get('/cat.jpg')
                                .expect(200)
                                .expect('X-Cache', 'MISS')
                                .expect('X-Cache-Hits', '0')
                                .expect('X-Cache-Tags', '123 456 C:ABC')
                                .end((err, res) => {
                                    if (err) return done(err);
                                    done();
                                });
                        }, 2000);
                });
            });
    });
});
