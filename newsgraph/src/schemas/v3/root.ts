import * as request from 'request-promise';
import * as querystring from 'querystring';
import * as url from 'url';

const root: V3Root = {
    get: async (url: string) => {
        const body = await request.get(url);

        const payload = JSON.parse(body);

        return payload;
    },
    getResources: async (ids: string[], apiKey: string, domain: string, includeDraft: boolean = false) => {
        let json;

        const stringifiedIds = ids.join(),
            fetchDraftIfLatest = includeDraft,
            showFutureDated = includeDraft;

        json = await this.root.get(`${ process.env.CAPI_V3_URL }/v3/search/id/${ stringifiedIds }?api_key=${ apiKey }&fetchDraftIfLatest=${ fetchDraftIfLatest }&showFutureDated=${ showFutureDated }`);
        return json;
    },
    getResource: async (id: string, apiKey: string, domain: string, includeDraft: boolean = false, includeFutureDated: boolean = false, bustTime: any, documentRevisionMajor: string, documentRevisionMinor: string) => {
        let json;

        const split = id.split(/[:.]/),
            origin = split[1],
            platformId = split[2],
            fetchDraftIfLatest = includeDraft,
            showFutureDated = includeFutureDated;

        switch (origin) {
            // Add support for Methode url: /v2/methode/origin:methode.9f46be1c-f9a6-11e8-99fe-39ea762d0e55
            case 'methode':
            // Add support for Fatwire urls: /v2/methode/origin:fatwire.1227592931248?
            case 'fatwire':
                json = await this.root.get(`${ process.env.CAPI_V3_URL }/v3/search?type=article,collection&platformId=${ platformId }&api_key=${ apiKey }&fetchDraftIfLatest=${ fetchDraftIfLatest }&showFutureDated=${ showFutureDated }&includeArchived=true`);

                if (!json.results) {
                    throw 'Entity not found';
                }

                const selfLink = json.results[0].link.self;
                const path = url.parse(selfLink).pathname;

                return this.root.get(`${ process.env.CAPI_V3_URL }${ path }?api_key=${ apiKey }&fetchDraftIfLatest=${ fetchDraftIfLatest }&showFutureDated=${ showFutureDated }`);
            default:
                return await this.root.get(`${ process.env.CAPI_V3_URL }/v3/articles/${ id }?api_key=${ apiKey }&fetchDraftIfLatest=${ fetchDraftIfLatest }&showFutureDated=${ showFutureDated }`).catch((error: Error) => {
                    return this.root.get(`${ process.env.CAPI_V3_URL }/v3/collections/${ id }?api_key=${ apiKey }&fetchDraftIfLatest=${ fetchDraftIfLatest }&showFutureDated=${ showFutureDated }`).catch((error: Error) => {
                        throw 'Entity not found';
                    });
                });
        }

    },
    getResourceRevision: async (id: string, apiKey: string, documentRevisionMajor: string, documentRevisionMinor: string) => {
        return this.root.get(`${ process.env.CAPI_V3_URL }/v3/documents/histories/${ id }/${ documentRevisionMajor }/${ documentRevisionMinor }?version=publish&api_key=${ apiKey }`);
    },
    getCollection: async (id: string, apiKey: string) => {
        return this.root.get(`${ process.env.CAPI_V3_URL }/v3/collections/${ id }?api_key=${ apiKey }`);
    },
    articleBasicSearch: async (args: object) => {
        const query = querystring.stringify(args);

        return this.root.get(`${ process.env.CAPI_V3_URL }/v3/articles?${ query }`);
    },
    collectionBasicSearch: async (args: object) => {
        const query = querystring.stringify(args);

        return this.root.get(`${ process.env.CAPI_V3_URL }/v3/collections?${ query }`);
    },
    imageBasicSearch: async (args: object) => {
        const query = querystring.stringify(args);

        return this.root.get(`${ process.env.CAPI_V3_URL }/v3/images?${ query }`);
    },
    videoBasicSearch: async (args: object) => {
        const query = querystring.stringify(args);

        return this.root.get(`${ process.env.CAPI_V3_URL }/v3/videos?${ query }`);
    },
    searchAdvance: async (args: object) => {
        const query = querystring.stringify(args);

        return this.root.get(`${ process.env.CAPI_V3_URL }/v3/search?${ query }`);
    },
    getSearch: async (args: object) => {
        throw 'not implemented (pending query mapping).';
    }
};

export { root };
