import { ITypeDefinitions } from 'graphql-tools/dist/Interfaces';

const typeDefs: ITypeDefinitions = `
scalar StringOrInt

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
  referenceType: String
}
type V2DomainLink {
  name: String
  link: String
}
type V2Category {
  value: String
  link: String
  id: String
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

type V2DynamicMetadata {
  linkOrigin: String
  metered: Boolean
  route: String
  link: String
  syndicated: Boolean
  adTarget: String
  sectionCaption: String
  available: Boolean
  canonical: String
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
  revision: String
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
  revision: String!
  status: V2Status!
  title: String!
  version: V2Version!

  originalSource: String
  paidStatus: V2PaidStatus
  primaryCategory: V2Category
  references: [V2Reference]

  dynamicMetadata: V2DynamicMetadata
  referenceType: String

  containerTypes: [String]
  description: String
  domainOriginUpdated: String
  format: String
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
  revision: String!
  status: V2Status!
  title: String!
  version: V2Version

  dynamicMetadata: V2DynamicMetadata

  authors: [String]
  containerTypes: [String]
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
  revision: String!
  status: V2Status!
  title: String!
  version: V2Version!

  authors: [String]
  originalSource: String
  paidStatus: V2PaidStatus
  primaryCategory: V2Category
  references: [V2Reference]

  dynamicMetadata: V2DynamicMetadata
  referenceType: String

  body: String
  caption: String
  containerTypes: [String]
  cssClassName: String
  description: String
  height: StringOrInt
  iframeUrl: String
  markupheight: String
  markupWidth: Int
  scrolling: String
  subtitle: String
  systemOriginUpdated: String
  type: String
  urlTitle: String
  userOriginUpdated: String
  width: StringOrInt
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
  revision: String!
  status: V2Status!
  title: String!
  version: V2Version!

  dynamicMetadata: V2DynamicMetadata
  referenceType: String
  references: [V2Reference]

  authors: [String]
  containerTypes: [String]
  cropName: String
  description: String
  domainOriginUpdated: String
  enterpriseAssetId: String
  format: String
  height: StringOrInt
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
  width: StringOrInt
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
  revision: String!
  status: V2Status!
  title: String!
  version: V2Version!

  dynamicMetadata: V2DynamicMetadata
  referenceType: String

  authors: [String]
  bylineNames: [String]
  channel: V2Channel
  containerTypes: [String]
  creditedSource: String
  cropName: String
  customDate: String
  description: String
  domainOriginUpdated: String
  format: String
  galleryDescription: String
  height: StringOrInt
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
  width: StringOrInt
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
  revision: String!
  status: V2Status!
  title: String!
  version: V2Version!

  dynamicMetadata: V2DynamicMetadata
  referenceType: String

  references: [V2Reference]
  authors: [String]
  link: String
  subtitle: String
  description: String
  originalSource: String
  paidStatus: V2PaidStatus
  primaryCategory: V2Category

  altKicker: String
  altTitle: String
  authorProfileIds: [String]
  body: String
  bulletList: [String]
  byline: String
  bylineNames: [String]
  bylineTitles: [String]
  channel: V2Channel
  commentsAllowed: Boolean
  commentsShown: Boolean
  containerTypes: [String]
  creditedSource: String
  customDate: String
  kicker: String
  originalAssetId: String
  seoHeadline: String
  socialTitle: String
  standFirst: String
  subscriptionSummary: String
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
  revision: String!
  status: V2Status!
  title: String!
  version: V2Version!

  authors: [String]
  originalSource: String
  paidStatus: V2PaidStatus
  primaryCategory: V2Category
  references: [V2Reference]

  dynamicMetadata: V2DynamicMetadata
  referenceType: String

  channel: V2Channel
  containerTypes: [String]
  cssClassName: String
  description: String
  displayStyle: String
  domainOriginUpdated: String
  originalAssetId: String
  promoLink: V2PromoLink
  promoText: String
  subtitle: String
  systemOriginUpdated: String
  urlTitle: String
  userOriginUpdated: String
}

type V2Video implements V2Resource {
  id: V2Id!
  authors: [String]
  paidStatus: V2PaidStatus
  references: [V2Reference]
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
  revision: String!
  status: V2Status!
  title: String!
  version: V2Version!

  dynamicMetadata: V2DynamicMetadata
  referenceType: String

  containerTypes: [String]
  description: String
  duration: Int
  primaryCategory: V2Category
  originalSource: String
  ooyalaId: String
  systemOriginUpdated: String
  userOriginUpdated: String
  subtitle: String
  urlTitle: String
  videoFiles: [String]

  images: [V2Image]
  thumbnailImage: V2Image
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
  revision: String!
  status: V2Status!
  systemOriginUpdated: String!
  title: String!
  urlTitle: String
  userOriginUpdated: String!
  version: V2Version!

  referenceType: String
  containerTypes: [String]
  originalSource: String
  paidStatus: V2PaidStatus
  primaryCategory: V2Category
}

type V2Null implements V2Resource {
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
  revision: String!
  status: V2Status!
  systemOriginUpdated: String!
  title: String!
  urlTitle: String
  userOriginUpdated: String!
  version: V2Version!

  referenceType: String
  containerTypes: [String]
  originalSource: String
  paidStatus: V2PaidStatus
  primaryCategory: V2Category
}

union V2Item = V2Null | V2NewsStory | V2Image | V2Blob | V2Component | V2Iframe | V2ImageGallery | V2Promo | V2Video | V2Collection

enum V2Sort {
  DATE_LIVE
  DATE_CREATED
  DATE_UPDATED
  RELEVANCE
}

type Query {
  getV2(id: String!, apiKey: String!, domain: String, includeDraft: Boolean, includeFutureDated: Boolean, bustTime: StringOrInt, documentRevisionMajor: String, documentRevisionMinor: String): V2Item
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
}`;

export { typeDefs };
