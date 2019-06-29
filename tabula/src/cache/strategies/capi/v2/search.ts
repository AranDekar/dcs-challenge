import { make } from '../../../lib/keyMaker';
import serialize from '../../../../cache/lib/serialize';
import { ttlDecider } from '../../../../cache/lib/ttlDecider';
import { Headers } from '../../../../headers';
import { map } from 'ramda';
import refWrite from '../lib/refWriter';
import getLogger from 'dcs-logger';

const logger = getLogger();

const extractIds = (data: object): string[] => {
    const search = (data as Tabula.CAPIType);

    const mapper = (member: Tabula.CAPIMember): string => {
        return member.id.value;
    };

    return map(mapper, search.results);
};

const identifier = (jsonApiResponse: Tabula.JsonApiResponse): boolean => {
    try {
        // We only need the resultSize field to be present to identify a search
        // It could be an empty search, so no need to check other properties.
        return !!jsonApiResponse.jsonBody.resultSize;
    } catch (e) {
        return false;
    }
};

const write = (jsonApiResponse: Tabula.JsonApiResponse, cb: Tabula.Callback): void => {
    const key = make(jsonApiResponse.url);

    jsonApiResponse.headers[Headers.XCacheTags] = xCacheTagHeaders(jsonApiResponse);
    const value = serialize(jsonApiResponse);
    const ttl = ttlDecider('SEARCH', jsonApiResponse.status);

    try {
        const data = jsonApiResponse.jsonBody,
            ids = extractIds(data),
            multi = refWrite('sref', key, ids, ttl);

        multi.set(key, value, 'ex', ttl);
        multi.exec((err, result) => { return cb(err, jsonApiResponse); });
    } catch (err) {
        return cb(err, jsonApiResponse);
    }
};

const xCacheTagHeaders = (jsonApiResponse: Tabula.JsonApiResponse): string => {
    const headers = extractIds(jsonApiResponse.jsonBody).map((id) => { return `C:${id}`; }).join(' ');
    logger.debug('xCacheTagHeaders: ', headers);
    return headers;
};

export const Search = {
    identify: identifier,
    write: write,
    xCacheTagHeaders: xCacheTagHeaders
};
