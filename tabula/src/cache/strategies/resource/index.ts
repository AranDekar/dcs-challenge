import { redis } from '../../../lib/redis';
import serialize from '../../lib/serialize';
import { ttlDecider } from '../../lib/ttlDecider';
import { make } from '../../lib/keyMaker';

const write = (jsonApiResponse: Tabula.JsonApiResponse, cb: Tabula.Callback): void => {
    const key = make(jsonApiResponse.url);
    const value = serialize(jsonApiResponse);
    const ttl = ttlDecider('RESOURCE', jsonApiResponse.status);

    redis.set(key, value, (err: Error) => {
        if (!err) {
            redis.expire(key, ttl);

            cb(undefined, jsonApiResponse);
        } else {
            cb(err, jsonApiResponse);
        }
    });
};

const identify = (jsonApiResponse: Tabula.JsonApiResponse): boolean => {
    return !!jsonApiResponse.jsonBody;
};

const xCacheTagHeaders = (_: Tabula.JsonApiResponse): string => {
    // we'll put conditional logic here to check for Deck resources ...
    return '';
};

export const Resource = {
    identify: identify,
    write: write,
    xCacheTagHeaders: xCacheTagHeaders
};
