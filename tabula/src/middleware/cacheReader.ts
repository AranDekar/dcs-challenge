import getLogger from 'dcs-logger';
import { Request, Response, RequestHandler, NextFunction } from 'express';
import { Headers } from '../headers';
import { read as fn } from '../cache/read';
import * as R from 'ramda';

const logger = getLogger();

const middleware = (read = fn) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (req.headers['x-no-cache']) {
            logger.info('X-No-Cache header detected');
            logger.info('Cache check ignored');
            next();
        } else {
            const url = req.url.substr(1);

            read(url, (err: Error, result: string) => {
                if (err) {
                    logger.error(`Error reading from Redis: `, { err: err });
                    return next();
                }
                else if (!result) {
                    logger.debug('cache miss!');
                    res.setHeader('X-Cache', 'MISS');

                    return next();
                } else {
                    logger.debug('cache hit!');

                    const response = JSON.parse(result);

                    for (const key in R.pick(['content-type', Headers.XCacheTags], response.headers)) {
                        res.setHeader(key, response.headers[key]);
                    }

                    res.setHeader('X-Cache', 'HIT');
                    res.status(response.status).send(response.body);
                }
            });
        }
    };
};

export { middleware };
