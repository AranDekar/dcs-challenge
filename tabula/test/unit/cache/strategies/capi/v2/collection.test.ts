import { Collection } from '../../../../../../src/cache/strategies/capi/v2/collection';
import { omnitureCollection } from '../../../../../fixtures/capi/v2/omnitureCollection';
import { capiCollection } from '../../../../../fixtures/capi/v2/capiCollection';
import { newsStory as nonCollection } from '../../../../../fixtures/capi/v2/newsStory1';
import { read } from './../../../../../../src/cache/read';
import { redis } from './../../../../../../src/lib/redis';
import { toJsonApiResponse } from '../../../../../utils';
import { clone, filter } from 'ramda';
import { expect } from 'chai';

const fixtureBody = JSON.parse(omnitureCollection.body);
const fixtureId = fixtureBody.content.id.value;
const fixtureReferences = fixtureBody.content.references;

const omnitureCollectionJson = toJsonApiResponse(omnitureCollection);
const nonCollectionJson = toJsonApiResponse(nonCollection);
const capiCollectionJson = toJsonApiResponse(capiCollection);


describe('#identify', () => {
    it('a collection', () => {
        expect(Collection.identify(omnitureCollectionJson)).to.be.true;
    });

    it('a non-collection', () => {
        expect(Collection.identify(nonCollectionJson)).to.be.false;
    });
});

describe('#xCacheTagHeaders', () => {
    it('generate the appropriate value for X-Cache-Tags', () => {
        const xCacheTagHeadersValue = Collection.xCacheTagHeaders(omnitureCollectionJson);
        const ids = fixtureReferences.map((reference: { id: { value: string } }) => {
            return `C:${ reference.id.value }`;
        });

        expect(xCacheTagHeadersValue).to.equal(ids.join(' '));
    });
});

describe('#write', () => {
    afterEach((done) => {
        redis.flushdb(done);
    });

    describe('a collection with origin', () => {
        it('omniture', (done) => {
            Collection.write(omnitureCollectionJson, (err, result) => {
                expect(err).to.be.null;
                read(omnitureCollection.url, (err, result: string) => {
                    expect(err).to.be.null;
                    const cacheItem = JSON.parse(result);
                    const comparison = clone(omnitureCollectionJson);
                    expect(comparison).to.deep.equal(cacheItem);

                    done();
                });
            });
        });

        it('content api', (done) => {
            Collection.write(capiCollectionJson, (err, result) => {
                expect(err).to.be.null;
                read(capiCollection.url, (err, result: string) => {
                    expect(err).to.be.null;
                    const cacheItem = JSON.parse(result);
                    const comparison = clone(capiCollectionJson);
                    expect(comparison).to.deep.equal(cacheItem);

                    done();
                });
            });
        });
    });

    it('the collection\'s references for future invalidation', (done) => {
        const refs = clone(fixtureReferences);

        Collection.write(omnitureCollectionJson, (err, result) => {
            redis.scan(0, 'MATCH', `cref-${ omnitureCollection.url }*`, 'count', 50, (err: Error, results: any) => {
                const crefs = results[1];
                expect(crefs.length).to.equal(fixtureReferences.length);

                crefs.forEach((refKey: string) => {
                    expect(refKey).to.include(`cref-${ omnitureCollection.url }-`);
                    const referenceId = refKey.split(`cref-${ omnitureCollection.url }-`)[1];

                    const referenceMapsOnceToKeys = (reference: { id: { value: string } }) => {
                        return reference.id.value == referenceId;
                    };

                    const occurences = filter(referenceMapsOnceToKeys, fixtureReferences);

                    expect(occurences.length).to.equal(1);
                });

                done();
            });
        });
    });
});
