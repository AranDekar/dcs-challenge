import * as Redis from 'ioredis';
import getLogger from 'dcs-logger';
import handler from './handler';
import { Options, create, ConsumerDone } from 'sqs-consumer';
import { Message } from 'aws-sdk/clients/sqs';

const logger = getLogger();

export default function(sqsUrl: string, redisHost: string, redisChannel: string, cb: CAPIEventsAdapter.CallbackFn) {
    const redis = Redis(redisHost);

    const options: Options = {
        batchSize: 10,
        queueUrl: sqsUrl,
        waitTimeSeconds: 3,
        handleMessage(message: Message, cb: ConsumerDone) {
            handler(redis, redisChannel, message, cb);
        },
    };

    const sqs = create(options);

    const shutdown = (err: Error) => {
        if (err) {
            logger.error('Error in SQS: ', { err: err });
        }
        sqs.stop();

        redis.disconnect();

        return cb(err);
    };

    sqs.on('error', (err: any) => { shutdown(err); });

    sqs.on('empty', () => { shutdown(undefined); });

    redis.on('error', (err) => { shutdown(err); });

    sqs.start();
}
