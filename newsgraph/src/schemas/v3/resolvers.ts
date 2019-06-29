import { IResolvers } from 'graphql-tools/dist/Interfaces';
import * as GraphQLJSON from 'graphql-type-json';

const resolvers: IResolvers = {
    JSON: <any>GraphQLJSON,
    Query: {
        getV3: async (root, { id, apiKey }) => {
            return root.getResource(id, apiKey);
        },
        getV3Resources: async (root, { ids, apiKey }) => {
            return root.getResources(ids, apiKey);
        },
        articleBasicSearch: async (root, args) => {
            args['api_key'] = args['apiKey'];
            delete args['apiKey'];

            return root.articleBasicSearch(args);
        },
        collectionBasicSearch: async (root, args) => {
            args['api_key'] = args['apiKey'];
            delete args['apiKey'];

            return root.collectionBasicSearch(args);
        },
        imageBasicSearch: async (root, args) => {
            args['api_key'] = args['apiKey'];
            delete args['apiKey'];

            return root.imageBasicSearch(args);
        },
        videoBasicSearch: async (root, args) => {
            args['api_key'] = args['apiKey'];
            delete args['apiKey'];

            return root.videoBasicSearch(args);
        },
        searchAdvance: async (root, args) => {
            args['api_key'] = args['apiKey'];
            delete args['apiKey'];

            return root.searchAdvance(args);
        }
    },
    V3Item: {
        __resolveType(obj, ctx, info) {
            switch (obj.type) {
                case 'article': { return 'V3Article'; }
                case 'collection': { return 'V3Collection'; }
                case 'image': { return 'V3Image'; }
                case 'video': { return 'V3Video'; }
                default: { throw `unknown "type": ${ obj }`; }
            }
        }
    }
};

export { resolvers };
