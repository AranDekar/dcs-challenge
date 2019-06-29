import { make } from '../../../lib/keyMaker';
import serialize from '../../../lib/serialize';
import { ttlDecider } from '../../../lib/ttlDecider';
import { Headers } from '../../../../headers';
import refWrite from '../lib/refWriter';
import { map } from 'ramda';

const extractIds = (data: object): string[] => {
    const collection = (data as Tabula.CAPIType);

    const mapper = (member: Tabula.CAPIMember): string => {
        return member.id.value;
    };

    if (collection.content.origin == 'OMNITURE') {
        return map(mapper, collection.content.references);
    } else {
        return map(mapper, collection.results);
    }
};

const identifier = (jsonApiResponse: Tabula.JsonApiResponse): boolean => {
    try {
        return jsonApiResponse.jsonBody.contentType === 'COLLECTION' ||
            jsonApiResponse.jsonBody.content.contentType === 'COLLECTION';
    } catch (e) {
        return false;
    }
};

const write = (jsonApiResponse: Tabula.JsonApiResponse, cb: Tabula.Callback): void => {
    const key = make(jsonApiResponse.url);
    jsonApiResponse.headers[Headers.XCacheTags] = xCacheTagHeaders(jsonApiResponse);
    const value = serialize(jsonApiResponse);
    const ttl = ttlDecider('V2_COLLECTION', jsonApiResponse.status);

    const id = jsonApiResponse.url,
        ids = extractIds(jsonApiResponse.jsonBody),
        multi = refWrite('cref', id, ids, ttl);

    multi.set(key, value, 'ex', ttl);
    multi.exec((err) => { return cb(err, jsonApiResponse); });
};

const xCacheTagHeaders = (jsonApiResponse: Tabula.JsonApiResponse): string => {
    return extractIds(jsonApiResponse.jsonBody).map((id) => { return `C:${id}`; }).join(' ');
};

export const Collection = {
    identify: identifier,
    write: write,
    xCacheTagHeaders: xCacheTagHeaders
};
