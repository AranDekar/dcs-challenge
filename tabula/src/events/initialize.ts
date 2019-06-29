import { listenForContent } from './internal/dispatcher';
import { subscribeToRedis } from './external/subscriber';

const initializeEvents = () => {
    listenForContent();
    subscribeToRedis( () => {} );
};

export { initializeEvents };
