import * as normalizeUrl from 'normalize-url';

export const make = (url: string): string => {

    return `${ normalizeUrl(url) }`;
};
