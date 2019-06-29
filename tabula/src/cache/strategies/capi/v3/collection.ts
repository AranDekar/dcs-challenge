import * as jsonpath from 'jsonpath';
import serialize from '../../../../cache/lib/serialize';
import { ttlDecider } from '../../../../cache/lib/ttlDecider';
import { Headers } from '../../../../headers';
import { make } from '../../../lib/keyMaker';
import refWrite from '../lib/refWriter';

const extractIds = (data: object): string[] => {
    return jsonpath.query(data, '$.content.related.primary.default[*]');
};

const identify = (jsonApiResponse: Tabula.JsonApiResponse): boolean => {
    try {
        if (jsonApiResponse.url.match(/v3\/collections\/[a-zA-Z0-9]{32}/)) {
            return true;
        }
        return false;
    } catch (err) {
        return false;
    }
};

const write = (jsonApiResponse: Tabula.JsonApiResponse, cb: Tabula.Callback): void => {
    const key = make(jsonApiResponse.url);
    jsonApiResponse.headers[Headers.XCacheTags] = xCacheTagHeaders(jsonApiResponse);
    const value = serialize(jsonApiResponse);
    const ttl = ttlDecider('V3_COLLECTION', jsonApiResponse.status);

    try {
        const id = jsonApiResponse.url,
            ids = extractIds(jsonApiResponse.jsonBody),
            multi = refWrite('cref', id, ids, ttl);

        multi.set(key, value, 'ex', ttl);
        multi.exec((err, result) => { return cb(err, jsonApiResponse); });
    } catch (err) {
        return cb(err, jsonApiResponse);
    }
};

const xCacheTagHeaders = (jsonApiResponse: Tabula.JsonApiResponse): string => {
    return extractIds(jsonApiResponse.jsonBody).map((value) => { return `C:${value}`; }).join(' ');
};

export default {
    identify: identify,
    write: write,
    xCacheTagHeaders: xCacheTagHeaders
};
