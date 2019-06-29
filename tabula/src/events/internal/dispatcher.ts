import { events } from '..';
import * as capi from './lib/handler/capi';
import getLogger from 'dcs-logger';
import deleteFn from '../../cache/strategies/resource/invalidate';

const logger = getLogger();

const dispatch = (event: Tabula.ExternalEvent, cb: Tabula.Callback) => {
    const source = event.source;
    switch (source) {
        case 'CAPI':
            capi.handler(event, cb);
            break;
        case 'DECK':
            deleteFn(`${event.sourceId}.json`, cb);
            break;
        default:
            logger.debug('unknown "event.source"', JSON.stringify(source));
    }
};

const listenForContent = () => {
    events.on('content', (event: Tabula.ExternalEvent) => {
        dispatch(event, (err, result) => {
            if (err) {
                logger.error('Error dispatching event', { err: err });
            }
        });
    });
};

export { listenForContent, dispatch };
