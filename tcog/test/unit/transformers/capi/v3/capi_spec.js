const config = require('../../../../../conf');
const agent = require('../../../../../transformers/capi/v3/capi');
const articleFixture = require('../../../../fixtures/capiV3/article');
const collectionFixture = {body: '{}'};
const expect = require('chai').expect;
const nock = require('nock');

describe('GET /v3/articles/', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    const path = '/v3/articles/';

    const req = {
        query: {
            api_key: config.capiV3APIKey
        },
        url: config.capiV3API + path
    };

    it('200', (done) => {
        const first = nock(config.capiV3API)
            .log(console.log)
            .get(/\/v3\/articles\/\?api_key=wy745368rhtznnrprnqzp5dt/)
            .reply(200, '{}');

        agent(req, (err, res) => {
            expect(first.isDone()).to.be.true;

            const json = res.data;
            expect(json).to.deep.equal(JSON.parse(collectionFixture.body));
            done();
        });
    });

    describe('403', () => {
        let first, second;

        beforeEach(() => {
            first = nock(config.capiV3API)
                .log(console.log)
                .get(/\/v3\/articles\/\?api_key=wy745368rhtznnrprnqzp5dt/)
                .reply(403, { body: '<h1>Developer Over Rate</h1>' });

            second = nock(config.capiV3API)
                .log(console.log)
                .get(/\/v3\/articles\/\?api_key=vypycn3st9t49haf8mce927y/)
                .reply(200, collectionFixture.body);
        });

        it('retry', (done) => {
            agent(req, (err, res) => {
                expect(first.isDone()).to.be.true;
                expect(second.isDone()).to.be.true;

                const json = res.data;
                expect(json).to.deep.equal(JSON.parse(collectionFixture.body));
                done();
            });
        });
    });
});

describe('GET /v3/articles/<id>', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    const path = '/v3/articles/839deb2c4c7024630910d4ef57d58f78';

    const req = {
        query: {
            api_key: config.capiV3APIKey
        },
        url: config.capiV3API + path
    };

    it('200', (done) => {
        const first = nock(config.capiV3API)
            .log(console.log)
            .get(/\/v3\/articles\/839deb2c4c7024630910d4ef57d58f78\?api_key=wy745368rhtznnrprnqzp5dt/)
            .reply(200, articleFixture.body);

        agent(req, (err, res) => {
            expect(first.isDone()).to.be.true;

            const json = res.data;
            expect(json).to.deep.equal(JSON.parse(articleFixture.body));
            done();
        });
    });

    describe('403', () => {
        let first, second;

        beforeEach(() => {
            first = nock(config.capiV3API)
                .log(console.log)
                .get(/\/v3\/articles\/839deb2c4c7024630910d4ef57d58f78\?api_key=wy745368rhtznnrprnqzp5dt/)
                .reply(403, { body: '<h1>Developer Over Rate</h1>' });

            second = nock(config.capiV3API)
                .log(console.log)
                .get(/\/v3\/articles\/839deb2c4c7024630910d4ef57d58f78\?api_key=vypycn3st9t49haf8mce927y/)
                .reply(200, articleFixture.body);
        });

        it('retry', (done) => {
            agent(req, (err, res) => {
                expect(first.isDone()).to.be.true;
                expect(second.isDone()).to.be.true;

                const json = res.data;
                expect(json).to.deep.equal(JSON.parse(articleFixture.body));
                done();
            });
        });
    });
});
