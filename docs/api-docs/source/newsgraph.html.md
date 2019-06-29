---
title: Newsgraph API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell

toc_footers:
  - <a href='https://github.com/lord/slate'>Documentation Powered by Slate</a>

search: true
---
<a href='./index.html'>Go Back</a>

# Newsgraph Introduction

```shell
# Example GraphQL query with cUrl.
curl \
  -X POST <host>/graphql/v2 \
  -H "Content-Type: application/json" \
  --data @- << EOF
{
    "query": "query { 
        getV2Search(query: \"contentType:NEWS_STORY\", pageSize: 3, apiKey: \"<api key>\") {
            resultSize
            totalHits
            results {
                ... on V2NewsStory {
                    id {
                        value
                        link
                    }
                }
            }
        }
    }"
} 
EOF
```

Newsgraph is a <a href='https://graphql.org/learn/'>GraphQL</a> implementation built upon  <a href='https://github.com/graphql/express-graphql'>Express GraphQL</a>. Current endpoints:

- `/graphql/v2` GraphQL API for CAPI V2 API.
- `/graphql/v3` GraphQL API for CAPI V3 API.
- `/graphql/v3tov2` GraphQL for API CAPI V2 schema resolved from CAPI V3 API.
- `/facade/content/v2/...` A facade supporting some CAPI V2 API utilizing `/graphql/v3tov2`.

All calls are currently read-only and stateless. In Digital Delivery, we back Newsgraph with Tabula, so every call is cached for at most 15 minutes.

To understand how to start the code, see the README.md in git. This document describes usage. All examples are in the SIT environment. 

<aside class="notice">
A useful URL for looking at v3 articles is https://content-sit.api.news/v3/articles?api_key=wy745368rhtznnrprnqzp5dt.
</aside>

## Conventions

All queries need to pass in `api_key` for CAPI. For the facade functionality, this is as a query parameter. For GraphQL queries, as a variable. There are examples below.

## The GraphIQL Editor

GraphQL Express includes a visual tool for running queries against GraphQL endpoints called <a href="https://github.com/graphql/graphiql">GraphIQL</a>. The documents below provide examples of how to use them to shape queries.

<aside class="warning">
Please note that some of the example queries are a "WIP", as we await better data in the CAPI V3 SIT env and some finer points of the V3 Schema evolve.

Examples include a simplified query for the V3 Collection and avoiding all v3 Image queries (which return nulls where there should be data).
</aside>

# CAPI V3 GraphQL

## Get

`getV3(id: String!, apiKey: String!): V3`

## Advanced Search

`searchAdvance(
        type: V3Type,
        subtype: V3Subtype,
        categoriesAnySlug: String,
        targetSectionSlug: String,
        targetDisplaySlug: String,
        targetSectionId: String,
        targetDisplayId: String,
        keywords: String,
        targetDomain: String,
        accessType: String,
        locale: String,
        platformId: String,
        platformSystem: String,
        platformUserUpdated: String,
        platformSystemUpdated: String,
        platformParentId: String,
        platformAliasId: String,
        referenceId: String,
        referencePlatformId: String,
        headline: String,
        extendedHeadline: String,
        intro: String,
        standfirst: String,
        altText: String,
        caption: String,
        originatedSource: String,
        seoOwnerDomain: String,
        channel: String,
        authorsName: String,
        authorProfileId: String,
        aspectRatio: String,
        extendedMetadataSlugs: String,
        categoriesLocationContinent: String,
        categoriesLocationCountry: String,
        categoriesLocationState: String,
        categoriesLocationSuburb: String,
        seoTitle: String,
        showInactive: Boolean = false,
        showFutureDated: Boolean = false,
        showKilled: Boolean = false,
        showExpired: Boolean = false,
        includeArchived: Boolean = false,
        fetchDraftIfLatest: Boolean = false,
        showRoutesFor: Boolean = false,
        dateUpdatedFrom: String,
        dateUpdatedTo: String,
        dateLiveFrom: String,
        dateLiveTo: String,
        sortBy: V3SortBy = dateUpdated,
        sortOrder: V3SortOrder = ASC,
        page: Int = 1,
        size: Int = 20,
        basicReferences: Boolean = true,
        apiKey: String!
    ): V3Results`

## Examples

