import { IResolvers } from 'graphql-tools/dist/Interfaces';
import * as R from 'ramda';

const maybeContent = (path: ( string | number )[], obj: object) => {
    return (R.path(['content', ...path], obj) || R.path(path, obj));
};

const maybeContentOr = (or: any, path: ( string | number )[], obj: object): any => {
    return (maybeContent(path, obj) || or);
};

const mapId = (obj: any) => {
    return maybeContent(['id'], obj);
};

const mapLink = (context: any, info: any, obj: any) => {
    const id      = mapId(obj);
    const baseUrl = `http://${ context.get('Host') }/facade/content/v2/`;

    switch (mapType(obj)) {
        case('COLLECTION'): { return baseUrl + `collection/${ id }`;  }
        default: {
            if (info.variableValues.domain) {
                return baseUrl + `methode/${ id }?domain=${ info.variableValues.domain }`;
            } else {
                return baseUrl + `methode/${ id }`;
            }
        }
    }
};

const mapType = (obj: any | undefined) => {
    const type    = maybeContent(['type'], obj);
    const subtype = maybeContent(['subtype'], obj);

    switch (type) {
        case('article'): { return 'NEWS_STORY'; }
        case('video'): { return 'VIDEO'; }
        case('image'): { return 'IMAGE'; }
        case('collection'): {
            switch (subtype) {
                case('image_gallery'): { return 'IMAGE_GALLERY'; }
                default: return 'COLLECTION';
            }
        }
        case('file'): { return 'BLOB'; }
        case('custom'): {
            switch (subtype) {
                case('html'): { return 'IFRAME'; }
                case('promo'): { return 'PROMO'; }
                case('iframe'): { return 'IFRAME'; }
                default: { throw `unknown "subtype": ${ subtype }`; }
            }
        }
        default: { throw `unknown "type": ${ type }`; }
    }
};

const mapStatus = (status: string | undefined) => {
    switch (status) {
        case('active'): { return 'ACTIVE'; }
        case('expired'):
        case('deleted'): { return 'DELETED'; }
        case('killed'): { return 'KILLED'; }
        case('inactive'): { return 'INACTIVE'; }
        default: { throw `unknown "status": ${ status }`; }
    }
};

const mapAccessType = (accessType: string | undefined) => {
    switch (accessType) {
        case('free'): { return 'NON_PREMIUM'; }
        case('premium'): { return 'PREMIUM'; }
        default: { throw `unknown "accessType": ${ accessType }`; }
    }
};

const mapDraft = (draft: boolean | undefined) => {
    switch (draft) {
        case(true): { return 'DRAFT'; }
        case(false): { return 'PUBLISHED'; }
        default: { throw `unknown "draft": ${ draft }`; }
    }
};

const mapArticleLink = (obj: any, info: any) => {
    const canonical = maybeContent(['link', 'canonical'], obj);

    if (canonical) {
        return canonical;
    } else {
        const domainLinks = maybeContentOr({}, ['target', 'domainLinks'], obj);

        const domainLink = R.path([info.variableValues.domain, 'link'], domainLinks);

        if (domainLink) {
            return domainLink;
        } else {
            const firstDomain  =  Object.keys(domainLinks)[0];

            const link = R.path([firstDomain, 'link'], domainLinks);

            return link;
        }
    }
};

const mapAuthors = (authors: { name: string }[]) => {
    if (R.isNil(authors)) return [];

    return R.map((author) => { return author.name; }, authors);
};

const mapDomainLinks = (domainLinks: any) => {
    if (R.isNil(domainLinks)) return [];

    return R.map((name) => { return { name: name, link: domainLinks[name].link }; }, Object.keys(domainLinks));
};

const mapCategories = (obj: any) => {
    const categories: any = R.flatten(R.values(maybeContentOr({}, ['categories'], obj)));

    const displays = maybeContentOr([], ['target', 'displays'], obj).map((display: any) => {
        return R.merge(display, { path: display.path + '/' });
    });

    const sections = maybeContentOr([], ['target', 'sections'], obj).map((section: any) => {
        if (section.path.includes('/Web/NewsNetwork/')) {
            const path = section.path.replace(/(\/section\/main\/)|(\/section\/aux\/)/, '/display/') + '/';

            return R.merge(section, { path: path });
        } else {
            return section;
        }
    });

    return R.map(
        (category) => { return R.merge({ ofType: 'V2Category' }, category); },
        displays.concat(sections.concat(categories)));
};

