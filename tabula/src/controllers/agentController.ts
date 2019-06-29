import * as ExpressCore from 'express-serve-static-core';
import { agent as defaultAgent, AgentResponse } from 'agent';
import getLogger from 'dcs-logger';
import * as queryString from 'query-string';
import * as R from 'ramda';
import { write } from '../cache/write';
import { Headers } from '../headers';

const logger = getLogger();

const getUrl = (req: ExpressCore.Request): string => {
    switch (`${req.params.protocol}`) {
        case 'http':
        case 'https':
            return removeTrailingQuestionMark(`${req.params.protocol}://${req.params.url}?${queryString.stringify(req.query)}`);
        case 'undefined':
            return removeTrailingQuestionMark(`http://${req.params.url}?${queryString.stringify(req.query)}`);
        default:
            throw `Invalid protocol ${req.params.protocol}`;
    }
};

const initialize = (agent: Tabula.Agent = defaultAgent()): ExpressCore.RequestHandler  => {
    return (req: ExpressCore.Request, res: ExpressCore.Response, next: ExpressCore.NextFunction) => {
        const url = getUrl(req);
        const requestHeaders = R.merge(R.omit(['host', 'etag'], req.headers), { 'user-agent': `Tabula/1.0 ${req.headers['user-agent']}` });

        agent(url, requestHeaders, (err: Error, apiResponse: Tabula.ApiResponse) => {

            if (err) {
                logger.error(`Error requesting ${url}: `, { err: err, requestHeaders: requestHeaders } );
                return next(err);
            }

            let jsonBody: JSON;

            try {
                jsonBody = JSON.parse(apiResponse.body);
            } catch (err) {
                logger.info('Unable to parse response body: ', { body: apiResponse.body, err: err });
                return res.status(apiResponse.status).send(apiResponse.body);
            }

            const jsonApiResponse = <Tabula.JsonApiResponse>apiResponse;
            jsonApiResponse.jsonBody = jsonBody;

            logger.debug(`Fetched ${url}`);
            let result: AgentResponse = apiResponse;

            // do not cache this if the 'X-No-Cache' request header is present
            if (requestHeaders[Headers.XNoCache.toLowerCase()]) {
                res.status(result.status).send(result.body);
            } else {
                write(jsonApiResponse, (err: Error, cacheResult: AgentResponse) => {
                    if (err) {
                        logger.error(`Error writing to Redis: `, { err: err, requestHeaders: requestHeaders });
                    }
                    const responseHeaders =
                        R.reject(
                            R.isNil,
                            R.reject(
                                R.isEmpty,
                                R.pick(
                                    ['content-type', Headers.XCacheTags],
                                    cacheResult.headers)));

                    for (const header in responseHeaders) {
                        res.setHeader(header, cacheResult.headers[header]);
                    }

                    result = cacheResult;
                    // Debug level for when a cache write has been made
                    logger.debug('Cache write successful');

                    res.status(result.status).send(result.body);
                });
            }
        });
    };
};

const removeTrailingQuestionMark = (url: string): string => {
    if (url.endsWith('?')) {
        return url.substr(0, url.length - 1);
    }

    return url;
};

export { initialize };
