import { write } from '../../src/cache/write';
import { events } from '../../src/events';
import { redis } from '../../src/lib/redis';
import { expect } from 'chai';
import { v2Fixtures } from './../fixtures/capi/v2/';
import { eachSeries } from 'async';
import * as supertest from 'supertest';
import { server } from '../../src/server';
import { toJsonApiResponse } from '../utils';

const contentTypes: string[] = Object.keys(v2Fixtures);
const request = supertest(server);

describe('reading from Tabula', () => {
    before((done) => {
        const writer = (name: string, cb: Tabula.Callback) => {
            const jsonApiResponse = toJsonApiResponse(v2Fixtures[name]);
            return  write(jsonApiResponse, cb);
        };

        eachSeries(contentTypes, writer, done);
    });

    after((done) => {
        redis.flushdb(done);

        events.removeAllListeners('content');
    });

    it('responds to each content type', (done) => {
        const test = (contentType: string, cb: Tabula.Callback) => {
            const url = v2Fixtures[contentType].url;
            request.get(`/${ url }`)
                .expect(200)
                .end( (err, res) => {
                    expect(res.header['x-cache']).to.equal('HIT');
                    const tabulaResponse = res.body;
                    expect(tabulaResponse).to.deep.equal(JSON.parse(v2Fixtures[contentType].body));
                    return cb();
                });
        };

        eachSeries(contentTypes, test, done);
    });
});
