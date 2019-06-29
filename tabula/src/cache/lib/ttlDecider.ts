const THIRTY_SECONDS = 30,
      ONE_MINUTE = 60,
      FIVE_MINUTES = 300,
      TEN_MINUTES = 600,
      FIFTEEN_MINUTES = 900;

const ttlDecider: Tabula.TTLDeciderFn = (contentType: Tabula.TTLContentType, statusCode: number): number => {
    switch (statusCode) {
        case 403:
            return ONE_MINUTE;
        case 404:
            return FIVE_MINUTES;
        case 400:
        case 410:
        case 500:
            return TEN_MINUTES;
        default:
            switch (contentType) {
                case 'SEARCH':
                case 'V2_COLLECTION':
                    return FIVE_MINUTES;
                case 'ERROR':
                    return ONE_MINUTE;
                case 'V3_SEARCH':
                    return THIRTY_SECONDS;
                default:
                    return FIFTEEN_MINUTES * 16;
            }

    }
};

export { ttlDecider };
