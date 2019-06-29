import { read } from '../../../src/cache/read';
import { write } from '../../../src/cache/write';
import { redis } from '../../../src/lib/redis';
import { expect } from 'chai';
import { toJsonApiResponse } from '../../utils';
import { v2Fixtures } from './../../fixtures/capi/v2';
import { v3Fixtures } from './../../fixtures/capi/v3';

describe('Cache', () => {
    afterEach((done) => {
        redis.flushdb(done);
    });

    describe('#read', () => {
        describe('CAPI', () => {
            describe('v3', () => {
                it('maps url to cache', (done) => {
                    const fixture = v3Fixtures.collectionSearch;
                    const jsonApiResponse = toJsonApiResponse(v3Fixtures.collectionSearch);

                    write(jsonApiResponse, (err, result) => {
                        read(fixture.url, (err: Error, result: string) => {
                            const json = JSON.parse(result);

                            expect(json.headers).to.not.eq(fixture.headers);
                            expect(json.body).to.eq(fixture.body);
                            expect(json.status).to.eq(fixture.status);

                            done(err);
                        });
                    });
                });
            });

            describe('v2', () => {
                it('maps url to cache', (done) => {
                    const fixture = v2Fixtures.newsStory;
                    const jsonApiResponse = toJsonApiResponse(fixture);

                    write(jsonApiResponse, (err, result) => {
                        read(fixture.url, (err: Error, result: string) => {
                            const json = JSON.parse(result);

                            expect(json.headers).to.not.eq(fixture.headers);
                            expect(json.body).to.eq(fixture.body);
                            expect(json.status).to.eq(fixture.status);

                            done(err);
                        });
                    });
                });
            });
        });
    });
});
