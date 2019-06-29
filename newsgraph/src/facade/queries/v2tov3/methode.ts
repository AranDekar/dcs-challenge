import { query as fragments } from './fragments/partials/related';

const maxRelatedLevel = 2 + 1, // The level will immediately be decremented in the fragment so we need to add one.
  cachedFragment = fragments(maxRelatedLevel);

export const query = `
  query ($id: String!, $apiKey: String!, $domain: String, $includeDraft: Boolean, $includeFutureDated: Boolean, $bustTime: StringOrInt, $documentRevisionMajor: String, $documentRevisionMinor: String) {
    getV2(id: $id, apiKey: $apiKey, domain: $domain, includeDraft: $includeDraft, includeFutureDated: $includeFutureDated, bustTime: $bustTime, documentRevisionMajor: $documentRevisionMajor, documentRevisionMinor: $documentRevisionMinor) {
      ${ cachedFragment }
    }
  }
`;