const mapPrimaryCategory = (obj: any) => {
    const sections = maybeContentOr([], ['target', 'sections'], obj);

    if (R.isEmpty(sections)) return {};

    for (const section of sections) {
        if (section.path.includes('/section/main/')) {
            const path = section.path.replace(/(\/section\/main\/)/, '/display/') + '/';

            return  R.merge({ ofType: 'V2Category' }, R.merge(section, {path: path}));
        }
    }

    return {};
};

const mapThumbnailImage = (obj: any) => {
    const id: string =  maybeContentOr(undefined, ['related', 'thumbnail', 'default', 0], obj);

    if (R.isNil(id)) return;

    return R.merge({ ofType: 'V2Image' }, maybeContent(['references', id], obj));
};

const mapReferences = (obj: any) => {
    if (R.isNil(maybeContent(['references'], obj))) return [];

    return R.reject(
        R.propEq('classification', 'rejected'),
        R.map(
            (id) => { return R.merge({ ofType: 'V2Reference' }, maybeContent(['references', id], obj)); },
            Object.keys(maybeContentOr({}, ['references'], obj))));
};

const mapRelated = (obj: any) => {
    const ids = R.keys(maybeContentOr({}, ['references'], obj));

    const items = R.map(
        (id) => {
            const item = maybeContentOr({}, ['references', <string>id], obj);

            if (R.contains(id, maybeContentOr([], ['related', 'primary', 'default'], obj))) {
                item['containerTypes'] = ['PRIMARY'];
                item['imageType'] = 'PRIMARY';
            } else if (R.contains(id, maybeContentOr([], ['related', 'thumbnail', 'default'], obj))) {
                item['containerTypes'] = ['SUBSTITUTE'];
                item['imageType'] = 'SUBSTITUTE';
            } else if (R.contains(id, maybeContentOr([], ['related', 'optional', 'default'], obj))) {
                item['containerTypes'] = ['TERTIARY'];
                item['imageType'] = 'IMAGE';
            } else {
                item['containerTypes'] = ['EMBEDDED'];
                item['imageType'] = 'EMBEDDED';
            }

            return R.merge({ ofType: 'V2Item' }, item);
        }, ids
    );

    return R.filter(
        (obj) => { return R.contains(R.pathOr('TODO', ['type'], obj), ['image', 'video', 'custom', 'article']); },
        items
    );
};

const mapVideoImages = async (obj: any, info: any) => {
    const url = `${obj.link.self}?api_key=${info.variableValues.apiKey}`;
    const json = await info.rootValue.get(url);
    const refs = R.values(json.content.references);

    return refs.map((ref) => {
        if (R.contains(ref.id, maybeContentOr([], ['related', 'primary', 'default'], json))) {
            ref['imageType'] = 'HERO';
        } else if (R.contains(ref.id, maybeContentOr([], ['related', 'thumbnail', 'default'], json))) {
            ref['imageType'] = 'THUMBNAIL';
        } else {
            ref['imageType'] = 'SOURCE';
        }

        return R.merge({ ofType: 'V2Item' }, ref);
    });
};

const mapDomains = (obj: any) => {
    return R.reject(R.equals('_ANY'), maybeContentOr([], ['target', 'domains'], obj));
};

const mapPromoHref = (obj: any) => {
    const regex = /href="([^"]+)/;
    const match = regex.exec(maybeContentOr('TODO', ['promoAnchor'], obj));

    return (match || [])[1];
};

const mapResults = async (obj: any, args: any, context: any, info: any) => {
    const ids = maybeContentOr([], ['related', 'primary', 'default'], obj);
    const items = [];

    for (const idx in ids) {
        const link = maybeContentOr(undefined, ['references', ids[idx], 'link', 'self'], obj);
        const url = `${ link }?api_key=${ info.variableValues.apiKey }`;

        items.push(info.rootValue.get(url));
    }

    return items;
};

