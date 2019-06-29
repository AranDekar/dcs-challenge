/// <reference types='node' />

// global types for Tabula
declare namespace Tabula {
    interface Callback {
        (err?: Error, result?: object | string): void;
    }

    interface Agent {
        (url: string, headers: any, cb: Tabula.Callback): void;
    }

    interface ApiResponse {
        url: string;
        status: number;
        headers: { [key: string]: string };
        body: string;
    }

    interface JsonApiResponse extends ApiResponse {
        jsonBody: any;
    }

    interface ExternalEvent {
        readonly id: string;
        readonly source: ExternalEvents.Source;
        readonly sourceId: string;
        readonly timeUTC: number;
        readonly kind: ExternalEvents.Kind;
    }

    type SourceType = string;
    
    namespace ExternalEvents {
        type Source = 'CAPI' | 'DECK';
        type Kind = 'UPDATE' | 'KILL' | 'DELETE';
    }

    interface CacheReadFn {
        (url: string, cb: Tabula.Callback): void;
    }

    interface CacheType {
        identify: Identifier,
        write: Function,
        xCacheTagHeaders: Function
    }

    // used to identify true or false for a match between an JsonApiResponse and a CacheType
    type Identifier = (jsonApiReponse: JsonApiResponse) => boolean;

    type TTLContentType = 'RESOURCE' | 'V2_RESOURCE' | 'V2_COLLECTION' | 'SEARCH' | 'V3_SEARCH' | 'ERROR' | 'V3_COLLECTION';

    interface TTLDeciderFn {
        (contentType: TTLContentType, statusCode: number): number;
    }

    type CAPIMember = {
        id: {
            value: string
        }
    };
    
    type CAPIType = {
        content: {
            contentType: string,
            origin: string,
            references: [ CAPIMember ]
        }
        results: [ CAPIMember ]
    };    
}

// allows us to handle JSON as modules in typescript
// see https://hackernoon.com/import-json-into-typescript-8d465beded79
declare module '*.json' {
    const value: any;
    export default value;
}