- <a href="http://newsgraph-sit.dcs.diguat.cp1.news.com.au/graphql/v3?query=%7B%0A%20%20getV3(id%3A%20%22839deb2c4c7024630910d4ef57d58f78%22%2C%20apiKey%3A%20%22wy745368rhtznnrprnqzp5dt%22)%20%7B%0A%20%20%20%20content%20%7B%0A%20%20%20%20%20%20...%20on%20V3Article%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20link%20%7B%0A%20%20%20%20%20%20%20%20%20%20self%0A%20%20%20%20%20%20%20%20%7D%0A%09%09%09%09headline%20%7B%20default%20%7D%0A%20%20%20%20%20%20%20%20body%20%7B%0A%20%20%20%20%20%20%20%20%20%20default%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A">Article</a>

- <a href="http://newsgraph-sit.dcs.diguat.cp1.news.com.au/graphql/v3?query=query%20%20%7B%20%20getV3(id%3A%20%22019895bf541e9df4e473f20e27186a13%22%2C%20apiKey%3A%20%22wy745368rhtznnrprnqzp5dt%22)%20%7B%20%20%20%20content%20%7B%20%20%20%20%20%20...%20on%20V3Video%20%7B%20%20%20%20%20%20%20%20id%20%20%20%20%20%20%20%20link%20%7B%20self%20%7D%20%20%20%20%20%20%20%20caption%20%20%20%20%20%20%7D%20%20%20%20%7D%20%20%7D%7D">Video</a>

- <a href="http://newsgraph-sit.dcs.diguat.cp1.news.com.au/graphql/v3?query=query%20%20%7BvideoBasicSearch(size%3A%202%2C%20page%3A%202%2C%20apiKey%3A%20%22wy745368rhtznnrprnqzp5dt%22)%20%7B%20%20%20%20totalHits%20%20%20%20size%20%20%20%20page%20%20%20%20hits%20%20%20%20results%20%7B%20%20%20%20%20%20...%20on%20V3Video%20%7B%20%20%20%20%20%20%20%20id%20%20%20%20%20%20%20%20link%20%7B%20self%20%7D%20%20%20%20%20%20%7D%20%20%20%20%7D%20%20%7D%7D">Basic Video Search</a>

- <a href="http://newsgraph-sit.dcs.diguat.cp1.news.com.au/graphql/v3?query=query%20%20%7B%0A%20%20searchAdvance(type%3A%20article%2C%20subtype%3A%20blog%2C%20size%3A%201%2C%20apiKey%3A%20%22wy745368rhtznnrprnqzp5dt%22)%20%7B%0A%20%20%20%20results%20%7B%0A%20%20%20%20%20%20...%20on%20V3Article%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20body%20%7B%20default%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0A%20%20%20%20%20%20%20">Advanced Search</a>

## Schema

