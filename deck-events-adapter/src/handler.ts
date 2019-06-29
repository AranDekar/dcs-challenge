import { v4 } from 'uuid';
import redis from './redis';
import getLogger from 'dcs-logger';

export default (id: string, cb: (err: any, res: any) => any ) => {
    const channel = process.env.REDIS_PUB_SUB_CHANNEL || 'content',
        event = JSON.stringify({
            id: v4(),
            timeUTC: Date.now(),
            kind: 'DELETE',
            sourceId: `${ id }`,
            source: 'DECK',
        });

    redis.publish(channel, event, (err: any, res: any) => {
        if (err) {
            const logger = getLogger();
            logger.error(err);
        }
        cb(err, res);
    });
};
