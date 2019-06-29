/**
 * Instrumentation.
 */
require('newrelic');

/**
 * Module dependencies.
 */
import * as express from 'express';
import router from './router';
import getLogger from 'dcs-logger';
import redis from './redis';

const logger = getLogger();

const app: express.Application = express(),
    port: number = parseInt(process.env.PORT || '3000') ;

app.use((req, res, next) => {
    const log = () =>  { logger.info({req: req, res: res}); };

    res.on('finish', log);
    res.on('close', log);

    next();
});

app.use('/healthcheck', async (req, res, next) => {
    const version = require('../../package.json').version;

    async function doIsRedisUp() {
        try {
            await redis.info().timeout(100);

            return true;
        } catch (error) {
            logger.error('Error with Redis: ', { error: error });
            return false;
        }
    }

    const isRedisUp = await doIsRedisUp(),
        status = isRedisUp ? 200 : 500;

    res.status(status).json({
        version: version,
        redis: isRedisUp
    });
});

app.use('/deck', router);

app.listen(port, () => {
    logger.debug(`Listening at http://localhost:${ port }/`);
});
