import * as IORedis from 'ioredis';
import * as zlib from 'zlib';

const defaultHost = process.env.REDIS_CACHE_HOST || 'localhost';

IORedis.Command.setArgumentTransformer('set', (args: Array<any>) => {
    const value = args[1];

    switch (typeof value) {
        case 'string':
            args[1] = zlib.gzipSync(value).toString('base64');

            return args;
        default:
            return args;
    }
  });

IORedis.Command.setReplyTransformer('get', (result: any) => {
    switch (typeof result) {
        case 'string':
            result = zlib.gunzipSync(new Buffer(result, 'base64')).toString();

            return result;
        default:
            return result;
    }
});

function retryStrategy(times: number): number | false {
    const delay = Math.min(times * 50, 2000);
    console.log('retryStrategy running ... ', delay);

    return delay;
}

function create(host: string = defaultHost): IORedis.Redis {
    const redis = new IORedis(host, { lazyConnect: true, retryStrategy: retryStrategy });

    return redis;
}

const redis = create();

export { create, redis };
