import * as article from '../../../fixtures/v3/article.json';
import * as image from '../../../fixtures/v3/image.json';
import * as video from '../../../fixtures/v3/video.json';
import * as collection from '../../../fixtures/v3/collection.json';
import * as articleBasicSearch from '../../../fixtures/v3/articleBasicSearch.json';

const root: V3Root = {
    get: async () => {
        return article;
    },
    getResources: async (ids: string[]) => {
        switch (ids) {
            case ['e8a0b180f614a76cf5935e8e02b86a32101', 'e8a0b180f614a76cf5935e8e02b86a32101']: return article;
            default: throw `missing fixture for ${ids}`;
        }
    },
    getResource: async (id: string) => {
        switch (id) {
            case '3b25867dee63719309825c33d6b8711a': return image;
            case '5f145d128a3c4ad74fd1c2a58401781f': return collection;
            case '98485290c72e31ce538c6b5de08912b6': return video;
            case 'e8a0b180f614a76cf5935e8e02b86a32101': return article;
            default: throw `missing fixture for ${id}`;
        }
    },
    getResourceRevision: async (id: string, apiKey: string,  documentRevisionMajor: string, documentRevisionMinor: string) => {
        throw 'no implemented';
    },
    getCollection: async () => {
        return collection;
    },
    articleBasicSearch: async () => {
        return articleBasicSearch;
    },
    getSearch: async (args: object) => {
        throw 'no implemented';
    },
    collectionBasicSearch: async (args: object) => {
        throw 'no implemented';
    },
    imageBasicSearch: async (args: object) => {
        throw 'no implemented';
    },
    searchAdvance: async (args: object) => {
        throw 'no implemented';
    },
    videoBasicSearch: async (args: object) => {
        throw 'no implemented';
    }
};

export { root };
