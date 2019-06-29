import { Message } from 'aws-sdk/clients/sqs';
import * as Redis from 'ioredis';
import handler from '../../src/adapter/handler';
import * as json from '../fixtures/capi/v2/active.json';

describe('#handler', () => {
    it('published to redis', (done) => {
        const host = process.env.REDIS_PUB_SUB_HOST || 'localhost';
        const channel = 'test';
        const publisher = new Redis(host);
        const input: Message = { Body: JSON.stringify(json) };
        const subscriber = new Redis(host);

        subscriber.on('message', (_, output) => {
            subscriber.disconnect();
            done();
        });

        subscriber.subscribe(channel, () => {
            handler(publisher, channel, input, () => {
                publisher.disconnect();
            });
        });
    });
});
