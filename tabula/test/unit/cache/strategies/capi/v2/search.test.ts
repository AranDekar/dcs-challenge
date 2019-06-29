import { Search } from '../../../../../../src/cache/strategies/capi/v2/search';
import { search as fixture } from '../../../../../fixtures/capi/v2/search1';
import { omnitureCollection as nonSearch } from '../../../../../fixtures/capi/v2/omnitureCollection';
import { read } from './../../../../../../src/cache/read';
import { redis } from './../../../../../../src/lib/redis';
import { clone, filter } from 'ramda';
import { expect } from 'chai';
import { toJsonApiResponse } from '../../../../../utils';

const fixtureBody = JSON.parse(fixture.body);
const fixtureResults = fixtureBody.results;

const searchJson = toJsonApiResponse(fixture);
const nonSearchJson = toJsonApiResponse(nonSearch);

describe('#identify', () => {
    it('a search', () => {
        expect(Search.identify(searchJson)).to.be.true;
    });

    it('a non-collection', () => {
        expect(Search.identify(nonSearchJson)).to.be.false;
    });
});

describe('#xCacheTagHeaders', () => {
    it('generate the appropriate value for X-Cache-Tags', () => {
        const xCacheTagHeadersValue = Search.xCacheTagHeaders(searchJson);
        const ids = fixtureResults.map((result: { id: { value: string } }) => {
            return `C:${ result.id.value }`;
        });

        expect(xCacheTagHeadersValue).to.equal(ids.join(' '));
    });
});

describe('#write', () => {
    afterEach((done) => {
        redis.flushdb(done);
    });

    it('a search', (done) => {
        Search.write(searchJson, (err, result) => {
            expect(err).to.be.null;
            read(searchJson.url, (err, result: string) => {
                expect(err).to.not.be.ok;
                const cacheItem = JSON.parse(result);

                const comparison = clone(searchJson);

                expect(comparison).to.deep.equal(cacheItem);

                done();
            });
        });
    });

    it('the search\'s references for future invalidation', (done) => {
        const refs = clone(fixtureResults);

        Search.write(searchJson, (err, result) => {
            redis.scan(0, 'MATCH', `sref-${ fixture.url }*`, 'count', 50, (err: Error, results: any) => {
                const srefs = results[1];
                expect(srefs.length).to.equal(fixtureResults.length);

                srefs.forEach((refKey: string) => {
                    expect(refKey).to.include(`sref-${ fixture.url }-`);
                    const referenceId = refKey.split(`sref-${ fixture.url }-`)[1];

                    const referenceMapsOnceToKeys = (reference: { id: { value: string } }) => {
                        return reference.id.value == referenceId;
                    };

                    const occurences = filter(referenceMapsOnceToKeys, fixtureResults);

                    expect(occurences.length).to.equal(1);
                });

                done();
            });
        });
    });
});
