import * as Redis from 'ioredis';

function retryStrategy(times: number): number | false {
    const delay = Math.min(times * 50, 2000);

    return delay;
}

const host = process.env.REDIS_PUB_SUB_HOST || 'localhost',
    redis = Redis(host, { lazyConnect: true, retryStrategy: retryStrategy });

export default redis;
