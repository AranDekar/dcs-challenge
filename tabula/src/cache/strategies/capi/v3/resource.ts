import * as jsonpath from 'jsonpath';
import serialize from '../../../../cache/lib/serialize';
import { ttlDecider } from '../../../../cache/lib/ttlDecider';
import { Headers } from '../../../../headers';
import { redis } from '../../../../lib/redis';
import { make } from '../../../lib/keyMaker';

function identify (jsonApiResponse: Tabula.JsonApiResponse): boolean {
    try {
        return jsonApiResponse.jsonBody.content.schemaVersion === 'v3.0';
    } catch (err) {
        return false;
    }
}

function write (jsonApiResponse: Tabula.JsonApiResponse, cb: Tabula.Callback): void {
    const key = make(jsonApiResponse.url);
    jsonApiResponse.headers[Headers.XCacheTags] = xCacheTagHeaders(jsonApiResponse);
    const value = serialize(jsonApiResponse);
    const ttl = ttlDecider('RESOURCE', jsonApiResponse.status);

    redis.set(key, value, 'ex', ttl, (err: any, result: any) => {
        cb(err, jsonApiResponse);
    });
}

function xCacheTagHeaders (jsonApiResponse: Tabula.JsonApiResponse): string {
    return jsonpath.query(jsonApiResponse.jsonBody, '$.content.id').map((value) => { return `C:${value}`; }).join(' ');
}

export default {
    identify: identify,
    write: write,
    xCacheTagHeaders: xCacheTagHeaders
};
