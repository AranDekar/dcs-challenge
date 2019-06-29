const expect = require('chai').expect,
    nock = require('nock'),
    config = require('../../../../../../conf'),
    generateMiddleware = require('../../../../../../transformers/1.0/components/article/capi'),
    fixture = require('../../../../../fixtures/capiV2/article');

const endpoint = config.capiV2API + '/content/v2/methode/';

const options = {
    'query': {
        'cacheSkip': 'true',
        'includeRelated': true,
        'html': 'full,all',
        'includeDraft': false,
        'bustTime': 0,
        'includeDynamicMetadata': true,
        'maxRelatedLevel': 2,
        'domain': ''
    },
    'params': {
        'id': '4c7005bf1208054b4569eabecc78dfe2'
    }
};

const req = {
    url: '/component/article/4c7005bf1208054b4569eabecc78dfe2?t_product=tcog&t_output=json',
    query: {
        t_product: 'tcog',
        t_output: 'json'
    }
};

const res = {
    data: {},
    headers: {},
    locals: {}
};

const url = '/content/v2/methode/4c7005bf1208054b4569eabecc78dfe2?api_key=7ukztsc3p3hgaxnduw7m8zc7&bustTime=0&cacheSkip=true&domain=&html=full%2Call&includeDraft=false&includeDynamicMetadata=true&includeRelated=true&maxRelatedLevel=2';

describe('capiV2Agent', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('200', (done) => {
        const opsgenieFn = (err, data, cb) => {
            return cb();
        };

        const middleware = generateMiddleware(endpoint, options, false, opsgenieFn);

        const first = nock(config.capiV2API)
            .get(url)
            .reply(200, fixture);

        middleware(req, res, () => {
            expect(first.isDone()).to.be.true;
            expect(res.locals.data).to.deep.equal(fixture);
            done();
        });
    });

    describe('403', () => {
        let first, second;

        beforeEach(() => {
            first = nock(config.capiV2API)
                .log(console.log)
                .get(/\/content\/v2\/methode\/4c7005bf1208054b4569eabecc78dfe2\?api_key=7ukztsc3p3hgaxnduw7m8zc7/)
                .reply(403, { body: '<h1>Developer Over Rate</h1>' });

            second = nock(config.capiV2API)
                .log(console.log)
                .get(/\/content\/v2\/methode\/4c7005bf1208054b4569eabecc78dfe2\?api_key=ba6cy5fuujqhrjp4a3ewdgyd/)
                .reply(200, fixture);
        });

        it('retry', (done) => {
            const opsgenieFn = (err, data, cb) => {
                return cb();
            };

            const middleware = generateMiddleware(endpoint, options, false, opsgenieFn);

            middleware(req, res, () => {
                expect(first.isDone()).to.be.true;
                expect(second.isDone()).to.be.true;
                expect(res.locals.data).to.deep.equal(fixture);
                done();
            });
        });

        it('opsgenie', (done) => {
            const opsgenieFn = (err, data, cb) => {
                done();
            };

            const middleware = generateMiddleware(endpoint, options, false, opsgenieFn);

            middleware(req, res, () => { });
        });
    });
});
