import * as mocha from 'mocha';
import { events } from './../../../src/events';

describe('app events', () => {
    // afterEach((done) => {
    //     events.removeListener('testEvent', done);
    // });

    it('can support an arbitrary event', (done: Tabula.Callback) => {
        events.on('testEvent', done);
        events.emit('testEvent');
    });
});
