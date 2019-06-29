import { query as genericFields } from './genericFields';

export const query = (level: number = 0): string => {
    return `
${ genericFields(level) }

link
cropName
height
width
format
imageType
imageName
`; };
