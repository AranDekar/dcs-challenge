import { redis } from '../../../lib/redis';
import serialize from '../../lib/serialize';
import { ttlDecider } from '../../lib/ttlDecider';
import { make } from '../../lib/keyMaker';

const non200Keys = ['400', '403', '404', '410', '500'];

const non200s: Tabula.CacheType[] = [];

const generateCacheType = (statusCode: string) => {
    const non200CacheType: Tabula.CacheType = {
        write: (jsonApiResponse: Tabula.JsonApiResponse, cb: Tabula.Callback): void => {
            const key = make(jsonApiResponse.url);
            const value = serialize(jsonApiResponse);
            const ttl = ttlDecider('ERROR', jsonApiResponse.status);

            redis.set(key, value, (err: Error) => {
                if (!err) {
                    redis.expire(key, ttl);

                    cb(undefined, jsonApiResponse);
                } else {
                    cb(err, jsonApiResponse);
                }
            });
        },
        identify: (jsonApiResponse: Tabula.JsonApiResponse): boolean => {
            if (jsonApiResponse.status > 201) {
                return (statusCode == jsonApiResponse.status.toString());
            }
            return false;
        },
        xCacheTagHeaders: (_: Tabula.JsonApiResponse): string => { return ''; }
    };

    non200s.push(non200CacheType);
};

non200Keys.forEach(generateCacheType);

export { non200s };