```
scalar JSON

enum V3Type {
    article
    image
    collection
    video
    custom
    file
}

enum V3Subtype {
    news
    blog
    horoscope
    image_gallery
    video_gallery
    static
    animated
    component
    html
    iframe
    promo
    reference
    pdf
    any
}

enum V3Status {
    active
    inactive
    deleted
    killed
    expired
}

enum V3SortBy {
    dateUpdated
    dateLive
    dateCreated
    relevance
}

enum V3SortOrder {
    ASC
    DESC
}

type V3Platform {
    documentId: String
    parentId: String
    userUpdated: String
    systemUpdated: String
    instanceUpdated: String
}

type V3Date {
    live: String
    updated: String
    custom: String
    created: String
    processed: String
}

type V3Values {
    default: String!
}

type V3Links {
    self: String
    media: String
}

interface V3Content {
    id: String
    link: V3Links
    type: V3Type
    status: V3Status
    platform: V3Platform
    date: V3Date
}

type V3Article implements V3Content {
    id: String
    link: V3Links
    type: V3Type
    status: V3Status
    platform: V3Platform
    date: V3Date

    subtype: V3Subtype
    draft: Boolean
    body: V3Values
    headline: V3Values
    standfirst: V3Values
    intro: V3Values
    commentsAllowed: V3Values
    keywords: [String]
    target: JSON
    categories: JSON
}

type V3Image implements V3Content {
    id: String
    link: V3Links
    type: V3Type
    status: V3Status
    platform: V3Platform
    date: V3Date

    subtype: V3Subtype
    accessType: String
    caption: String
    altText: String
    mimeType: String
    invalidBin: Boolean
    width: Int
    height: Int
    cropName: String
    transformTranslateX: Int
    transformTranslateY: Int
    transformScaleHeight: Float
    transformScaleWidth: Float
}

type V3Video implements V3Content {
    id: String
    link: V3Links
    type: V3Type
    status: V3Status
    platform: V3Platform
    date: V3Date

    categories: JSON
    target: JSON
    keywords: [String]
    headline: V3Values
    standfirst: V3Values
    caption: String
    related: JSON
    references: JSON
}

type V3Collection implements V3Content {
    id: String
    link: V3Links
    type: V3Type
    status: V3Status
    platform: V3Platform
    date: V3Date

    subtype: V3Subtype
    draft: Boolean
    related: JSON
    references: JSON
}

type V3Results {
    results: [V3Item]
    totalHits: Int
    hits: Int
    size: Int
    page: Int
}

union V3Item = V3Article | V3Collection | V3Image | V3Video

type V3 {
    content: V3Item
}

type Query {
    getV3(id: String!, apiKey: String!): V3

    articleBasicSearch(
        showInactive: Boolean = false,
        showFutureDated: Boolean = false,
        showKilled: Boolean = false,
        showExpired: Boolean = false,
        includeArchived: Boolean = false,
        fetchDraftIfLatest: Boolean = false,
        showRoutesFor: Boolean = false,
        dateUpdatedFrom: String,
        dateUpdatedTo: String,
        dateLiveFrom: String,
        dateLiveTo: String,
        sortBy: V3SortBy = dateUpdated,
        sortOrder: V3SortOrder = ASC,
        page: Int = 1,
        size: Int = 20,
        apiKey: String!
    ): V3Results

    collectionBasicSearch(
        showInactive: Boolean = false,
        showFutureDated: Boolean = false,
        showKilled: Boolean = false,
        showExpired: Boolean = false,
        includeArchived: Boolean = false,
        fetchDraftIfLatest: Boolean = false,
        showRoutesFor: Boolean = false,
        dateUpdatedFrom: String,
        dateUpdatedTo: String,
        dateLiveFrom: String,
        dateLiveTo: String,
        sortBy: V3SortBy = dateUpdated,
        sortOrder: V3SortOrder = ASC,
        page: Int = 1,
        size: Int = 20,
        apiKey: String!
    ): V3Results

    imageBasicSearch(
        showInactive: Boolean = false,
        showFutureDated: Boolean = false,
        showKilled: Boolean = false,
        showExpired: Boolean = false,
        includeArchived: Boolean = false,
        fetchDraftIfLatest: Boolean = false,
        showRoutesFor: Boolean = false,
        dateUpdatedFrom: String,
        dateUpdatedTo: String,
        dateLiveFrom: String,
        dateLiveTo: String,
        sortBy: V3SortBy = dateUpdated,
        sortOrder: V3SortOrder = ASC,
        page: Int = 1,
        size: Int = 20,
        apiKey: String!
    ): V3Results

    videoBasicSearch(
        showInactive: Boolean = false,
        showFutureDated: Boolean = false,
        showKilled: Boolean = false,
        showExpired: Boolean = false,
        includeArchived: Boolean = false,
        fetchDraftIfLatest: Boolean = false,
        showRoutesFor: Boolean = false,
        dateUpdatedFrom: String,
        dateUpdatedTo: String,
        dateLiveFrom: String,
        dateLiveTo: String,
        sortBy: V3SortBy = dateUpdated,
        sortOrder: V3SortOrder = ASC,
        page: Int = 1,
        size: Int = 20,
        apiKey: String!
    ): V3Results

    searchAdvance(
        type: V3Type,
        subtype: V3Subtype,
        categoriesAnySlug: String,
        targetSectionSlug: String,
        targetDisplaySlug: String,
        targetSectionId: String,
        targetDisplayId: String,
        keywords: String,
        targetDomain: String,
        accessType: String,
        locale: String,
        platformId: String,
        platformSystem: String,
        platformUserUpdated: String,
        platformSystemUpdated: String,
        platformParentId: String,
        platformAliasId: String,
        referenceId: String,
        referencePlatformId: String,
        headline: String,
        extendedHeadline: String,
        intro: String,
        standfirst: String,
        altText: String,
        caption: String,
        originatedSource: String,
        seoOwnerDomain: String,
        channel: String,
        authorsName: String,
        authorProfileId: String,
        aspectRatio: String,
        extendedMetadataSlugs: String,
        categoriesLocationContinent: String,
        categoriesLocationCountry: String,
        categoriesLocationState: String,
        categoriesLocationSuburb: String,
        seoTitle: String,
        showInactive: Boolean = false,
        showFutureDated: Boolean = false,
        showKilled: Boolean = false,
        showExpired: Boolean = false,
        includeArchived: Boolean = false,
        fetchDraftIfLatest: Boolean = false,
        showRoutesFor: Boolean = false,
        dateUpdatedFrom: String,
        dateUpdatedTo: String,
        dateLiveFrom: String,
        dateLiveTo: String,
        sortBy: V3SortBy = dateUpdated,
        sortOrder: V3SortOrder = ASC,
        page: Int = 1,
        size: Int = 20,
        basicReferences: Boolean = true,
        apiKey: String!
    ): V3Results
}

schema {
    query: Query
}
```

