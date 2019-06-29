var responseLocals = require('../../../../lib/middleware/response-locals'),
    expect = require('chai').expect,
    res = {};

describe('Response locals middleware', () => {
    before((done) => {
        responseLocals({}, res, done);
    });

    describe('creates res.locals to meet app depdencies', () => {
        it('res.locals.headers', () => {
            expect(res.locals.headers).to.be.an.object;
        });

        it('res.locals.config', () => {
            expect(res.locals.config).to.be.an.object;
        });

        it('res.locals.data', () => {
            expect(res.locals.data).to.be.an.object;
        });
    });
});
