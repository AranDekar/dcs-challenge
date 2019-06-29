import * as bunyan from 'bunyan';
import { expect } from 'chai';
import * as mocha from 'mocha';
import * as AgentController from '../../../src/controllers/agentController';
import * as ExpressCore from 'express-serve-static-core';
import { Writable } from 'stream';
import { events } from '../../../src/events';

function controller(agent: Tabula.Agent) {
    return AgentController.initialize(agent);
}

describe('Agent Controller', () => {
    describe('#initialize', () => {
        it('calls the agent with the req.url', (done) => {
            const fakeAgent = (url: string, headers: object, cb: Tabula.Callback) => {
                expect(url).to.equal('http://api.newscdn.com.au/content/v2/capi-id-123?foo=bar');
                done();
            };

            const handler = controller(fakeAgent);
            const fakeRequest = <ExpressCore.Request>{ params: { protocol: 'http', url: 'api.newscdn.com.au/content/v2/capi-id-123' }, query: { foo: 'bar' }, headers: {} };
            const fakeResponse = <ExpressCore.Response>{};
            handler(fakeRequest, fakeResponse, () => { });
        });

        it('calls the agent with the req.headers', (done) => {
            const fakeAgent = (url: string, headers: object, cb: Tabula.Callback) => {
                expect((<any>headers).agent).to.equal('Mozilla device');
                done();
            };

            const handler = controller(fakeAgent);
            const fakeRequest = <ExpressCore.Request>{ headers: <object>{ agent: 'Mozilla device' }, params: { protocol: 'http', url: 'api.newscdn.com.au/content/v2/capi-id-123' } };
            const fakeResponse = <ExpressCore.Response>{};
            handler(fakeRequest, fakeResponse, () => { });
        });
    });

    describe('error conditions', () => {
        it('logs the error if present in the callback', (done) => {
            const fakeAgent = (url: string, headers: object, cb: Tabula.Callback) => {
                cb({ message: 'BOOM', name: 'BoomError' }, <Tabula.ApiResponse>{});
                done();
            };

            const fakeRequest = <ExpressCore.Request>{ params: { protocol: 'http', url: 'api.newscdn.com.au/content/v2/capi-id-123' }, headers: {} };
            const fakeResponse = <ExpressCore.Response>{};

            const handler = controller(fakeAgent);

            handler(fakeRequest, fakeResponse, () => { });
        });
    });
});
