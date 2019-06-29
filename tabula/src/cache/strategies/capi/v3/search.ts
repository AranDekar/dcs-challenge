import * as jsonpath from 'jsonpath';
import * as ramda from 'ramda';
import serialize from '../../../lib/serialize';
import { ttlDecider } from '../../../lib/ttlDecider';
import { Headers } from '../../../../headers';
import { make } from '../../../lib/keyMaker';
import refWrite from '../lib/refWriter';

const extractIds = (data: object): string[] => {
    return jsonpath.query(data, '$.results[*].id');
};

const identify = (jsonApiResponse: Tabula.JsonApiResponse): boolean => {
    const types = ['v3/articles', 'v3/collections', 'v3/customs', 'v3/files', 'v3/images', 'v3/search', 'v3/video'];

    try {
        /* We don't want to cache an individual article request as a search */
        if (jsonApiResponse.url.match(/v3\/(articles|collections|customs|files|images|video)\/[a-zA-Z0-9]{32}/)) {
            return false;
        }

        /* Replaces return jsonApiResponse.url.includes('v3/articles') || jsonApiResponse.url.includes('v3/search')... */
        for (const x in types) {
            if (jsonApiResponse.url.includes(types[x]))
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
    const ttl = ttlDecider('V3_SEARCH', jsonApiResponse.status);

    try {
        const id = jsonApiResponse.url,
            ids = extractIds(jsonApiResponse.jsonBody),
            multi = refWrite('sref', id, ids, ttl);
        multi.set(key, value, 'ex', ttl);
        multi.exec((err, result) => {
            return cb(err, jsonApiResponse);
        });
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
