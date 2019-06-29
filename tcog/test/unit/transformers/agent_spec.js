const config = require('../../../conf'),
    expect = require('chai').expect,
    nock = require('nock'),
    userId = '123',
    agent = require('../../../transformers/vidora/agent');

const vidoraData = {
    items: [
        { 'id': '4f1cb432c42ee68b741df246dff74283' },
        { 'id': 'fe38f8bc6dc147bd5b02c3968e4bef68' },
        { 'id': 'e2f7dd83cdc417b1cc6586ddcee60942' },
        { 'id': 'ac240ec8aeb909eaa126a18d94b3b7dd' },
        { 'id': 'a7f9e074e4d12e670e9904148050a0b5' },
        { 'id': 'a6dc5f71b3e95ac796cc029e855c99f5' },
        { 'id': 'e46dafd18c2ceef24e4317b8b6add50b' },
        { 'id': '0e0d0d94058706b005b086301c00cd99' },
        { 'id': '781b1fd19f35616acab53d38e9b90c5b' },
        { 'id': '3930a3ea729dcc123d50359fd9365aa7' }]
};

const url = `${config.vidoraAPI}/v1/users/${userId}/recommendations/?api_key=${config.vidoraApiKey}`;

describe('Generic JSON Agent', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('successfully makes a call to Vidora', (done) => {
        const fakeSuccessfulCall = nock(`${config.vidoraAPI}`)
            .get(`/v1/users/${userId}/recommendations/?api_key=${config.vidoraApiKey}`)
            .reply(200, (uri, requestBody) => {
                return vidoraData;
            });

        const testAgent = agent();

        testAgent(url, (err, res) => {
            if (err) {
                return done(err);
            }

            expect(fakeSuccessfulCall.isDone()).to.be.true;
            done();
        });
    });

    it('returns error if call to Vidora fails', (done) => {
        const fakeFailCall = nock(`${config.vidoraAPI}`)
            .get(`/v1/users/${userId}/recommendations/?api_key=${config.vidoraApiKey}`)
            .reply(404);

        const testAgent = agent();

        testAgent(url, (err, res) => {
            expect(err).to.be.an.err;
            done();
        });
    });
});
