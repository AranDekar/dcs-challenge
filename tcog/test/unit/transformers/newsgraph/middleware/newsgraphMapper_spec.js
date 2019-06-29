const expect = require('chai').expect,
    graphqlMapper = require('../../../../../transformers/newsgraph/middleware/newsgraphMapper'),
    _ = require('lodash');

describe('newsgraphMapper middleware', () => {
    let res = {};

    beforeEach(() => {
        res = {
            locals: {
                query: {
                    query: 'query ($apiKey: String!, $ids: [String!]!) { getV3Resources(ids: $ids, apiKey: $apiKey) { results { ... on V3Article { id } } } } ',
                    variables: `{ "apiKey": "xga5uc89ar43exc2kfmerwtk" }`
                },
                newsgraph: {
                    otherVariables: {
                        apiKey: 'wy745368rhtznnrprnqzp5dt'
                    }
                },
                product: {
                    name: 'HeraldSun'
                }
            }
        };
    });

    it('check if res.locals.newsgraph has been set', (done) => {
        graphqlMapper({}, res, () => {
            expect(res.locals.newsgraph.query).to.not.be.empty;
            expect(res.locals.newsgraph.variables).to.not.be.empty;
            done();
        });
    });

    it('check if the right api_key and id values are written into res.locals.newsgraph.variables', (done) => {
        graphqlMapper({}, res, () => {
            expect(res.locals.newsgraph.variables).to.deep.include(`{"apiKey":"wy745368rhtznnrprnqzp5dt"}`);
            done();
        });
    });
});
