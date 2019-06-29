import invalidate from './../../../../../src/cache/strategies/resource/invalidate';
import { Resource } from '../../../../../src/cache/strategies/resource';
import { read } from './../../../../../src/cache/read';
import { redis } from './../../../../../src/lib/redis';
import { clone, filter } from 'ramda';
import { expect } from 'chai';

const resp: Tabula.JsonApiResponse = {
    body: '{ \"msg\": \"an object\"}',
    url: 'http://random.json.api?b=2&a=1',
    headers: { 'content-type': 'application/json' },
    status: 200,
    jsonBody: { msg: 'an object' }
};

describe('#invalidate', () => {
    beforeEach((done) => {
        Resource.write(resp, done);
    });

    afterEach((done) => {
        redis.flushdb(done);
    });

    it('removes the cached resource', (done) => {
        invalidate(resp.url, (err) => {
            expect(err).to.not.be.ok;
            redis.keys('*', (err: Error, result: string[]) => {
                expect(err).to.be.null;
                expect(result.length).to.equal(0);
                done();
            });
        });
    });
});