const defaultResolvers: object = {
    id(obj: any, _: any, context: any, info: any) { return { value: mapId(obj), link: mapLink(context, info, obj) }; },
    contentType(obj: any)                   { return mapType(obj); },
    // customDate(obj)                      { return maybeContent(['date', 'custom'], obj); },
    dateCreated(obj: any)                   { return maybeContentOr(new Date(), ['date', 'created'], obj); },
    dateLive(obj: any)                      { return maybeContentOr(new Date(), ['date', 'live'], obj); },
    dateUpdated(obj: any)                   { return maybeContentOr(new Date(), ['date', 'updated'], obj); },

    authors(obj: any)                       { return R.uniq(mapAuthors(maybeContentOr([], ['authors'], obj))); },
    categories(obj: any)                    { return mapCategories(obj); },
    containerTypes(obj: any)                { return maybeContentOr(['EMBEDDED'], ['containerTypes'], obj); },
    domainLinks(obj: any)                   { return mapDomainLinks(maybeContent(['target', 'domainLink'], obj) || maybeContent(['target', 'domainLinks'], obj)); },
    domains(obj: any)                       { return mapDomains(obj); },
    keywords(obj: any)                      { return maybeContentOr([], ['keywords'], obj); },
    originalSource(obj: any)                { return maybeContent(['rightsMetadata', 'originatedSource'], obj); },
    paidStatus(obj: any)                    { return mapAccessType(maybeContentOr('free', ['accessType'], obj)); },
    primaryCategory(obj: any)               { return mapPrimaryCategory(obj); },
    references(obj: any)                    { return mapReferences(obj); },
    related(obj: any)                       { return mapRelated(obj); },
    revision(obj: any)                      { return maybeContentOr(0, ['revision', 'major'], obj).toString(); },
    status(obj: any)                        { return mapStatus(maybeContentOr('active', ['status'], obj)); },
    version(obj: any)                       { return mapDraft(maybeContentOr(false, ['draft'], obj)); },

    origin(obj: any)                        { return maybeContentOr('', ['platform', 'system'], obj).toUpperCase(); },
    originId(obj: any)                      { return maybeContent(['platform', 'id'], obj); },
    systemOriginUpdated(obj: any)           { return maybeContentOr('', ['platform', 'systemUpdated'], obj).toUpperCase(); },
    userOriginUpdated(obj: any)             { return maybeContent(['platform', 'userUpdated'], obj); },

    referenceType()                         { return 'PRIMARY'; },
};

