import Collection from './collection';
import Resource from './resource';
import Search from './search';

export const CAPIv3: Tabula.CacheType[] = [
    Search,
    Collection,
    Resource
];
