import { invalidateCapi } from '../../../../../../src/cache/strategies/capi/v2/invalidate';

// import CacheTypes
import { Collection } from '../../../../../../src/cache/strategies/capi/v2/collection';
import { Search } from '../../../../../../src/cache/strategies/capi/v2/search';

// utils
import { redis } from './../../../../../../src/lib/redis';
import { toJsonApiResponse } from '../../../../../utils';
import { expect } from 'chai';

// fixture data
import { omnitureCollection as collectionResponse } from '../../../../../fixtures/capi/v2/omnitureCollection';
import { search as searchResponse } from '../../../../../fixtures/capi/v2/search1';

const collectionResponseJson = toJsonApiResponse(collectionResponse);
const searchResponseJson = toJsonApiResponse(searchResponse);

describe('#invalidate', () => {
    afterEach((done) => {
        redis.flushdb(done);
    });

    it('Collections', (done) => {
        const collectionBody = JSON.parse(collectionResponse.body);
        const collectionId = collectionBody.content.id.value;

        Collection.write(collectionResponseJson, (err: Error, result: any) => {
            expect(err).to.be.null;

            invalidateCapi(collectionId, (err: Error, result: any) => {
                setTimeout(() => {
                    redis.keys('*', (err: Error, result: string[]) => {
                        expect(result.length).to.equal(0);
                        done(err);
                    });
                }, 50);
            });
        });
    });

    it('Search results', (done) => {
        const searchResponseBody = JSON.parse(searchResponse.body);
        const searchResults = searchResponseBody.results;

        Search.write(searchResponseJson, (err, result) => {
            expect(err).to.be.null;

            const resultId = searchResults[0].id.value;

            invalidateCapi(resultId, (err: Error, result: any) => {
                setTimeout(() => {
                    redis.keys('*', (err: Error, result: string[]) => {
                        expect(result.length).to.equal(0);
                        done(err);
                    });
                }, 50);
            });
        });
    });
});