# CAPI V2 GraphQL

## Get

`getV2(id: String!, apiKey: String!): V2Item`

## Search

`getV2Search(includeRelated: Boolean = false, maxRelated: Int, maxRelatedLevel: Int = 2, includeReferences: Boolean = false, includeBodies: Boolean = false, includeFutureDated: Boolean = false, includeDraft: Boolean = false, query: String, offset: Int, pageSize: Int, body: String, sort: V2Sort = DATE_LIVE, apiKey: String!): V2Collection`

## Examples

- <a href="http://newsgraph-sit.dcs.diguat.cp1.news.com.au/graphql/v2?query=query%20(%24id%3A%20String!%2C%20%24apiKey%3A%20String!)%20%7B%0A%20%20getV2(id%3A%20%24id%2C%20apiKey%3A%20%24apiKey)%20%7B%0A%20%20%20%20...%20on%20V2NewsStory%20%7B%0A%20%20%20%20%20%20contentType%0A%20%20%20%20%20%20id%20%7B%0A%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20link%0A%20%20%20%20%20%20channel%0A%20%20%20%20%20%20version%0A%20%20%20%20%20%20origin%0A%20%20%20%20%20%20originId%0A%20%20%20%20%20%20status%0A%20%20%20%20%20%20paidStatus%0A%20%20%20%20%20%20title%0A%20%20%20%20%20%20altTitle%0A%20%20%20%20%20%20subtitle%0A%20%20%20%20%20%20description%0A%20%20%20%20%20%20kicker%0A%20%20%20%20%20%20altKicker%0A%20%20%20%20%20%20standFirst%0A%20%20%20%20%20%20seoHeadline%0A%20%20%20%20%20%20socialTitle%0A%20%20%20%20%20%20subscriptionSummary%0A%20%20%20%20%20%20dateLive%0A%20%20%20%20%20%20dateUpdated%0A%20%20%20%20%20%20dateCreated%0A%20%20%20%20%20%20customDate%0A%20%20%20%20%20%20references%20%7B%0A%20%20%20%20%20%20%20%20id%20%7B%0A%20%20%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20origin%0A%20%20%20%20%20%20%20%20originId%0A%20%20%20%20%20%20%20%20contentType%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20keywords%0A%20%20%20%20%20%20authors%0A%20%20%20%20%20%20domains%0A%20%20%20%20%20%20bylineNames%0A%20%20%20%20%20%20commentsAllowed%0A%20%20%20%20%20%20creditedSource%0A%20%20%20%20%20%20originalSource%0A%20%20%20%20%20%20bulletList%0A%20%20%20%20%20%20bylineTitles%0A%20%20%20%20%20%20domainLinks%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20categories%20%7B%0A%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20primaryCategory%20%7B%0A%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20related%20%7B%0A%20%20%20%20%20%20%20%20...%20on%20V2Image%20%7B%0A%20%20%20%20%20%20%20%20%20%20contentType%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%20%20%20%20%0A%20%20%7D%0A%7D%0A&variables=%7B%0A%20%20%22apiKey%22%3A%20%227ukztsc3p3hgaxnduw7m8zc7%22%2C%0A%20%20%22id%22%3A%20%22c768972be8d2753d5378073b870d3e3f%22%0A%7D">Article</a>

