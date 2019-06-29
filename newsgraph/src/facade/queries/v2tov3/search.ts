export const query = `
query (
  $includeRelated: Boolean,
  $maxRelated: Int,
  $maxRelatedLevel: Int,
  $includeReferences: Boolean,
  $includeBodies: Boolean,
  $includeFutureDated: Boolean,
  $includeDraft: Boolean,
  $query: String,
  $offset: Int,
  $pageSize: Int,
  $body: String,
  $sort: V2Sort,
  $apiKey: String!) {
  getV2Search(
    includeRelated: $includeRelated,
    maxRelated: $maxRelated,
    maxRelatedLevel: $maxRelatedLevel,
    includeReferences: $includeReferences,
    includeBodies: $includeBodies,
    includeFutureDated: $includeFutureDated,
    includeDraft: $includeDraft,
    query: $query,
    offset: $offset,
    pageSize: $pageSize,
    body: $body,
    sort: $sort,
    apiKey: $apiKey
  ) {
    resultSize
    totalHits
    results{
      ... on V2NewsStory {
        id {
          value
          link
        }
      }
    }
  }
}`;
