import { query as genericFields } from './partials/genericFields';

export const query = (level: number = 0): string => {
    return `
... on V2Iframe {
    ${ genericFields(level) }

    body
    type
    caption
    iframeUrl
    width
    height
    scrolling
    cssClassName
}`; };
