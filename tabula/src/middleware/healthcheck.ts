import { Request, Response, RequestHandler, NextFunction } from 'express';
import { redis } from '../lib/redis';

async function doIsRedisUp() {
    try {
        await redis.info().timeout(100);

        return true;
    } catch (error) {
        return false;
    }
}

const middleware = async (req: Request, res: Response, next: NextFunction) => {
    const isRedisUp = await doIsRedisUp();
    const status = isRedisUp ? 200 : 500;
    const json = JSON.stringify(
        {
            app: 'Tabula',
            version: require('../../../package.json').version,
            redis: isRedisUp
        }
    );

    res.setHeader('Content-Type', 'application/json');
    res.send(json);
};

export { middleware };
