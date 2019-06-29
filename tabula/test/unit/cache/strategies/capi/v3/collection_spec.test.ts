import collection from '../../../../../../src/cache/strategies/capi/v3/collection';
import { collection as fixture } from '../../../../../fixtures/capi/v3/collection1';
import { collectionSearch as incorrectFixture } from '../../../../../fixtures/capi/v3/collectionSearch1';
import { searchById as incorrectFixture2 } from '../../../../../fixtures/capi/v3/searchByIds';
import { redis } from './../../../../../../src/lib/redis';
import { expect } from 'chai';
import { toJsonApiResponse } from '../../../../../utils';

const collectionJson = toJsonApiResponse(fixture);
const incorrectCollectionJson = toJsonApiResponse(incorrectFixture);
const incorrectCollectionJson2 = toJsonApiResponse(incorrectFixture2);

describe('capi', () => {
    describe('v3', () => {
        describe('collection', () => {
            afterEach((done) => {
                redis.flushdb(done);
            });

            describe('#identify', () => {
                it('returns true', () => {
                    expect(collection.identify(collectionJson)).to.eq(true);
                });

                it('returns false', () => {
                    expect(collection.identify(incorrectCollectionJson)).to.eq(false);
                });

                it('returns false', () => {
                    expect(collection.identify(incorrectCollectionJson2)).to.eq(false);
                });
            });

            describe('#xCacheTagHeaders', () => {
                it('returns value', () => {
                    const value = collection.xCacheTagHeaders(collectionJson);
                    expect(value).to.eq('C:ac0cb0600298f9563353af6ba89ca2d9 C:959041d31fee7648b32b8182641af211 C:6b05498d4f44ccdd5e1a0f0726c39e52 C:955567a9c29878f390b708bed789593f C:dd55c5a5051b53ff167d9c1f82c7fef1 C:2b9730d6dc119e82990024b69c693eee C:77ac2a45a26380279ae529bc948f68ba C:fa680d5d276b3bee413fe99faa7bb67e C:71e44170840853071cc66efb02651aec C:edaab1eae632969298ca0abb11ad7458 C:e63b4d4cbab4e8bc4cba916823ef22c8 C:bf1c7e7447ee65b2414ba87b640575af C:12ea83b8bc6d5edafe3a4e90a4edcaf4 C:c1d576f8668d7118e1698edd26034ae5 C:60c799de832f63f02abf1731ddebebfc');
                });
            });

            describe('#write', () => {
                it('write to redis', (done) => {
                    collection.write(collectionJson, (err, result) => {
                        redis.keys('*', (err: Error, result: string[]) => {
                            expect(result).to.have.same.members([
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-12ea83b8bc6d5edafe3a4e90a4edcaf4',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-fa680d5d276b3bee413fe99faa7bb67e',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-dd55c5a5051b53ff167d9c1f82c7fef1',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-71e44170840853071cc66efb02651aec',
                                'https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-e63b4d4cbab4e8bc4cba916823ef22c8',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-ac0cb0600298f9563353af6ba89ca2d9',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-6b05498d4f44ccdd5e1a0f0726c39e52',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-c1d576f8668d7118e1698edd26034ae5',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-955567a9c29878f390b708bed789593f',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-2b9730d6dc119e82990024b69c693eee',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-edaab1eae632969298ca0abb11ad7458',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-77ac2a45a26380279ae529bc948f68ba',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-60c799de832f63f02abf1731ddebebfc',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-bf1c7e7447ee65b2414ba87b640575af',
                                'cref-https://content.api.news/v3/collections/78b5a4b59f8506ff55a1cc9bdf490de9?api_key=y8dd45puh6w8yuhpdzjpev7w-959041d31fee7648b32b8182641af211'
                            ]);

                            done(err);
                        });
                    });
                });
            });
        });
    });
});
