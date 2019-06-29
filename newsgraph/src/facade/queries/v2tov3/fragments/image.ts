import { query as imageFields } from './partials/imageFields';

export const query = (level: number = 0): string => {
    return `
... on V2Image {
    ${ imageFields(level) }
}`; };
