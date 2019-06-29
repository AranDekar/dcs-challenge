// Seconds before etag/cache header indicates resource expiration
const AKAMAI_REVALIDATE_TIME = 60;
const DIRECT_REVALIDATE_TIME = 300;

module.exports = function freshMiddleware(req, res, next) {
    if (res.finished) {
        return next();
    }

    // ETag rolls over every five minutes (or one minute for Akamai.)
    // Generating it this way affords us some cacheability, without
    // having to render the response.

    var maxAge = req.isAkamai ? AKAMAI_REVALIDATE_TIME : DIRECT_REVALIDATE_TIME,
        date = String((module.exports.dateNow() / (1000 * maxAge)) | 0),
        etag = 'W/"' + date + '"',
        noneMatchHeader = req.headers['if-none-match'];

    res.setHeader('ETag', etag);

    // ensure we do not revalidate for at least 5 minutes otherwise
    // every request will be revalidated immediately.

    res.setHeader(
        'Cache-Control',
        'public, max-age=' + maxAge + ', must-revalidate'
    );

    if (!noneMatchHeader) {
        return next();
    }

    if (noneMatchHeader === '*' ||
        noneMatchHeader === etag ||
        noneMatchHeader === date ||
        noneMatchHeader === '"' + date + '"') {
        res.statusCode = 304;
        return res.end();
    }

    next();
};

module.exports.dateNow = Date.now;