- <a href="http://newsgraph-sit.dcs.diguat.cp1.news.com.au/graphql/v2?query=query%20(%24id%3A%20String!%2C%20%24apiKey%3A%20String!)%20%7B%0A%20%20getV2(id%3A%20%24id%2C%20apiKey%3A%20%24apiKey)%20%7B%0A%20%20%20%20...%20on%20V2Image%20%7B%0A%20%20%20%20%20%20id%20%7B%0A%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20description%0A%20%20%20%20%20%20link%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A&variables=%7B%0A%20%20%22id%22%3A%20%22e1de7b3ded42cccfb33a7bad0b8db766%22%2C%0A%20%20%22apiKey%22%3A%20%227ukztsc3p3hgaxnduw7m8zc7%22%0A%7D">Image</a>

- <a href="http://newsgraph-sit.dcs.diguat.cp1.news.com.au/graphql/v2?query=query%20(%24apiKey%3A%20String!)%20%7B%0A%20%20getV2Search(query%3A%20%22contentType%3AIMAGE%22%2C%20pageSize%3A%201%2C%20apiKey%3A%20%24apiKey)%20%7B%0A%20%20%20%20results%20%7B%0A%20%20%20%20%20%20...%20on%20V2Image%20%7B%0A%20%20%20%20%20%20%20%20id%20%7B%0A%20%20%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20description%0A%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A&variables=%7B%0A%20%20%22apiKey%22%3A%20%227ukztsc3p3hgaxnduw7m8zc7%22%0A%7D">Search</a>

## Schema

