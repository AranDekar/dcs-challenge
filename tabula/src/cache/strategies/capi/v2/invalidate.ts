import { redis } from '../../../../lib/redis';
import { eachSeries, each, eachLimit } from 'async';
import { splitWhen, map, uniq } from 'ramda';

const SCAN_COUNT = 1000;

const searchSplitter = (key: string): boolean => {
    return /(sref)|(cref)/.test(key);
};

const invalidateCapi = (capiId: string, cb: Tabula.Callback) => {
    console.log('[Tabula] invalidate: ', capiId);

    const stream = redis.scanStream({
        match: `*${ capiId }*`,
        count: SCAN_COUNT
    });

    stream.on('data', (keys: string[]) => {
        const [ regularKeys, searchKeys ] = splitWhen(searchSplitter, keys);

        if (regularKeys.length > 0) {
            console.log('[Tabula] delete: ', ...regularKeys);

            redis.del(...regularKeys);
        }

        if (searchKeys.length > 0) invalidateSearchResults(searchKeys, (err) => { });
    });

    stream.on('error', (err: Error) => { return cb(err); });
    stream.on('end', () => { return cb(); });
};

const invalidateSearchResults = (searchKeys: string[], cb: Tabula.Callback) => {
    const searchId = (key: string): string => { return key.split('-')[1]; };

    const contentKey: string = searchKeys[0].split('-')[2];

    invalidateSearchResult(contentKey, () => {
        const searchIds = uniq(map(searchId, searchKeys));
        eachSeries(searchIds, invalidateSearchResult);
    });
};

const invalidateSearchResult = (searchId: string, cb: Tabula.Callback) => {
    const stream = redis.scanStream({
        match: `*${ searchId }*`,
        count: SCAN_COUNT
    });

    stream.on('data', (keys: string[]) => { if (keys.length > 0) {
            console.log('[Tabula] delete: ', ...keys);

            redis.del(...keys);
        }
    });
    stream.on('error', (err: Error) => { return cb(err); });
    stream.on('end', () => { return cb(); });
};

export { invalidateCapi };
