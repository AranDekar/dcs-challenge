'use strict';

const conf = require('../../../conf'),
    logger = require('../../../lib/logger'),
    middleware = require('../../../lib/middleware'),
    fib = require('../lib/fib');

module.exports = () => {
    const calculatePosition = (req, res, next) => {
        try {
            const position = Number(req.params.position);
            if (!Number.isSafeInteger(position)) {
                throw new Error('invalid position!');
            }
            let number = 0,
                count = 1;
            for (const n of fib) {
                count += 1;
                if (count <= position) {
                    number = n;
                } else {
                    break;
                }
            }
            res.locals.data = { position, number };
            next();
        } catch (err) {
            logger.error({ err: err }, 'Failed to calculate the position');
            res.statusCode = 400;
            return next(err.message);
        }
    };

    return [
        middleware.product,
        calculatePosition,
        middleware.templateHandler('default')
    ];
};
