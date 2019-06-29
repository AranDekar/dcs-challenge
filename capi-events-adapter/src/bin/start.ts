#!/usr/bin/env ts-node

/**
 * Instrumentation.
 */
require('newrelic');

/**
 * Module dependencies.
 */
import transform from '../adapter';
import getLogger from 'dcs-logger';

const logger = getLogger();

function loop() {
    logger.debug('starting...');

    setTimeout(() => {
        logger.debug('transforming...');
        transform(
            process.env.SQS_QUEUE,
            process.env.REDIS_PUB_SUB_HOST,
            process.env.REDIS_PUB_SUB_CHANNEL,
            () => { 
                logger.debug('looping...');
                loop();
            })
        
    }, 3000);
}

loop();
