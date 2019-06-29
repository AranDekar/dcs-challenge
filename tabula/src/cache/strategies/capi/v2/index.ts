import { Collection } from './collection';
import { Search } from './search';
import { maker } from './lib/cacheTypeMaker';
import { find, map } from 'ramda';

const CAPI_V2_PREFIX = 'C';

export const CAPIv2: Tabula.CacheType[] = [
    maker(CAPI_V2_PREFIX),
    Collection,
    Search
];
