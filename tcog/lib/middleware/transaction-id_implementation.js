'use strict';

const X_CORRELATION_ID = 'X-Correlation-ID';

module.exports = function implementation(uuid, analyser) {
    return function transactionIdMiddleware(req, res, next) {
        res.setHeader(X_CORRELATION_ID, uuid());

        next();
    };
};