const resolvers: IResolvers = {
    StringOrInt: {
        name: 'StringOrInt',
        description: 'Type of String or Int.',
        serialize(value: (string | number)) {
            return value;
        },
        parseValue(value: (string | number)) {
            if (typeof value == 'string') {
                return <string>value;
            }

            return <number>value;
        },
        parseLiteral(ast: any) {
            return this.parseValue(ast.value);
        }
    },
    V2Item: {
        __resolveType(obj, ctx, info) {
            switch (mapType(obj)) {
                case 'BLOB': return 'V2Blob';
                case 'IFRAME': return 'V2Iframe';
                case 'IMAGE_GALLERY': return 'V2ImageGallery';
                case 'IMAGE': return 'V2Image';
                case 'NEWS_STORY': return 'V2NewsStory';
                case 'PROMO': return 'V2Promo';
                case 'VIDEO': return 'V2Video';
                default: throw `unknown "V2Item": ${ maybeContentOr(obj, ['type'], obj) }`;
            }
        }
    },
    V2Blob: {
        ...defaultResolvers,

        title(obj)                { return maybeContent(['caption'], obj) || maybeContent(['captionOverride'], obj) || maybeContent(['altText'], obj) || ''; },
        subtitle(obj)             { return maybeContent(['caption'], obj) || maybeContent(['captionOverride'], obj) || maybeContent(['altText'], obj) || ''; },
        description(obj: any)     { return maybeContent(['altText'], obj) || maybeContent(['caption'], obj) || maybeContent(['captionOverride'], obj) || ''; },

        link(obj)                 { return maybeContent(['link', 'media'], obj); },
        format(obj)               { return maybeContentOr('TODO', ['mimeType'], obj).split('/')[1]; }
    },
    V2ImageGallery: {
        ...defaultResolvers,

        title(obj)                { return maybeContent(['headline', 'default'], obj); },
        subtitle(obj)             { return maybeContent(['extendedHeadline', 'default'], obj); },
        description(obj: any)     { return maybeContent(['intro', 'default'], obj); },

        dynamicMetadata(obj)      { return R.merge({ ofType: 'V2DynamicMetadata' }, obj); },
    },
    V2Collection: {
        content(obj)              { return R.merge({ ofType: 'V2Collection' }, obj); },
        async results(obj, args, context, info) { return await mapResults(obj, args, context, info); },
        pageSize(obj)             { return maybeContent(['query', 'size'], obj); },
        resultSize(obj)           { return maybeContentOr([], ['related', 'primary', 'default'], obj).length; },
        offset(obj)               { return 0; },
        totalHits(obj)            { return; }
    },
    V2Promo: {
        ...defaultResolvers,

        title(obj)                { return maybeContentOr('', ['headline', 'default'], obj); },
        subtitle(obj)             { return maybeContentOr('', ['headline', 'default'], obj); },
        description(obj: any)     { return maybeContent(['dataModel', 'promoText'], obj); },

        displayStyle(obj)         { return maybeContent(['dataModel', 'displayStyle'], obj); },
        cssClassName(obj)         { return maybeContent(['dataModel', 'cssClassName'], obj); },
        promoLink(obj)            { return R.merge({ ofType: 'V2PromoLink' }, maybeContent(['dataModel'], obj)); },
    },
    V2PromoLink: {
        altText(obj)              { return 'TODO'; },
        text(obj)                 { return mapPromoHref(obj); },
        url(obj)                  { return mapPromoHref(obj); }
    },
    V2Iframe: {
        ...defaultResolvers,

        title(obj)                { return maybeContent(['captionOverride'], obj) || maybeContent(['caption'], obj) || ''; },
        subtitle(obj)             { return maybeContent(['captionOverride'], obj) || maybeContent(['caption'], obj) || ''; },
        description(obj: any)     { return maybeContent(['captionOverride'], obj) || maybeContent(['caption'], obj) || ''; },

        caption(obj)              { return maybeContent(['captionOverride'], obj) || maybeContent(['caption'], obj) || ''; },
        body(obj)                 { return maybeContent(['dataModel', 'html'], obj); },
        type(obj)                 { return maybeContent(['dataModel', 'type'], obj); },
        iframeUrl(obj)            { return maybeContent(['dataModel', 'url'], obj); },
        width(obj)                { return maybeContentOr('UNDEFINED_SIZE', ['dataModel', 'width'], obj).toString(); },
        height(obj)               { return maybeContentOr('UNDEFINED_SIZE', ['dataModel', 'height'], obj).toString(); },
        scrolling(obj)            { return maybeContent(['dataModel', 'scrolling'], obj); },
        cssClassName(obj)         { return maybeContent(['dataModel', 'cssClassName'], obj); }
    },
    V2Video: {
        ...defaultResolvers,

        title(obj)                         { return maybeContent(['titleOverride'], obj) || maybeContent(['captionOverride'], obj) || ''; },
        subtitle(obj)                      { return maybeContent(['titleOverride'], obj) || maybeContent(['captionOverride'], obj) || ''; },
        description(obj: any)              { return maybeContent(['captionOverride'], obj) || maybeContent(['caption'], obj) || ''; },

        ooyalaId(obj)                      { return maybeContent(['platform', 'id'], obj); },
        async images(obj, a, c, i)         { return mapVideoImages(obj, i); },
        async thumbnailImage(obj, a, c, i) { return R.find((img: any) => { return img['imageType'] == 'THUMBNAIL'; }, await mapVideoImages(obj, i)); }
    },
    V2Content: {
        ...defaultResolvers,

        title(obj)                { return maybeContent(['headline', 'default'], obj); },
        urlTitle(obj)             { return maybeContent(['headline', 'default'], obj); },
    },
    V2Category: {
        id(obj)                   { return R.pathOr('TODO', ['id'], obj); },
        value(obj)                { return R.pathOr('TODO', ['path'], obj); },
        link(obj, args, context)  { return R.pathOr('TODO', ['link', 'self'], obj); },
    },
    V2DynamicMetadata: {
        linkOrigin(obj, args, context)           {},
        metered(obj, args, context, info)        { return maybeContentOr(undefined, ['target', 'domainLink', info.variableValues.domain, 'metered'], obj); },
        route(obj, args, context, info)          { return maybeContentOr(undefined, ['target', 'domainLink', info.variableValues.domain, 'route'], obj); },
        link(obj, args, context, info)           { return maybeContentOr(undefined, ['target', 'domainLink', info.variableValues.domain, 'dynamicLink'], obj); },
        syndicated(obj, args, context)           {},
        adTarget(obj, args, context, info)       { return maybeContentOr(undefined, ['target', 'domainLink', info.variableValues.domain, 'adTarget'], obj); },
        sectionCaption(obj, args, context, info) { return maybeContentOr(undefined, ['target', 'domainLink', info.variableValues.domain, 'caption'], obj); },
        available(obj, args, context)            {},
        canonical(obj, args, context)            { return maybeContent(['link', 'canonical'], obj); }
    },
    V2Reference: {
        id(obj, args, context, info) { return { value: mapId(obj), link: mapLink(context, info, obj) }; },
        origin(obj)               { return R.pathOr('', ['platform', 'system'], obj).toUpperCase(); },
        originId(obj)             { return R.path(['platform', 'id'], obj); },
        contentType(obj)          { return mapType(obj); },
        referenceType(obj)        { return 'PRIMARY'; }
    },
    V2Image: {
        ...defaultResolvers,

        title(obj)                { return maybeContent(['captionOverride'], obj) || maybeContent(['caption'], obj) || ''; },
        subtitle(obj)             { return maybeContent(['captionOverride'], obj) || maybeContent(['caption'], obj) || ''; },
        description(obj: any)     { return maybeContent(['captionOverride'], obj) || maybeContent(['caption'], obj) || ''; },
        link(obj)                 { return maybeContent(['link', 'media'], obj); },

        height(obj)               { return maybeContent(['height'], obj); },
        width(obj)                { return maybeContent(['width'], obj); },
        imageType(obj)            { return maybeContentOr('TODO', ['imageType'], obj); },
        imageName(obj)            { return maybeContentOr('TODO', ['altText'], obj); },
        format(obj)               { return maybeContentOr('TODO', ['mimeType'], obj).split('/')[1]; }
    },
    V2NewsStory: {
        ...defaultResolvers,

        title(obj)                { return maybeContent(['headline', 'default'], obj) || maybeContentOr('', ['captionOverride'], obj); },
        subtitle(obj)             { return maybeContentOr('', ['extendedHeadline', 'default'], obj); },
        description(obj: any)     { return maybeContent(['intro', 'default'], obj) || maybeContentOr('', ['captionOverride'], obj); },

        link(obj, args, context, info) { return mapArticleLink(obj, info); },

        dynamicMetadata(obj)      { return R.merge({ ofType: 'V2DynamicMetadata' }, obj); },

        altKicker(obj, args)      { return maybeContentOr('', ['kicker', args.product, args.channel], obj);  },
        altTitle(obj, args)       { return maybeContentOr('', ['headline', args.product, args.channel], obj); },
        authorProfileIds(obj)     { return []; },
        body(obj)                 { return maybeContentOr('', ['body', 'default'], obj); },
        bulletList(obj)           { return maybeContentOr([], ['bulletlist'], obj); },
        byline(obj)               { return maybeContentOr('', ['byline', 'default'], obj); },
        bylineNames(obj)          { return R.reject(R.isNil, R.of(maybeContent(['byline', 'default'], obj))); },
        bylineTitles(obj)         { return R.reject(R.isNil, R.of(maybeContent(['bylineTitle', 'default'], obj))); },
        channel(obj)              { return maybeContentOr('NONE', ['channel'], obj).toUpperCase(); },
        commentsAllowed(obj)      { return maybeContentOr(false, ['commentsAllowed', 'default'], obj); },
        commentsShown(obj)        { return maybeContentOr(false, ['commentsAllowed', 'default'], obj); },
        creditedSource(obj)       { return maybeContentOr('', ['seoOwner', 'domain'], obj); },
        kicker(obj)               { return maybeContentOr('', ['kicker', 'default'], obj); },
        originalAssetId(obj)      { return 'TODO'; },
        seoHeadline(obj)          { return maybeContentOr('', ['seoTitle'], obj); },
        socialTitle(obj)          { return maybeContentOr('', ['socialHeadline', 'default'], obj); },
        standFirst(obj)           { return maybeContentOr('', ['standfirst', 'default'], obj); },
        subscriptionSummary(obj)  { return maybeContentOr('', ['subscriptionSummary', 'default'], obj); },
        thumbnailImage(obj)       { return mapThumbnailImage(obj); },
    },
    Query: {
        getV2: async (root, { id, apiKey, domain, includeDraft, includeFutureDated, bustTime, documentRevisionMajor, documentRevisionMinor }) => {
            if (documentRevisionMajor) { return root.getResourceRevision(id, apiKey, documentRevisionMajor, documentRevisionMinor); }

            return root.getResource(id, apiKey, domain, includeDraft, includeFutureDated, bustTime, documentRevisionMajor, documentRevisionMinor);
        },
        getV2Collection: async (root, { id, apiKey }) => {
            return root.getCollection(id, apiKey);
        },
        getV2Search: async (root, args) => {
            return root.getSearch(args);
        }
    }
};

export { resolvers };
