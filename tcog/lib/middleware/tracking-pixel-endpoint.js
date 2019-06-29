// Tracking pixel endpoint
//
// Marks a request as ended, responds with an empty gif, allows
// the request to continue, and mutates the req.url value to remove the
// "/track/" prefix.

/* eslint node/no-deprecated-api:1 */
var gifValue = 'R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    emptyGif = new Buffer(gifValue, 'base64'), // Buffer.from(gifValue, 'base64'),
    endpointName = '/track',
    endpointLength = endpointName.length;

module.exports = function(req, res, next) {
    if (req.url.substr(0, endpointLength) === endpointName) {
    // Chop the "/track" off the URL, rendering the response as though
    // it came through directly, and not via the pixel
        req.url = req.url.substr(endpointLength);

        res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Length': emptyGif.length,
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
        });

        return res.end(emptyGif);
    }

    next();
};

module.exports.emptyGif = emptyGif;
