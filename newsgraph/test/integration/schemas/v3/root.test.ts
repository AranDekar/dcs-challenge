import { expect } from 'chai';
import * as nock from 'nock';

import { root } from '../../../../src/schemas/v3/root';

describe('schemas/v3/root', () => {
    describe('#getResource', () => {
        afterEach((done) => {
            nock.cleanAll();

            done();
        });

        it('fetchDraftIfLatest=true', async () => {
            const capi = nock(<string>`http://test-capi3`)
                .get('/v3/articles/123?api_key=abc&fetchDraftIfLatest=true&showFutureDated=false')
                .reply(200, '{"data":"present"}');

            const resource = await root.getResource('123', 'abc', 'news.com.au', true, false, undefined, '', '');

            expect(capi.isDone()).to.equal(true);
            expect(resource).to.eql({data: 'present'});
        });

        it('showFutureDated=true', async () => {
            const capi = nock(<string>`http://test-capi3`)
                .get('/v3/articles/123?api_key=abc&fetchDraftIfLatest=false&showFutureDated=true')
                .reply(200, '{"data":"present"}');

            const resource = await root.getResource('123', 'abc', 'news.com.au', false, true, undefined, '', '');

            expect(capi.isDone()).to.equal(true);
            expect(resource).to.eql({data: 'present'});
        });

        it('should try GET /v3/articles first', async () => {
            const capi = nock(<string>`http://test-capi3`)
                .get('/v3/articles/123?api_key=abc&fetchDraftIfLatest=false&showFutureDated=false')
                .reply(200, '{"data":"present"}');

            const resource = await root.getResource('123', 'abc', 'news.com.au', false, false, undefined, '', '');

            expect(capi.isDone()).to.equal(true);
            expect(resource).to.eql({data: 'present'});
        });

        it('should try GET /v3/collection second', async () => {
            const capi = nock(<string>`http://test-capi3`);

            capi
                .get('/v3/articles/123?api_key=abc&fetchDraftIfLatest=false&showFutureDated=false')
                .reply(404);

            capi
                .get('/v3/collections/123?api_key=abc&fetchDraftIfLatest=false&showFutureDated=false')
                .reply(200, '{"data":"present"}');

            const resource = await root.getResource('123', 'abc', 'news.com.au', false, false, undefined, '', '');

            expect(capi.isDone()).to.equal(true);
            expect(resource).to.eql({data: 'present'});
        });

        it('should throw "entity not found" third', async () => {
            const capi = nock(<string>`http://test-capi3`);

            capi
                .get('/v3/articles/123?api_key=abc&fetchDraftIfLatest=false&showFutureDated=false')
                .reply(404);

            capi
                .get('/v3/collections/123?api_key=abc&fetchDraftIfLatest=false&showFutureDated=false')
                .reply(404);

            try {
                await root.getResource('123', 'abc', 'news.com.au', false, false, undefined, '', '');
            } catch (e) {
                expect(e).to.equal('Entity not found');
            }

            expect(capi.isDone()).to.equal(true);
        });
    });
});
