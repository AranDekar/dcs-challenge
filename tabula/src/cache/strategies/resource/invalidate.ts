import { redis } from '../../../lib/redis';
import { make } from '../../lib/keyMaker';

const SCAN_COUNT = 1000;

export default (url: string, cb: Tabula.Callback): void => {
    const key = make(url);

    const stream = redis.scanStream({
        match: `*${ key }*`,
        count: SCAN_COUNT
    });

    let keys: Array<string> = [];

    stream.on('data', (resultKeys: Array<string>) => {
        keys = keys.concat(resultKeys);
    });

    stream.on('end', () => {
        if (keys.length > 0) {
            redis.del(keys, cb);
        } else {
            cb();
        }
    });
};
