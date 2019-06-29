import { redis } from '../../../../../src/lib/redis';
import { Resource } from '../../../../../src/cache/strategies/resource';
import { clone, filter } from 'ramda';
import { expect } from 'chai';
import { read } from '../../../../../src/cache/read';

const resp: Tabula.JsonApiResponse = {
    body: '{ \"msg\": \"an object\"}',
    url: 'http://random.json.api?b=2&a=1',
    headers: { 'content-type': 'application/json' },
    status: 200,
    jsonBody: { msg: 'an object' }
};

describe('#identify', () => {
    it('matches *any* JSON friendly structure', () => {
        expect(Resource.identify(<Tabula.JsonApiResponse>resp)).to.be.true;
    });

    it('fails to match non JSON structures', () => {
        const resp: Tabula.ApiResponse = {
            body: '<b>a html doc</b>',
            url: 'http://random.json.api',
            headers: { 'content-type': 'text/html' },
            status: 200
        };

        expect(Resource.identify(<Tabula.JsonApiResponse>resp)).to.be.false;
    });
});

describe('#write', () => {
    beforeEach((done) => {
        Resource.write(resp, done);
    });

    afterEach((done) => {
        redis.flushdb(done);
    });

    it('stores the jsonApiResponse successfully', (done) => {
        read(resp.url, (err, result: string) => {
            expect(err).to.be.null;
            const cacheItem = JSON.parse(result);
            const comparison = clone(resp);
            expect(comparison).to.deep.equal(cacheItem);

            done();
        });
    });
});
