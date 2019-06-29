import * as mocha from 'mocha';
import { expect } from 'chai';
import * as express from 'express';
import { middleware as cacheReader } from './../../../src/middleware/cacheReader';

describe('cacheReader middleware', () => {
    let result: string | undefined;
    let res = <express.Response>{};

    const req = <express.Request>{ url: '/', headers: {} },
        read = (url: string, cb: Tabula.Callback) => {
            cb(undefined, result);
        };

    const middleware = cacheReader(read);

    afterEach(() => {
        result = '';
        res = <express.Response>{};
    });

    describe('cache ignore', () => {
        let result: string | undefined;
        const req = <express.Request>{ url: '/', headers: { 'x-no-cache': 'yes' } };

        it('should call next()', (done) => {
            result = undefined;

            res.setHeader = (name, value) => {
                expect(name).to.not.be('X-Cache');
            };

            middleware(req, res, done);
        });
    });

    describe('cache miss', () => {
        let result: string | undefined;

        it('should call next()', (done) => {
            result = undefined;

            res.setHeader = (name, value) => {
                expect(name).to.eq('X-Cache');
                expect(value).to.eq('MISS');
            };

            middleware(req, res, done);
        });
    });

    describe('cache hit', () => {
        it('returns the cached response', (done) => {
            const headers: any = {};

            const object = {
                    body: '{"foo":"bar"}',
                    status: 200,
                    headers: {
                        'content-type': 'application/json'
                    }
                };

            res.setHeader = (name, value) => {
                headers[name] = value;
            };

            res.send = (data) => {
                expect(data).to.eq('{"foo":"bar"}');
                expect(headers['X-Cache']).to.equal('HIT');
                expect(headers['content-type']).to.equal('application/json');
                done();
                return res;
            };

            res.status = (code) => {
                expect(code).to.eq(200);
                return res;
            };

            result = JSON.stringify(object);

            middleware(req, res, () => {
                done(new Error('should not be called'));
            });
        });
    });
});
