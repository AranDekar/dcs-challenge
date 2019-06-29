import { query as genericFields } from './partials/genericFields';
import { query as thumbnailFields } from './partials/imageFields';

export const query = (level: number = 0): string => {
    return `
... on V2Video {
    ${ genericFields(level) }

    ooyalaId
    thumbnailImage {
        ${ thumbnailFields(level) }
    }
    images {
        contentType
        title
        description
        link
        width
        height
        imageType
    }
}`; };
