import { query as fragments } from './fragments/partials/related';

export const query = `
query ($id: String!, $apiKey: String!) {
    getV2Collection(id: $id, apiKey: $apiKey) {
        content {
            contentType
            id { value link }
            domainLinks { name link }
            categories { value link }
            references {
                id { value link }
                origin
                originId
                contentType
            }
            related {
                ${ fragments(2) }
            }
            authors
            dateCreated
            dateLive
            dateUpdated
            domains
            keywords
            origin
            originId
            revision
            status
            title
            urlTitle
            version
        }
        offset
        pageSize
        resultSize
        totalHits
        totalHits
        results {
            ${ fragments(2) }
        }
    }
}`;
