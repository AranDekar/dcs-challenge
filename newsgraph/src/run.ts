/**
 * Instrumentation.
 */
require('newrelic');

/**
 * Module dependencies.
 */
import getLogger from 'dcs-logger';
import { initialize } from '.';
import { port } from './port';

const logger = getLogger();

initialize().listen(port, () => logger.debug(`Newsgraph is running on port ${port}.`));
