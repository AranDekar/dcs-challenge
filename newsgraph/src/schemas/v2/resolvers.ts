import { IResolvers } from 'graphql-tools/dist/Interfaces';

const resolvers: IResolvers = {
    Query: {
        getV2: async (root, { id, apiKey }) => {
            return root.getResource(id, apiKey);
        },
        getV2Collection: async (root, { id, apiKey }) => {
            return root.getCollection(id, apiKey);
        },
        getV2Search: async (root, args) => {
            args['api_key'] = args['apiKey'];
            delete args['apiKey'];

            return root.getSearch(args);
        }
    },
    V2Item: {
        __resolveType(obj, ctx, info) {
            switch (obj.contentType || obj.content.contentType) {
                case 'BLOB': { return 'V2Blob'; }
                case 'COMPONENT': { return 'V2Component'; }
                case 'IFRAME': { return 'V2Iframe'; }
                case 'IMAGE': { return 'V2Image'; }
                case 'IMAGE_GALLERY': { return 'V2ImageGallery'; }
                case 'NEWS_STORY': { return 'V2NewsStory'; }
                case 'PROMO': { return 'V2Promo'; }
                case 'VIDEO': { return 'V2Video'; }
                case 'COLLECTION': { return 'V2Collection'; }
                default: { throw `unknown "type": ${ obj }`; }
            }
        }
    }
};

export { resolvers };