```
type V2Id {
  value: String
  link: String
}
enum V2ContentType {
  BLOB
  CATEGORY
  COLLECTION
  COMPONENT
  IFRAME
  IMAGE_GALLERY
  IMAGE
  NEWS_STORY
  PROMO
  VIDEO
}
enum V2Version {
  DRAFT
  PUBLISHED
}
enum V2Status {
  ACTIVE
  INACTIVE
  DELETED
  KILLED
}
enum V2PaidStatus {
  NON_PREMIUM
  PREMIUM
}
type V2Reference {
  contentType: V2ContentType
  id: V2Id
  origin: String
  originId: String
}
type V2DomainLink {
  name: String
  link: String
}
type V2Category {
  value: String
  link: String
}
enum V3Channel {
  web
  tablet
  mobile
  social
}
enum V2Channel {
  NONE
  PRINT
  WEB
  TABLET
  none
  print
  web
  tablet
}

type V2PromoLink {
  altText: String
  otherPromoLinks: [V2PromoLink]
  text: String
  url: String
}

interface V2Resource {
  id: V2Id
  categories: [V2Category]
  contentType: V2ContentType
  dateCreated: String
  dateLive: String
  dateUpdated: String
  domainLinks: [V2DomainLink]
  domains: [String]
  keywords: [String]
  origin: String
  originId: String
  related: [V2Item]
  revision: Int
  status: V2Status
  title: String
  version: V2Version
}

type V2Blob implements V2Resource {
  id: V2Id!
  authors: [String]
  categories: [V2Category]!
  contentType: V2ContentType!
  dateCreated: String!
  dateLive: String!
  dateUpdated: String!
  domainLinks: [V2DomainLink]!
  domains: [String]!
  keywords: [String]!
  link: String
  origin: String!
  originId: String!
  related: [V2Item]!
  revision: Int!
  status: V2Status!
  title: String!
  version: V2Version!

  description: String
  domainOriginUpdated: String
  format: String
  originalSource: String
  subtitle: String
  systemOriginUpdated: String
  urlTitle: String
  userOriginUpdated: String
}

type V2Component implements V2Resource {
  id: V2Id!
  categories: [V2Category]!
  contentType: V2ContentType
  dateCreated: String!
  dateLive: String!
  dateUpdated: String!
  domainLinks: [V2DomainLink]!
  domains: [String]!
  keywords: [String]!
  origin: String!
  originId: String!
  related: [V2Item]!
  revision: Int!
  status: V2Status!
  title: String!
  version: V2Version

  authors: [String]
  description: String
  domainOriginUpdated: String
  originalSource: String
  paidStatus: V2PaidStatus
  subtitle: String
  systemOriginUpdated: String
  urlTitle: String
  userOriginUpdated: String
}

type V2Iframe implements V2Resource {
  id: V2Id!
  categories: [V2Category]!
  contentType: V2ContentType!
  dateCreated: String!
  dateLive: String!
  dateUpdated: String!
  domainLinks: [V2DomainLink]!
  domains: [String]!
  keywords: [String]!
  origin: String!
  originId: String!
  related: [V2Item]!
  revision: Int!
  status: V2Status!
  title: String!
  version: V2Version!

  caption: String
  description: String
  height: String
  markupHeight: Int
  markupWidth: Int
  subtitle: String
  systemOriginUpdated: String
  type: String
  urlTitle: String
  userOriginUpdated: String
  width: String
}

type V2Image implements V2Resource {
  id: V2Id!
  categories: [V2Category]!
  contentType: V2ContentType!
  dateCreated: String!
  dateLive: String!
  dateUpdated: String!
  domainLinks: [V2DomainLink]!
  domains: [String]!
  keywords: [String]!
  origin: String!
  originId: String!
  related: [V2Item]!
  revision: Int!
  status: V2Status!
  title: String!
  version: V2Version!

  authors: [String]
  containerTypes: [String]
  cropName: String
  description: String
  domainOriginUpdated: String
  enterpriseAssetId: String
  format: String
  height: Int
  imageName: String
  imageType: String
  link: String
  originalSource: String
  paidStatus: V2PaidStatus
  primaryCategory: V2Category
  sourceImageId: String
  subtitle: String
  systemOriginUpdated: String
  urlTitle: String
  userOriginUpdated: String
  width: Int
}

type V2ImageGallery implements V2Resource {
  id: V2Id!
  categories: [V2Category]!
  contentType: V2ContentType!
  dateCreated: String!
  dateLive: String!
  dateUpdated: String!
  domainLinks: [V2DomainLink]!
  domains: [String]!
  keywords: [String]!
  origin: String!
  originId: String!
  related: [V2Item]!
  revision: Int!
  status: V2Status!
  title: String!
  version: V2Version!

  authors: [String]
  bylineNames: [String]
  channel: V2Channel
  creditedSource: String
  cropName: String
  customDate: String
  description: String
  domainOriginUpdated: String
  format: String
  galleryDescription: String
  height: Int
  imageType: String
  kicker: String
  link: String
  originalSource: String
  paidStatus: V2PaidStatus
  primaryCategory: V2Category
  references: [V2Reference]
  seoHeadline: String
  socialTitle: String
  sourceImageId: String
  subtitle: String
  systemOriginUpdated: String
  urlTitle: String
  userOriginUpdated: String
  width: Int
}

type V2NewsStory implements V2Resource {
  id: V2Id!
  categories: [V2Category]!
  contentType: V2ContentType!
  dateCreated: String!
  dateLive: String!
  dateUpdated: String!
  domainLinks: [V2DomainLink]!
  domains: [String]!
  keywords: [String]!
  origin: String!
  originId: String!
  related: [V2Item]!
  revision: Int!
  status: V2Status!
  title: String!
  version: V2Version!

  altKicker: String
  altTitle: String
  authors: [String]
  body: String
  bulletList: [String]
  byline: String
  bylineNames: [String]
  bylineTitles: [String]
  channel: V2Channel
  commentsAllowed: Boolean
  creditedSource: String
  customDate: String
  description: String
  kicker: String
  link: String
  originalAssetId: String
  originalSource: String
  paidStatus: V2PaidStatus
  primaryCategory: V2Category
  references: [V2Reference]
  seoHeadline: String
  socialTitle: String
  standFirst: String
  subscriptionSummary: String
  subtitle: String
  systemOriginUpdated: String
  thumbnailImage: V2Image
  userOriginUpdated: String
}

type V2Promo implements V2Resource {
  id: V2Id!
  categories: [V2Category]!
  contentType: V2ContentType!
  dateCreated: String!
  dateLive: String!
  dateUpdated: String!
  domainLinks: [V2DomainLink]!
  domains: [String]!
  keywords: [String]!
  origin: String!
  originId: String!
  related: [V2Item]!
  revision: Int!
  status: V2Status!
  title: String!
  version: V2Version!

  authors: [String]
  channel: V2Channel
  description: String
  displayStyle: String
  domainOriginUpdated: String
  originalAssetId: String
  paidStatus: V2PaidStatus
  primaryCategory: V2Category
  promoLink: V2PromoLink
  promoText: String
  references: [V2Reference]
  subtitle: String
  systemOriginUpdated: String
  urlTitle: String
  userOriginUpdated: String
}

type V2Video implements V2Resource {
  id: V2Id!
  categories: [V2Category]!
  contentType: V2ContentType!
  dateCreated: String!
  dateLive: String!
  dateUpdated: String!
  domainLinks: [V2DomainLink]!
  domains: [String]!
  keywords: [String]!
  origin: String!
  originId: String!
  related: [V2Item]!
  revision: Int!
  status: V2Status!
  title: String!
  version: V2Version!

  description: String
  duration: Int
  images: [V2Image]
  primaryCategory: V2Category
  originalSource: String
  systemOriginUpdated: String
  userOriginUpdated: String
  subtitle: String
  urlTitle: String
  videoFiles: [String]
}

type V2Collection {
  content: V2Content
  offset: Int
  pageSize: Int
  results: [V2Item]
  resultSize: Int
  totalHits: Int
}

type V2Content implements V2Resource {
  id: V2Id!
  authors: [String]!
  categories: [V2Category]!
  contentType: V2ContentType!
  dateCreated: String!
  dateLive: String!
  dateUpdated: String!
  domainLinks: [V2DomainLink]!
  domains: [String]!
  keywords: [String]!
  origin: String!
  originId: String!
  references: [V2Reference]
  related: [V2Item]!
  revision: Int!
  status: V2Status!
  systemOriginUpdated: String!
  title: String!
  urlTitle: String
  userOriginUpdated: String!
  version: V2Version!
}

union V2Item = V2NewsStory | V2Image | V2Blob | V2Component | V2Iframe | V2ImageGallery | V2Promo | V2Video | V2Collection

enum V2Sort {
  DATE_LIVE
  DATE_CREATED
  DATE_UPDATED
  RELEVANCE
}

type Query {
  getV2(id: String!, apiKey: String!, product: String, channel: String): V2Item
  getV2Collection(id: String!, apiKey: String!): V2Collection
  getV2Search(
    includeRelated: Boolean = false,
    maxRelated: Int,
    maxRelatedLevel: Int = 2,
    includeReferences: Boolean = false,
    includeBodies: Boolean = false,
    includeFutureDated: Boolean = false,
    includeDraft: Boolean = false,
    query: String,
    offset: Int,
    pageSize: Int,
    body: String,
    sort: V2Sort = DATE_LIVE,
    apiKey: String!): V2Collection
}

schema {
  query: Query
}
```

