/**
 * Module dependencies.
 */
import { events } from '..';
import * as Redis from '../../lib/redis';
import getLogger from 'dcs-logger';

const channel = process.env.REDIS_PUB_SUB_CHANNEL || 'content';
const eventName = channel;
const logger = getLogger();
const subscriber = Redis.create(process.env.REDIS_PUB_SUB_HOST);

const subscribeToRedis = (cb: Tabula.Callback) => {
  subscriber.on('message', (channel: string, message: string) => {
    logger.debug('Subscriber received msg: ', message);

    const event: Tabula.ExternalEvent = JSON.parse(message);

    events.emit(eventName, event);
  });

  subscriber.subscribe(channel, () => {
    return cb();
  });
};

export { subscribeToRedis, eventName, channel };
