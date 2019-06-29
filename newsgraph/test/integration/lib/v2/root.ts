import * as collection from '../../../fixtures/v2/collection.json';
import * as search from '../../../fixtures/v2/search.json';

const root = {
    getResource: async () => {
        throw 'not implemented';
    },
    getCollection: async () => {
        return collection;
    },
    getSearch: async () => {
        return search;
    }
};

export { root };
