const expect = require('chai').expect,
    generateRecommendations = require('../../../../../transformers/vidora/v3/recommendations'),
    // config = require('../../../conf'),
    _ = require('lodash');

const req = {
    params: {
        user_id: '123'
    }
};

describe('Handle non arrays gracefully', () => {
    describe('vidora integration', () => {
        let res;

        const vidoraRecommendations = {
            items: [
                {'id': '4f1cb432c42ee68b741df246dff74283'},
                {'id': 'fe38f8bc6dc147bd5b02c3968e4bef68'},
                {'id': 'e2f7dd83cdc417b1cc6586ddcee60942'},
                {'id': 'ac240ec8aeb909eaa126a18d94b3b7dd'},
                {'id': 'a7f9e074e4d12e670e9904148050a0b5'},
                {'id': 'a6dc5f71b3e95ac796cc029e855c99f5'},
                {'id': 'e46dafd18c2ceef24e4317b8b6add50b'},
                {'id': '0e0d0d94058706b005b086301c00cd99'},
                {'id': '781b1fd19f35616acab53d38e9b90c5b'},
                {'id': 'abcgd1d19f35616acab53d38e938djsl'},
                {'id': '3930a3ea729dcc123d50359fd9365aa7'}
            ]
        };

        beforeEach(() => {
            res = {
                locals: {
                    product: {
                        name: 'HeraldSun'
                    }
                }
            };
        });

        it('check if recommendations is array', (done) => {
            const agent = (url, cb) => {
                return cb(null, { items: [] });
            };

            const vidoraIntegration = generateRecommendations(agent)[3];

            vidoraIntegration(req, res, () => {
                expect(res.locals.vidora).to.be.an('array');
                done();
            });
        });

        it('passes on non arrays to the end user for feedback', (done) => {
            const vidoraResponse = { something: 'Invalid signature' };
            const agent = (url, cb) => {
                return cb(null, vidoraResponse);
            };

            const vidoraIntegration = generateRecommendations(agent)[3];

            vidoraIntegration(req, res, (err) => {
                expect(err).to.be.ok;
                expect(err.message).to.equal('Vidora replied without an array of recommended articles');
                expect(err.response).to.deep.equal(vidoraResponse);
                expect(res.locals.vidora).to.not.be.ok;
                done();
            });
        });

        it('check if the VIDORA_ARTICLE_LIMIT is being obeyed i.e. maximum of 10 articles should be inserted into res.locals.vidora', (done) => {
            const agent = (url, cb) => {
                return cb(null, vidoraRecommendations);
            };

            const vidoraIntegration = generateRecommendations(agent)[3];

            vidoraIntegration(req, res, () => {
                expect(vidoraRecommendations.items).to.have.length(11);
                expect(res.locals.vidora).to.have.length.at.most(10);
                done();
            });
        });
    });

    describe('capi integration', () => {
        const vidoraRecommendations = {
            items: [
                {'id': '4f1cb432c42ee68b741df246dff74283'},
                {'id': 'fe38f8bc6dc147bd5b02c3968e4bef68'},
                {'id': 'e2f7dd83cdc417b1cc6586ddcee60942'},
                {'id': 'ac240ec8aeb909eaa126a18d94b3b7dd'},
                {'id': 'a7f9e074e4d12e670e9904148050a0b5'},
                {'id': 'a6dc5f71b3e95ac796cc029e855c99f5'},
                {'id': 'e46dafd18c2ceef24e4317b8b6add50b'},
                {'id': '0e0d0d94058706b005b086301c00cd99'},
                {'id': '781b1fd19f35616acab53d38e9b90c5b'},
                {'id': '3930a3ea729dcc123d50359fd9365aa7'}
            ]
        };

        /* The actual CAPI articles returned will have more data inside of them but for the sake of simplicity in testing
        we've used just 2 key-value pairs */
        const capiArticles = {
            '4f1cb432c42ee68b741df246dff74283': {contentType: 'NEWS_STORY', originId: '4f1cb432c42ee68b741df246dff74283'},
            'fe38f8bc6dc147bd5b02c3968e4bef68': {contentType: 'NEWS_STORY', originId: 'fe38f8bc6dc147bd5b02c3968e4bef68'},
            'e2f7dd83cdc417b1cc6586ddcee60942': {contentType: 'NEWS_STORY', originId: 'e2f7dd83cdc417b1cc6586ddcee60942'},
            'ac240ec8aeb909eaa126a18d94b3b7dd': {contentType: 'NEWS_STORY', originId: 'ac240ec8aeb909eaa126a18d94b3b7dd'},
            'a7f9e074e4d12e670e9904148050a0b5': {contentType: 'NEWS_STORY', originId: 'a7f9e074e4d12e670e9904148050a0b5'},
            'a6dc5f71b3e95ac796cc029e855c99f5': {contentType: 'NEWS_STORY', originId: 'a6dc5f71b3e95ac796cc029e855c99f5'},
            'e46dafd18c2ceef24e4317b8b6add50b': {contentType: 'NEWS_STORY', originId: 'e46dafd18c2ceef24e4317b8b6add50b'},
            '0e0d0d94058706b005b086301c00cd99': {contentType: 'NEWS_STORY', originId: '0e0d0d94058706b005b086301c00cd99'},
            '781b1fd19f35616acab53d38e9b90c5b': {contentType: 'NEWS_STORY', originId: '781b1fd19f35616acab53d38e9b90c5b'},
            '3930a3ea729dcc123d50359fd9365aa7': {contentType: 'NEWS_STORY', originId: '3930a3ea729dcc123d50359fd9365aa7'}
        };

        const res = {
            locals: {
                product: {
                    name: 'HeraldSun'
                },
                data: {
                    type: 'P13N_RECOMMENDATION_LIST',
                    results: []
                }
            }
        };

        it('checks whether res.locals.data is populated with the P13N list', (done) => {
            const agent = (url, cb) => {
                const urlSplit = url.split('articles/');
                const urlSplitAgain = urlSplit[1].split('?');
                const articleId = urlSplitAgain[0];

                const payload = capiArticles[articleId];

                return cb(null, payload);
            };

            res.locals.vidora = vidoraRecommendations.items;

            const capiIntegration = generateRecommendations(agent)[4];

            capiIntegration(req, res, () => {
                expect(res.locals.data.type).to.deep.equal('P13N_RECOMMENDATION_LIST');
                expect(res.locals.data.results[0]).to.have.all.keys(['contentType', 'originId']);
                done();
            });
        });

        it('passes any error from the agent into the next middleware', (done) => {
            const errMsg = 'Failed to communicate with CAPI';
            const agent = (url, cb) => {
                return cb({message: errMsg});
            };

            const capiIntegration = generateRecommendations(agent)[4];

            capiIntegration({}, res, (err) => {
                expect(err.message).to.equal(errMsg);
                done();
            });
        });
    });
});