# CAPI Facade (V3 to v2)

These behaviours mimic the CAPI v2 API but produce results with v3 data. They follow an architectural pattern called <a href="https://en.wikipedia.org/wiki/Facade_pattern">Facade</a>. They exist to help the business save time from refactoring logic, where appropriate, to shift to CAPI v3.

## GET /content/v2/methode/:id?api_key=:api_key

Parameter |	Description
--------- | -----------
id | The v3 id of an article to represent as v2
api_key | The identifying API key for v3 access

```shell
curl http://newsgraph-sit.dcs.diguat.cp1.news.com.au/facade/content/v2/methode/a4e29ce54a5e36599ca6491a77d43d8b?api_key=wy745368rhtznnrprnqzp5dt
```

### HTTP Request

`GET http://newsgraph-sit.dcs.diguat.cp1.news.com.au/facade/content/v2/methode/a4e29ce54a5e36599ca6491a77d43d8b?api_key=wy745368rhtznnrprnqzp5dt`

This GET results in an internal POST to Newsgraph that has a simple inbuilt GraphQL query that can map a v3 article to a v2 representation.

## GET /content/v2/collection/:id?api_key=:api_key

Parameter |	Description
--------- | -----------
id | The v3 id of a collection to represent as v2
api_key | The identifying API key for v3 access

```shell
curl http://newsgraph-sit.dcs.diguat.cp1.news.com.au/facade/content/v2/collection/770ac80729751958f58bb19351587874?api_key=wy745368rhtznnrprnqzp5dt
```

### HTTP Request

`GET http://newsgraph-sit.dcs.diguat.cp1.news.com.au/facade/content/v2/collection/566d3fa1dc71d4b7d79babffa8fcc10c?api_key=wy745368rhtznnrprnqzp5dt`

This GET results in an internal POST to Newsgraph that has a simple inbuilt GraphQL query that can map a v3 collection to a v2 representation.

## GET /content/v2/?query=&api_key=:api_key

<aside class="notice">
Integration with CAPI V3 search is not yet done.

