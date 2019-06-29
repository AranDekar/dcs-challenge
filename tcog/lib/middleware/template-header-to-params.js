'use strict';

const TEMPLATE_HEADER = 'x-tcog-template';

// This middleware deals with an awkward combination of URI data (td_display=) being
// passed into the X-TCOG-Template header in the NCA Akamai config.

module.exports = (req, res, next) => {
    const templateHeader = req.headers[TEMPLATE_HEADER];

    if (templateHeader && templateHeader.includes('&')) {
        const pieces = templateHeader.split('&');
        req.headers['x-tcog-template'] = pieces.shift();

        const params = pieces;

        const paramAppender = (keyAndValue) => {
            const uriParamPieces = keyAndValue.split('=');
            const key = uriParamPieces[0];
            const value = uriParamPieces[1];
            req.query[key] = value; // clobber this namespace
        };

        params.forEach(paramAppender);
    }

    return next();
};
