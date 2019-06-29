/**
 * Instrumentation.
 */
import * as newrelic from "newrelic";

/**
 * Module dependencies.
 */
import { Message } from 'aws-sdk/clients/sqs';
import { Redis } from 'ioredis';
import { ConsumerDone } from 'sqs-consumer';
import transform from './transform';


export default function(redis: Redis, channel: string, message: Message, cb: ConsumerDone) {
    newrelic.startBackgroundTransaction('Transform', () => {
        const transaction = newrelic.getTransaction();
        const output = transform(message);

        redis.publish(channel, output, () => {
            transaction.end();
            cb();
        });
    });
}
