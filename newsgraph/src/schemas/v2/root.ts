import * as request from 'request-promise';
import * as R from 'ramda';
import * as querystring from 'querystring';

const root = {
    get: async (url: string) => {
        const body = await request.get(`${ R.defaultTo('')(process.env.TABULA_URL) }${ url }`);

        const payload = JSON.parse(body);

        return payload;
    },
    getResource: async (id: string, apiKey: string) => {
        return this.root.get(`${ process.env.CAPI_V2_URL }/content/v2/${ id }?api_key=${ apiKey }`);
    },
    getCollection: async (id: string, apiKey: string) => {
        return this.root.get(`${ process.env.CAPI_V2_URL }/content/v2/collection/${ id }?api_key=${ apiKey }`);
    },
    getSearch: async (args: object) => {
        const query = querystring.stringify(args);

        return this.root.get(`${ process.env.CAPI_V2_URL }/content/v2/?${ query }`);
    }
};

export { root };
