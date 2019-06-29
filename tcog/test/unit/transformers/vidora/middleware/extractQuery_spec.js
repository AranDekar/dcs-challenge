const expect = require('chai').expect,
    extractQuery = require('../../../../../transformers/vidora/middleware/extractQuery');

const req = {
    query: {
        t_product: 'something', // not present
        tc_product: 'something', // not present
        td_product: 'something', // not present
        payment_type: 'subscription' // present
    }
};

const res = {
    locals: {}
};

describe('extract query', () => {
    it('extract non tcog query params into res.locals.vidoraQuery', () => {
        extractQuery(req, res, () => {
            expect(req.query.payment_type).to.equal(res.locals.vidoraQuery.payment_type);
        });
    });

    it('DO NOT extract tcog query params with t_ prefix into res.locals.vidoraQuery', () => {
        extractQuery(req, res, () => {
            expect(req.query.t_product).to.not.equal(res.locals.vidoraQuery.t_product);
        });
    });

    it('DO NOT extract tcog query params with tc_ prefix into res.locals.vidoraQuery', () => {
        extractQuery(req, res, () => {
            expect(req.query.tc_product).to.not.equal(res.locals.vidoraQuery.tc_product);
        });
    });

    it('DO NOT extract tcog query params with td_ prefix into res.locals.vidoraQuery', () => {
        extractQuery(req, res, () => {
            expect(req.query.td_product).to.not.equal(res.locals.vidoraQuery.td_product);
        });
    });
});
