const capiAgent = require('../../../../../transformers/vidora/v3/capi'),
    config = require('../../../../../conf'),
    expect = require('chai').expect,
    nock = require('nock');

const vidoraArticleId = '4f1cb432c42ee68b741df246dff74283';

const requestData = {
    id: vidoraArticleId,
    url: config.capiV3API + `/content/v3/${vidoraArticleId}`,
    capiV3APIKey: config.capiV3APIKey
};

describe('Vidora V3 CAPI agent', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('requestData is returned from CAPI agent', (done) => {
        const capiAPI = nock(config.capiV3API)
            .log(console.log)
            .get(`/content/v3/${vidoraArticleId}/?api_key=${config.capiV3APIKey}`)
            .reply(200, '{ "fakeArticle": "ok" } ');

        capiAgent(requestData, (err, res) => {
            if (err) {
                return done(err);
            }

            expect(capiAPI.isDone()).to.be.true;
            done();
        });
    });

    it('handles the error object from the agent', (done) => {
        const fakeFailCall = nock(config.capiV3API)
            .log(console.log)
            .get(`/content/v3/${vidoraArticleId}/?api_key=${config.capiV3APIKey}`)
            .reply(403, '<h1>Developer Inactive</h1>');

        capiAgent(requestData, (err) => {
            expect(err).to.be.an.err;
            done();
        });
    });
});
