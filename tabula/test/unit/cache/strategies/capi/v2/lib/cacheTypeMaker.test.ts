import { maker } from '../../../../../../../src/cache/strategies/capi/v2/lib/cacheTypeMaker';
import { newsStory as fixture } from '../../../../../../fixtures/capi/v2/newsStory1';
import { read } from '../../../../../../../src/cache/read';
import { redis } from '../../../../../../../src/lib/redis';
import { clone, filter } from 'ramda';
import { expect } from 'chai';
import { toJsonApiResponse } from '../../../../../../utils';

const fixtureBody = JSON.parse(fixture.body);
const fixtureId = fixtureBody.id.value;
const newsStoryJson = toJsonApiResponse(fixture);

describe('#maker generates a CacheType for a CAPI v2 resource', () => {
    let capiV2ResourceType: Tabula.CacheType;

    beforeEach(() => {
        capiV2ResourceType = maker('C');
    });

    describe('#identify', () => {
        it('matches the body.contentType, given the correct CAPI resource', () => {
            expect(capiV2ResourceType.identify(newsStoryJson)).to.be.true;
        });
    });

    describe('#xCacheTagHeaders', () => {
        it('use the supplied prefix to generate the appropriate value for X-Cache-Tags', () => {
            const xCacheTagHeadersValue = capiV2ResourceType.xCacheTagHeaders(newsStoryJson);
            expect(xCacheTagHeadersValue).to.equal(`C:${ fixtureId }`);
        });
    });

    describe('#write', () => {
        beforeEach((done) => {
            capiV2ResourceType.write(newsStoryJson, done);

        afterEach((done) => {
            redis.flushdb(done);
        });

        it('stores the apiResponse successfully', (done) => {
            read(newsStoryJson.url, (err, result: string) => {
                expect(err).to.be.null;
                const cacheItem = JSON.parse(result);
                const comparison = clone(newsStoryJson);
                delete comparison.jsonBody;
                delete comparison.url;
                expect(comparison).to.deep.equal(cacheItem);

                done();
            });
        });

        it('with the correct X-Cache-Tags', (done) => {
            read(newsStoryJson.url, (err, result: string) => {
                expect(err).to.be.null;
                const cacheItem = JSON.parse(result);
                expect(cacheItem.headers['X-Cache-Tags']).to.equal(`C:${ fixtureId }`);

                done();
                });
            });
        });
    });
});
