import { Request, Response, RequestHandler, NextFunction } from 'express';
import * as request from 'request-promise';

async function isCapiV3Up() {
    try {
        await request.get(`${ process.env.CAPI_V3_URL }/v3/info`);

        return true;
    } catch (err) {
        return false;
    }
}

const middleware = async (req: Request, res: Response) => {
    const capiV3Up = await isCapiV3Up();
    const json = {
            app: 'Newsgraph',
            version: require('../../../package.json').version,
            capiV3Connected: capiV3Up,
            capiV3HealthCheckUrl: `${ process.env.CAPI_V3_URL }/v3/info`,
            CAPI_V2_URL: process.env.CAPI_V2_URL,
            CAPI_V3_URL: process.env.CAPI_V3_URL
        };

    res.setHeader('Content-Type', 'application/json');
    res.json(json);
};

export { middleware };
