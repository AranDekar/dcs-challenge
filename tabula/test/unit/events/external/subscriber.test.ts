import { expect } from 'chai';
import * as external from './../../../../src/events/external/subscriber';
import { events } from '../../../../src/events';
import * as RedisClient from '../../../../src/lib/redis';

describe('external event subscriber', () => {
    let fn: Function;

    afterEach(() => {
        events.removeListener(external.eventName, fn);
    });

    it('emits event', (done) => {
        fn = (event: Tabula.ExternalEvent) => {};

        events.on(external.eventName, fn);

        const redis = RedisClient.create();

        const event: Tabula.ExternalEvent = {
            id: '42',
            source: 'CAPI',
            sourceId: 'a1c7d5f847550f05f24e8d46afcae70f',
            timeUTC: 0,
            kind: 'KILL'
        };

        redis.publish(external.channel, JSON.stringify(event));

        external.subscribeToRedis(() => {
            expect(event.kind === 'KILL').to.be.true;
            done();
        });
    });

});
