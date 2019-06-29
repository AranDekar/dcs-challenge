import * as IORedis from 'ioredis';
import * as zlib from 'zlib';

const redis = IORedis('localhost:6379');

IORedis.Command.setReplyTransformer('get', (result: any) => {
    switch (typeof result) {
        case 'string':
            result = zlib.gunzipSync(new Buffer(result, 'base64')).toString();

            return result;
        default:
            return result;
    }
});

function size(cb: (n: number) => void) {
    redis.keys('*', (error: Error, result: Array<string>) => {
        cb(result.length);
    });
}

export { redis, size };
