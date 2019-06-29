import search from '../../../../../../src/cache/strategies/capi/v3/search';
import { emptySearchById as fixture } from '../../../../../fixtures/capi/v3/emptySearchById';
import { searchById as fixture2 } from '../../../../../fixtures/capi/v3/searchByIds';
import { emptySearch as fixture3 } from '../../../../../fixtures/capi/v3/emptySearchByParameters';
import { searchByParameters as fixture4 } from '../../../../../fixtures/capi/v3/searchByParameters';
import { collectionSearch as fixture5 } from '../../../../../fixtures/capi/v3/collectionSearch1';
import { omnitureCollection as incorrectFixture } from '../../../../../fixtures/capi/v2/omnitureCollection';
import { redis } from '../../../../../../src/lib/redis';
import { expect } from 'chai';
import { toJsonApiResponse } from '../../../../../utils';

const emptySearchByIdJson = toJsonApiResponse(fixture);
const searchByIdJson = toJsonApiResponse(fixture2);
const emptySearchByParamsJson = toJsonApiResponse(fixture3);
const searchByParamsJson = toJsonApiResponse(fixture4);
const collectionSearchJson = toJsonApiResponse(fixture5);
const incorrectCollectionJson = toJsonApiResponse(incorrectFixture);

describe('capi', () => {
    describe('v3', () => {
        describe('search', () => {
            afterEach((done) => {
                redis.flushdb(done);
            });

            describe('#identify', () => {
                it('a valid empty search returned by advancedSearchByCapiId endpoint', () => {
                    expect(search.identify(emptySearchByIdJson)).to.eq(true);
                });

                it('a valid search returned by advancedSearchByCapiId endpoint', () => {
                    expect(search.identify(searchByIdJson)).to.eq(true);
                });

                it('a valid empty search returned by advancedSearchByParams endpoint', () => {
                    expect(search.identify(emptySearchByParamsJson)).to.eq(true);
                });

                it('a valid search returned by advancedSearchByParams endpoint', () => {
                    expect(search.identify(searchByParamsJson)).to.eq(true);
                });


                it('a valid search returned by collections endpoint', () => {
                    expect(search.identify(collectionSearchJson)).to.eq(true);
                });

                it('an invalid search', () => {
                    expect(search.identify(incorrectCollectionJson)).to.eq(false);
                });
            });

            describe('#xCacheTagHeaders', () => {
                it('no cache tags stored as its an empty searchById', () => {
                    const value = search.xCacheTagHeaders(emptySearchByIdJson);
                    expect(value).to.be.empty;
                });

                it('validates cache tags for searchById', () => {
                    const value = search.xCacheTagHeaders(searchByIdJson);
                    expect(value).to.eq('C:76ade247ae7095694d39e1156c3ae747');
                });

                it('no cache tags stored as its an empty searchByParams', () => {
                    const value = search.xCacheTagHeaders(emptySearchByParamsJson);
                    expect(value).to.be.empty;
                });

                it('validates cache tags for searchByParams', () => {
                    const value = search.xCacheTagHeaders(searchByParamsJson);
                    expect(value).to.eq('C:3c41d31c13249388db668a52e1578ceb');
                });

                it('validates cache tags for collectionSearch', () => {
                    const value = search.xCacheTagHeaders(collectionSearchJson);
                    expect(value).to.eq('C:cb5aebdfc1b9627f0aa1133d3fb45bd7 C:de1c64c0af1003ee45486ef147599c7d C:adca5769efa726f0de53f68901f91933');
                });
            });

            describe('#write', () => {
                describe('#searchById', () => {
                    it('populates X-Cache-Tag header', (done) => {
                        search.write(searchByIdJson, (err, result) => {
                            redis.get('https://content.api.news/v3/search/id/76ade247ae7095694d39e1156c3ae747?api_key=v3p5jdmqc5e64hg39m2c5efr&fetchDraftIfLatest=false&showFutureDated=false', (err, result) => {
                                expect(JSON.parse(result).headers['X-Cache-Tags']).eq('C:76ade247ae7095694d39e1156c3ae747');
                                done(err);
                            });
                        });
                    });

                    it('write to redis', (done) => {
                        search.write(searchByIdJson, (err, result) => {
                            redis.keys('*', (err: Error, result: string[]) => {
                                expect(result).to.have.same.members([
                                    'https://content.api.news/v3/search/id/76ade247ae7095694d39e1156c3ae747?api_key=v3p5jdmqc5e64hg39m2c5efr&fetchDraftIfLatest=false&showFutureDated=false',
                                    'sref-https://content.api.news/v3/search/id/76ade247ae7095694d39e1156c3ae747?api_key=v3p5jdmqc5e64hg39m2c5efr&fetchDraftIfLatest=false&showFutureDated=false-76ade247ae7095694d39e1156c3ae747'
                                ]);

                                done(err);
                            });
                        });
                    });
                });

                describe('#searchByParams', () => {
                    it('populates X-Cache-Tag header', (done) => {
                        search.write(searchByParamsJson, (err, result) => {
                            redis.get('https://content.api.news/v3/search?api_key=e7ktktqmn76e86bu5fq56er2&fetchDraftIfLatest=false&includeArchived=true&platformId=1226265887767&showFutureDated=false&type=article,collection', (err, result) => {
                                expect(JSON.parse(result).headers['X-Cache-Tags']).eq('C:3c41d31c13249388db668a52e1578ceb');

                                done(err);
                            });
                        });
                    });

                    it('write to redis', (done) => {
                        search.write(searchByParamsJson, (err, result) => {
                            redis.keys('*', (err: Error, result: string[]) => {
                                expect(result).to.have.same.members([
                                    'https://content.api.news/v3/search?api_key=e7ktktqmn76e86bu5fq56er2&fetchDraftIfLatest=false&includeArchived=true&platformId=1226265887767&showFutureDated=false&type=article,collection',
                                    'sref-https://content.api.news/v3/search?api_key=e7ktktqmn76e86bu5fq56er2&fetchDraftIfLatest=false&includeArchived=true&platformId=1226265887767&showFutureDated=false&type=article%2Ccollection-3c41d31c13249388db668a52e1578ceb'
                                ]);

                                done(err);
                            });
                        });
                    });
                });

                describe('#collectionSearch', () => {
                    it('populates X-Cache-Tag header', (done) => {
                        search.write(collectionSearchJson, (err, result) => {

                            redis.get('https://content.api.news/v3/collections?api_key=h9qby8sp25f4cvygu9dapbqe&dateUpdatedFrom=2019-04-20T10:00&dateUpdatedTo=2019-04-20T13:00&fetchDraftIfLatest=false&includeArchived=false&showExpired=false&showFutureDated=false&showInactive=false&showKilled=false&sortBy=dateUpdated&sortOrder=ASC', (err, result) => {

                                expect(JSON.parse(result).headers['X-Cache-Tags']).eq('C:cb5aebdfc1b9627f0aa1133d3fb45bd7 C:de1c64c0af1003ee45486ef147599c7d C:adca5769efa726f0de53f68901f91933');
                                done(err);
                            });
                        });
                    });

                    it('write to redis', (done) => {
                        search.write(collectionSearchJson, (err, result) => {
                            redis.keys('*', (err: Error, result: string[]) => {
                                expect(result).to.have.same.members([
                                    'https://content.api.news/v3/collections?api_key=h9qby8sp25f4cvygu9dapbqe&dateUpdatedFrom=2019-04-20T10:00&dateUpdatedTo=2019-04-20T13:00&fetchDraftIfLatest=false&includeArchived=false&showExpired=false&showFutureDated=false&showInactive=false&showKilled=false&sortBy=dateUpdated&sortOrder=ASC',
                                    'sref-https://content.api.news/v3/collections?api_key=h9qby8sp25f4cvygu9dapbqe&dateUpdatedFrom=2019-04-20T10%3A00&dateUpdatedTo=2019-04-20T13%3A00&fetchDraftIfLatest=false&includeArchived=false&showExpired=false&showFutureDated=false&showInactive=false&showKilled=false&sortBy=dateUpdated&sortOrder=ASC-adca5769efa726f0de53f68901f91933',
                                    'sref-https://content.api.news/v3/collections?api_key=h9qby8sp25f4cvygu9dapbqe&dateUpdatedFrom=2019-04-20T10%3A00&dateUpdatedTo=2019-04-20T13%3A00&fetchDraftIfLatest=false&includeArchived=false&showExpired=false&showFutureDated=false&showInactive=false&showKilled=false&sortBy=dateUpdated&sortOrder=ASC-cb5aebdfc1b9627f0aa1133d3fb45bd7',
                                    'sref-https://content.api.news/v3/collections?api_key=h9qby8sp25f4cvygu9dapbqe&dateUpdatedFrom=2019-04-20T10%3A00&dateUpdatedTo=2019-04-20T13%3A00&fetchDraftIfLatest=false&includeArchived=false&showExpired=false&showFutureDated=false&showInactive=false&showKilled=false&sortBy=dateUpdated&sortOrder=ASC-de1c64c0af1003ee45486ef147599c7d'
                                ]);

                                done(err);
                            });
                        });
                    });
                });
            });
        });
    });
});
