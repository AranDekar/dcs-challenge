const express = require('express'),
    expect = require('chai').expect,
    request = require('supertest'),
    config = require('../../../../../conf'),
    middleware = require('../../../../../lib/middleware'),
    recommendationsMapper = require('../../../../../transformers/newsgraph/middleware/recommendationsMapper'),
    transformers = require('../../../../../transformers/index'),
    nock = require('nock');

const app = express();

app.get('/newsgraph/v3/', middleware.responseLocals, middleware.normalizeRequestUrl, middleware.requestInitialiser, middleware.product, middleware.deprecateParams, middleware.queryProcessor, recommendationsMapper, transformers.newsgraph.v3.generic);

describe('GET /newsgraph/v3/', () => {
    const response = '{"data":{"getV3":{"content":{"id":"b9db69f7820982e450d8b6fa71b97f0b","link":{"self":"https://content-sit.api.news/v3/articles/b9db69f7820982e450d8b6fa71b97f0b"},"headline":{"default":"Twisted plan for starving children"},"standfirst":{"default":"<p>THE parents whose 13 children were found starving and chained to their own beds reportedly had a plan to “make millions”.</p>"}}}}}',
        query = 'query%20(%24apiKey%3A%20String!%2C%20%24id%3A%20String!)%20%7B%0A%20%20getV3(id%3A%20%24id%2C%20apiKey%3A%20%24apiKey)%20%7B%0A%20%20%20%20content%20%7B%0A%20%20%20%20%20%20...%20on%20V3Article%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20link%20%7B%0A%20%20%20%20%20%20%20%20%20%20self%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20headline%20%7B%0A%20%20%20%20%20%20%20%20%20%20default%0A%20%20%20%20%20%20%20%20%7D%0A%09%09%09%09standfirst%20%7B%0A%20%20%20%20%20%20%20%20%20%20default%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A',
        variables = '%7B%0A%20%20"id"%3A%20""%2C%0A%09"apiKey"%3A""%20%0A%7D';

    const vidoraResponse = '{"data":{"getV3Resources":{"results":[{"id":"b6242c5533c5e0aff68ddfb681e9aa4c"},{"id":"a9b384019009f2da32340952b018d189"}]}}}',
        vidoraQuery = 'query%20(%24apiKey%3A%20String!%2C%20%24ids%3A%20%5BString!%5D!)%20%7B%0A%20%20getV3Resources(ids%3A%20%24ids%2C%20apiKey%3A%20%24apiKey)%20%7B%0A%20%20%20%20results%20%7B%0A%20%20%20%20%20%20...%20on%20V3Article%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A',
        vidoraVariables = '%7B%0A%20%20"apiKey"%3A%20"wy745368rhtznnrprnqzp5dt"%2C%0A%20%20"ids"%3A%20%5B%0A%20%20%20%20"b6242c5533c5e0aff68ddfb681e9aa4c"%2C%0A%20%20%20%20"a9b384019009f2da32340952b018d189"%0A%20%20%5D%0A%7D';

    afterEach(() => {
        nock.cleanAll();
    });

    describe('200', () => {
        describe('variables', () => {
            it('"apiKey" defaults to product', (done) => {
                const newsgraph = nock(config.newsgraph)
                    .log(console.log)
                    .get('/graphql/v3?query=query%20(%24apiKey%3A%20String!%2C%20%24id%3A%20String!)%20%7B%0A%20%20getV3(id%3A%20%24id%2C%20apiKey%3A%20%24apiKey)%20%7B%0A%20%20%20%20content%20%7B%0A%20%20%20%20%20%20...%20on%20V3Article%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20link%20%7B%0A%20%20%20%20%20%20%20%20%20%20self%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20headline%20%7B%0A%20%20%20%20%20%20%20%20%20%20default%0A%20%20%20%20%20%20%20%20%7D%0A%09%09%09%09standfirst%20%7B%0A%20%20%20%20%20%20%20%20%20%20default%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A&variables=%7B%22id%22%3A%22%22%2C%22apiKey%22%3A%22123%22%7D')
                    .reply(200, response);

                request(app)
                    .get(`/newsgraph/v3/?t_product=mock&t_output=json&query=${query}&variables=${variables}`)
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(newsgraph.isDone()).to.equal(true);
                        expect(JSON.parse(res.text).data).to.deep.equal(JSON.parse(response));

                        done(err);
                    });
            });

            it('"apiKey" fallback to environment', (done) => {
                const newsgraph = nock(config.newsgraph)
                    .get('/graphql/v3?query=query%20(%24apiKey%3A%20String!%2C%20%24id%3A%20String!)%20%7B%0A%20%20getV3(id%3A%20%24id%2C%20apiKey%3A%20%24apiKey)%20%7B%0A%20%20%20%20content%20%7B%0A%20%20%20%20%20%20...%20on%20V3Article%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20link%20%7B%0A%20%20%20%20%20%20%20%20%20%20self%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20headline%20%7B%0A%20%20%20%20%20%20%20%20%20%20default%0A%20%20%20%20%20%20%20%20%7D%0A%09%09%09%09standfirst%20%7B%0A%20%20%20%20%20%20%20%20%20%20default%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A&variables=%7B%22id%22%3A%22%22%2C%22apiKey%22%3A%22wy745368rhtznnrprnqzp5dt%22%7D')
                    .reply(200, response);

                request(app)
                    .get(`/newsgraph/v3/?t_product=tcog&t_output=json&query=${query}&variables=${variables}`)
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(newsgraph.isDone()).to.equal(true);
                        expect(JSON.parse(res.text).data).to.deep.equal(JSON.parse(response));

                        done(err);
                    });
            });

            it('"td_" inject query parameters', (done) => {
                const newsgraph = nock(config.newsgraph)
                    .get('/graphql/v3?query=query%20(%24apiKey%3A%20String!%2C%20%24id%3A%20String!)%20%7B%0A%20%20getV3(id%3A%20%24id%2C%20apiKey%3A%20%24apiKey)%20%7B%0A%20%20%20%20content%20%7B%0A%20%20%20%20%20%20...%20on%20V3Article%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20link%20%7B%0A%20%20%20%20%20%20%20%20%20%20self%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20headline%20%7B%0A%20%20%20%20%20%20%20%20%20%20default%0A%20%20%20%20%20%20%20%20%7D%0A%09%09%09%09standfirst%20%7B%0A%20%20%20%20%20%20%20%20%20%20default%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A&variables=%7B%22id%22%3A%22123%22%2C%22apiKey%22%3A%22wy745368rhtznnrprnqzp5dt%22%7D')
                    .reply(200, response);

                request(app)
                    .get(`/newsgraph/v3/?t_product=tcog&t_output=json&td_id=123&query=${query}&variables=${variables}`)
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(newsgraph.isDone()).to.equal(true);
                        expect(JSON.parse(res.text).data).to.deep.equal(JSON.parse(response));

                        done(err);
                    });
            });
        });
    });
});
