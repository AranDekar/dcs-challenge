/**
 * Instrumentation 
 */
import * as newrelic from "newrelic";

/**
 * Module dependencies.
 */
import getLogger from 'dcs-logger';
import * as Redis from 'ioredis';
import * as superagent from 'superagent';
import * as crypto from 'crypto';

const logger = getLogger();

function extractTagValue(json): string {
    switch(json.source) {
        case 'CAPI':
            return `C\:${ json.sourceId }`
        case 'DECK':
            const path = `/component/resource/deck/${ json.sourceId }.json`,
                id = crypto.createHash('md5').update(path).digest('hex');

            return `R\:${ id }`;
        default:
            return;
    }
}

export function listen(
    redisHost = process.env.REDIS_PUB_SUB_HOST, 
    redisChannel = process.env.REDIS_PUB_SUB_CHANNEL,
    varnishHost = process.env.VARNISH_HOST,
    redis = Redis(redisHost)
) {
    redis.on('error', (err) => { 
        logger.error('Error in redis: ', { err: err }); 
    
        process.exit(1);
    });

    redis.on('message', (channel, message) => {
        newrelic.startBackgroundTransaction('Transform', () => {
            const transaction = newrelic.getTransaction(),
                json = JSON.parse(message),
                value = extractTagValue(json);

            console.log('[Varnish] invalidate: ', value);

            if (value) {
                logger.debug('X-Cache-Tags: ', { value: value });

                newrelic.addCustomAttributes({tags: value});

                superagent('BAN', `http://${ varnishHost }/`)
                    .set('X-Cache-Tags', value)
                    .end((err, result) => { 
                        if (err) logger.error("Error with Varnish http call: ", { err: err });

                        transaction.end();
                    });
            }
        });
    });
    
    redis.subscribe(redisChannel);
}
