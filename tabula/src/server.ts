/**
 * Instrumentation.
 */
require('newrelic');

/**
 * Module dependencies.
 */
import * as express from 'express';
import * as compression from 'compression';  // compresses requests
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import getLogger from 'dcs-logger';
import * as errorHandler from 'errorhandler';
import * as lusca from 'lusca';
import * as favicon from 'serve-favicon';
import { join } from 'path';
import { routing } from './routes';
import { initializeEvents } from './events/initialize';

const logger = getLogger();

/**
 * Create Express server.
 */
const server = express();

/**
 * Express configuration.
 */
server.set('host', process.env.HOST || '0.0.0.0');
server.set('port', process.env.PORT || 3000);
server.use(favicon(join(__dirname, 'public', 'favicon.ico')));
server.use(compression());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(lusca.xframe('SAMEORIGIN'));
server.use(lusca.xssProtection(true));
server.use(express.static(join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Routing
 */

routing(server);

/**
 * Create Event hooks.
 */

const emitter = initializeEvents();

/**
 * Error Handler. Provides full stack - remove for production
 */
server.use(errorHandler());

/**
 * Start Express server.
 */
server.listen(server.get('port'), server.get('host'), () => {
  logger.debug(('  App is running at http://%s:%d in %s mode'), server.get('host'), server.get('port'), server.get('env'));
  logger.debug('  Press CTRL-C to stop\n');
});

export { server };
