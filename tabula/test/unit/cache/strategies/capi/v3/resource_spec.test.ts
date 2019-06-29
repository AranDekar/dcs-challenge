import resource from '../../../../../../src/cache/strategies/capi/v3/resource';
import { article as fixture } from '../../../../../fixtures/capi/v3/article1';
import { collectionSearch as incorrectFixture } from '../../../../../fixtures/capi/v3/collectionSearch1';
import { redis } from './../../../../../../src/lib/redis';
import { expect } from 'chai';
import { toJsonApiResponse } from '../../../../../utils';

const articleJson = toJsonApiResponse(fixture);
const incorrectArticle = toJsonApiResponse(incorrectFixture);

describe('capi', () => {
    describe('v3', () => {
        describe('resource', () => {
            afterEach((done) => {
                redis.flushdb(done);
            });

            describe('#identify', () => {
                it('returns true', () => {
                    expect(resource.identify(articleJson)).to.eq(true);
                });

                it('returns false', () => {
                    expect(resource.identify(incorrectArticle)).to.eq(false);
                });
            });

            describe('#xCacheTagHeaders', () => {
                it('returns value', () => {
                    const value = resource.xCacheTagHeaders(articleJson);

                    expect(value).to.eq('C:839deb2c4c7024630910d4ef57d58f78');
                });
            });

            describe('#write', () => {
                it('populates X-Cache-Tag header', (done) => {
                    resource.write(articleJson, (err, result) => {
                        redis.get('http://content-sit.api.news/v3/articles/839deb2c4c7024630910d4ef57d58f78?api_key=wy745368rhtznnrprnqzp5dt', (err, result) => {
                            expect(JSON.parse(result).headers['X-Cache-Tags']).eq('C:839deb2c4c7024630910d4ef57d58f78');

                            done(err);
                        });
                    });
                });

                it('write to redis', (done) => {
                    resource.write(articleJson, (err, result) => {
                        redis.keys('*', (err: Error, result: string[]) => {
                            expect(result).to.have.same.members([
                                'http://content-sit.api.news/v3/articles/839deb2c4c7024630910d4ef57d58f78?api_key=wy745368rhtznnrprnqzp5dt'
                            ]);

                            done(err);
                        });
                    });
                });
            });
        });
    });
});
