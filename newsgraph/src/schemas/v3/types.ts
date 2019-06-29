import { ITypeDefinitions } from 'graphql-tools/dist/Interfaces';

const typeDefs: ITypeDefinitions = `
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
    subscriptionSummary: V3Values
    references: JSON
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

    getV3Resources(ids: [String!]!, apiKey: String!): V3Results

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
}`;

export { typeDefs };
