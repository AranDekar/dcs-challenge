import { query as genericFields } from './partials/genericFields';

export const query = (level: number = 0): string => {
    return `
... on V2ImageGallery {
    ${ genericFields(level) }

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
