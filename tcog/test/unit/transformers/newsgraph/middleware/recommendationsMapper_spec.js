const expect = require('chai').expect,
    recommendationsMapper = require('../../../../../transformers/newsgraph/middleware/recommendationsMapper'),
    _ = require('lodash');

describe('recommendationMapper middleware', () => {
    describe('res.locals.vidora present', () => {
        const res = {
            locals: {
                product: {
                    name: 'HeraldSun'
                },
                vidora: [
                    {id: '123'},
                    {id: '456'}
                ],
                newsgraph: {}
            }
        };
        it('check if res.locals.newsgraph.otherVariables is populated with ids', (done) => {
            recommendationsMapper({}, res, () => {
                expect(res.locals.newsgraph.otherVariables).to.have.all.keys(['ids']);
                done();
            });
        });
    });

    describe('res.locals.vidora absent', () => {
        const res = {
            locals: {
                vidora: [
                    {id: '123'},
                    {id: '456'}
                ],
                newsgraph: {}
            }
        };
        it('if res.locals.vidora is present then check res.locals.newsgraph.otherVariables is ONLY populated with apiKey', (done) => {
            recommendationsMapper({}, res, () => {
                expect(res.locals.newsgraph.otherVariables).to.have.all.keys(['ids']);
                done();
            });
        });
    });
});
