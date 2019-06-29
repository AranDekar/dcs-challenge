import { query as genericFields } from './partials/genericFields';

export const query = (level: number = 0): string => {
    return `
... on V2Blob {
    ${ genericFields(level) }

    format
    link
}`; };
