// The Null Type is like /dev/null
// We point content toward it that we don't want to cache

const NullKeyType = {
    name: 'null',
    prefix: ''
};

const identifier = (apiResponse: Tabula.ApiResponse): boolean => {
    return true;
};

const write = (apiResponse: Tabula.ApiResponse, cb: Tabula.Callback): void => {
    return cb(undefined, apiResponse);
};

const xCacheTagHeaders = (apiResponse: Tabula.ApiResponse): string => {
    return '';
};

export default {
    keyType: NullKeyType,
    identify: identifier,
    write: write,
    xCacheTagHeaders: xCacheTagHeaders
};
