import { query as genericFields } from './partials/genericFields';
import { query as thumbnailFields } from './partials/imageFields';

export const query = (level: number = 0): string => {
    return `
... on V2NewsStory {
    ${ genericFields(level) }

    thumbnailImage {
        ${ thumbnailFields(level) }
    }

    altKicker
    altTitle
    authorProfileIds
    body
    bulletList
    byline
    bylineNames
    bylineTitles
    channel
    commentsAllowed
    commentsShown
    creditedSource
    kicker
    link
    seoHeadline
    socialTitle
    standFirst
    subscriptionSummary

    ${
        (level => {
            if (level > 1)
                return `
    dynamicMetadata {
        route
        link
        adTarget
        canonical
        sectionCaption
        metered
    }
`;
            else
                return '';
        })(level)
    }
}`; };
