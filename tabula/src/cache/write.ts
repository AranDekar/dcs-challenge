import * as R from 'ramda';
import { CAPIv2 } from './strategies/capi/v2';
import { CAPIv3 } from './strategies/capi/v3';
import { Resource } from './strategies/resource';
import { non200s } from './strategies/non200s';
import Null from './strategies/null';
import { find } from 'ramda';

const cacheTypes = CAPIv3.concat(CAPIv2).concat([Resource]).concat(non200s).concat([Null]);

const write = (jsonApiResponse: Tabula.JsonApiResponse, cb: Tabula.Callback): void => {
    const cacheWrite = match(jsonApiResponse);
    return cacheWrite(jsonApiResponse, cb);
};

export { write };

const match = (jsonApiResponse: Tabula.JsonApiResponse): Function => {
    const matcher = (cacheType: Tabula.CacheType): boolean => {
        return cacheType.identify(jsonApiResponse);
    };

    const match = find(matcher, cacheTypes);

    if (!match) {
        return Null.write;
    }

    return match.write;
};
