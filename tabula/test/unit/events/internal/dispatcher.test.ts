import { listenForContent, dispatch } from './../../../../src/events/internal/dispatcher';
import { events } from './../../../../src/events';
import { write } from './../../../../src/cache/write';
import { redis } from '../../../../src/lib/redis';
import { expect } from 'chai';
import { newsStory as v2newsStory } from './../../../fixtures/capi/v2/newsStory1';
import { article as v3article  } from './../../../fixtures/capi/v3/article1';
import { collectionSearch as v3collection  } from '../../../fixtures/capi/v3/collectionSearch1';
import { toJsonApiResponse } from '../../../utils';

describe('#listenForContent', () => {
    it('sets up a listener for a content event', () => {
        const contentEventCount = events.listeners('content').length;
        listenForContent();
        expect(events.listeners('content').length).to.equal(contentEventCount + 1);
    });
});

const examples = [
    {
        fixture: v2newsStory,
        id: JSON.parse(v2newsStory.body).id.value
    },
    {
        fixture: v3article,
        id: JSON.parse(v3article.body).content.id
    },
    {
        fixture: v3collection,
        id: JSON.parse(v3collection.body).results[0].id
    }
];

describe('#dispatch', () => {
    for (const example of examples) {
        const event: Tabula.ExternalEvent = {
            id: '43',
            source: 'CAPI',
            sourceId: example.id,
            timeUTC: 0,
            kind: 'KILL'
        };

        describe(`example ${example.id}`, () => {
            beforeEach((done) => {
                const jsonApiFixture = toJsonApiResponse(example.fixture);
                write(jsonApiFixture, done);
            });

            afterEach((done) => {
                redis.flushdb(done);
            });

            it('removes keys', (done) => {
                redis.keys('*', (err: Error, keys: string[]) => {
                    expect(keys.length).to.be.gt(0);
                });

                dispatch(event, (err: Error, result: any) => {
                    setTimeout(() => {
                        redis.keys('*', (err: Error, keys: string[]) => {
                            expect(keys.length).to.equal(0);

                            done(err);
                        });
                    }, 50);
                });
            });
       });
    }
});