See <a href="http://dashboard.news.com.au/browse/DCS-419">DCS-419</a>
</aside>

Parameter |	Description
--------- | -----------
query | 
api_key | The identifying API key for v3 access


# CAPI V3 to V2 GraphQL

<aside class="notice">
Integration with CAPI V3 search is not yet done.

See <a href="http://dashboard.news.com.au/browse/DCS-419">DCS-419</a>
</aside>

The Facade queries above use these GraphQL queries to convert v3 data into v2 representations.

## Example

- <a href="http://newsgraph-sit.dcs.diguat.cp1.news.com.au/graphql/v3tov2?query=query%20(%24id%3A%20String!%2C%20%24apiKey%3A%20String!)%20%7B%0A%20%20getV2(id%3A%20%24id%2C%20apiKey%3A%20%24apiKey)%20%7B%0A%20%20%20%20...%20on%20V2NewsStory%20%7B%0A%20%20%20%20%20%20id%20%7B%0A%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20contentType%0A%20%20%20%20%20%20references%20%7B%0A%20%20%20%20%20%20%20%20id%20%7B%0A%20%20%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20origin%0A%20%20%20%20%20%20%20%20originId%0A%20%20%20%20%20%20%20%20contentType%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20domainLinks%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20categories%20%7B%0A%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20primaryCategory%20%7B%0A%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20related%20%7B%0A%20%20%20%20%20%20%20%20...%20on%20V2Image%20%7B%0A%20%20%20%20%20%20%20%20%20%20id%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20contentType%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20...%20on%20V2NewsStory%20%7B%0A%20%20%20%20%20%20%20%20%20%20id%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20contentType%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20...%20on%20V2Video%20%7B%0A%20%20%20%20%20%20%20%20%20%20id%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20%20%20%20%20link%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20contentType%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20altKicker%0A%20%20%20%20%20%20altTitle%0A%20%20%20%20%20%20authors%0A%20%20%20%20%20%20body%0A%20%20%20%20%20%20bulletList%0A%20%20%20%20%20%20byline%0A%20%20%20%20%20%20bylineNames%0A%20%20%20%20%20%20bylineTitles%0A%20%20%20%20%20%20channel%0A%20%20%20%20%20%20commentsAllowed%0A%20%20%20%20%20%20creditedSource%0A%20%20%20%20%20%20customDate%0A%20%20%20%20%20%20dateCreated%0A%20%20%20%20%20%20dateLive%0A%20%20%20%20%20%20dateUpdated%0A%20%20%20%20%20%20description%0A%20%20%20%20%20%20domains%0A%20%20%20%20%20%20keywords%0A%20%20%20%20%20%20kicker%0A%20%20%20%20%20%20link%0A%20%20%20%20%20%20origin%0A%20%20%20%20%20%20originalSource%0A%20%20%20%20%20%20originId%0A%20%20%20%20%20%20paidStatus%0A%20%20%20%20%20%20seoHeadline%0A%20%20%20%20%20%20socialTitle%0A%20%20%20%20%20%20standFirst%0A%20%20%20%20%20%20status%0A%20%20%20%20%20%20subscriptionSummary%0A%20%20%20%20%20%20subtitle%0A%20%20%20%20%20%20systemOriginUpdated%0A%20%20%20%20%20%20title%0A%20%20%20%20%20%20userOriginUpdated%0A%20%20%20%20%20%20version%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0A%0A%23%20query%20%20%7B%0A%23%20%09videoBasicSearch(apiKey%3A%20%22wy745368rhtznnrprnqzp5dt%22)%20%7B%0A%23%20%20%20%20%20totalHits%0A%23%20%20%20%20%20size%0A%23%20%20%20%20%20page%0A%23%20%20%20%20%20hits%0A%23%20%20%20%20%20results%20%7B%0A%23%20%20%20%20%20%20%20...%20on%20V3Video%20%7B%0A%23%20%20%20%20%20%20%20%20%20id%0A%23%20%20%20%20%20%20%20%7D%0A%23%20%20%20%20%20%7D%0A%23%20%20%20%7D%0A%23%20%7D%0A%0A%20%20%20%20%20%20%20&variables=%7B%0A%20%20%22id%22%3A%20%22839deb2c4c7024630910d4ef57d58f78%22%2C%0A%20%20%22apiKey%22%3A%20%22wy745368rhtznnrprnqzp5dt%22%0A%7D">Article</a>.

