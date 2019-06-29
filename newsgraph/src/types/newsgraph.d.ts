/// <reference types='node' />

// error TS2304: Cannot find name 'XMLHttpRequest'
declare interface XMLHttpRequest {}

// error TS2304: Cannot find name 'Blob'
declare interface Blob {}

declare module '*.json' {
    const value: any;
    export default value;
}

declare interface V3Root {
    get(url: string): object;
    getResources(ids: string[], apiKey: string, domain: string, includeDraft: boolean): object;
    getResource(id: string, apiKey: string, domain: string, includeDraft: boolean, includeFutureDated: boolean, bustTime: any, documentRevisionMajor: string, documentRevisionMinor: string): object;
    getResourceRevision(id: string, apiKey: string, documentRevisionMajor: string, documentRevisionMinor: string): object;
    getCollection(id: string, apiKey: string): object;
    getSearch(args: object): object;
    articleBasicSearch(args: object): object;
    collectionBasicSearch(args: object): object;
    imageBasicSearch(args: object): object;
    videoBasicSearch(args: object): object;
    searchAdvance(args: object): object;
}