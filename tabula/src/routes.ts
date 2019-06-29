/**
 * Controllers (route handlers).
 */
import * as Express from 'express';
import { middleware as healthcheck } from './middleware/healthcheck';
import * as AgentController from './controllers/agentController';
import { middleware as cacheReader } from './middleware/cacheReader';


const routing = (server: Express.Application): void => {
    server.get('/', (req, res) => { res.send('Tabula'); });
    server.get('/healthcheck', healthcheck);
    server.get('/(:protocol(http|https)\:\/\/)?(:url(*+))', cacheReader(), AgentController.initialize());
};

export { routing };
