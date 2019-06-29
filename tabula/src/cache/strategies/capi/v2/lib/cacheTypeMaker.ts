import { make } from '../../../../lib/keyMaker';
import { redis } from '../../../../../lib/redis';
import serialize from '../../../../lib/serialize';
import { ttlDecider } from '../../../../lib/ttlDecider';
import { Headers } from '../../../../../headers';

const maker = (headerPrefix: string): Tabula.CacheType => {
    const identifier = (jsonApiResponse: Tabula.JsonApiResponse): boolean => {
        if (!jsonApiResponse.jsonBody.origin && !jsonApiResponse.jsonBody.originId) {
            return false;
        }

        // We need to identify that it is not a COLLECTION or SEARCH
        if (jsonApiResponse.jsonBody.contentType === 'COLLECTION') {
            return false;
        } else if (jsonApiResponse.jsonBody.content &&
            jsonApiResponse.jsonBody.content.contentType === 'COLLECTION') {
            return false;
        } else if (!!jsonApiResponse.jsonBody.resultSize) {
            return false;
        }

        return true;
    };

    const xCacheTagHeaders = (jsonApiResponse: Tabula.JsonApiResponse): string => {
        return `${headerPrefix}:${jsonApiResponse.jsonBody.id.value}`;
    };

    const write = (jsonApiResponse: Tabula.JsonApiResponse, cb: Tabula.Callback): void => {
        const key = make(jsonApiResponse.url);
        jsonApiResponse.headers[Headers.XCacheTags] = xCacheTagHeaders(jsonApiResponse);
        const value = serialize(jsonApiResponse);
        const ttl = ttlDecider('V2_RESOURCE', jsonApiResponse.status);

        redis.set(key, value, 'ex', ttl, (err: any, result: any) => {
            cb(err, jsonApiResponse);
        });
    };

    const resource = {
        identify: identifier,
        write: write,
        xCacheTagHeaders: xCacheTagHeaders
    };

    return resource;
};

export { maker };
