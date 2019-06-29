// All cache types use the same read function

import { redis } from './../lib/redis';
import * as normalizeUrl from 'normalize-url';

const read = (url: string, cb: Tabula.Callback) => {
    const normalisedUrl = normalizeUrl(url);
    redis.get(normalisedUrl, cb);
};

export { read };
