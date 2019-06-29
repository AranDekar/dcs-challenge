import { redis } from '../../../../../src/lib/redis';
import { non200s } from '../../../../../src/cache/strategies/non200s';
import { clone, find } from 'ramda';
import { read } from '../../../../../src/cache/read';
import { expect } from 'chai';

const _200Response: Tabula.JsonApiResponse = {
    body: '{ \"msg\": \"an object\"}',
    url: 'http://random.json.api?b=2&a=1',
    headers: { 'content-type': 'application/json' },
    status: 200,
    jsonBody: { msg: 'an object' }
};

const non200Response: Tabula.JsonApiResponse = {
    body: '{ \"msg\": \"an object\"}',
    url: 'http://random.json.api?b=2&a=1',
    headers: { 'content-type': 'application/json' },
    status: 400,
    jsonBody: { msg: 'an object' }
};

const _400CacheType = non200s[0];

const match = (jsonApiResponse: Tabula.JsonApiResponse): boolean => {
    const matcher = (cacheType: Tabula.CacheType): boolean => {
        return cacheType.identify(jsonApiResponse);
    };

    const result = find(matcher, non200s);

    if (!result) {
        return false;
    }

    return true;
};

describe('non200s', () => {
    describe('#identify', () => {
        it('returns false for all cachedErrors for 200', () => {
            const result = match(_200Response);
            expect(result).to.be.false;
        });

        it('returns a CacheType for 400', () => {
            const result = match(non200Response);
            expect(result).to.be.true;
        });

    });

    describe('#xCacheTagHeaders', () => {
        it('returns an empty result', () => {
            const _400CacheType = non200s[0];
            const result = _400CacheType.xCacheTagHeaders(non200Response);

            expect(result).to.equal('');
        });
    });

    describe('#write', () => {
        beforeEach(done => {
            _400CacheType.write(non200Response, done);
        });

        afterEach(done => {
            redis.flushdb(done);
        });

        it('a non 200 API response', done => {
            read(non200Response.url, (err, result: string) => {
                expect(err).to.be.null;
                const cacheItem = JSON.parse(result);
                const comparison = clone(non200Response);
                expect(comparison).to.deep.equal(cacheItem);

                done();
            });
        });
    });
});
