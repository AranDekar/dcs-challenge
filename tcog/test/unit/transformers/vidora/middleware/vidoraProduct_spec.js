const expect = require('chai').expect,
    vidoraProduct = require('../../../../../transformers/vidora/middleware/vidoraProduct');

const res = {
    locals: {
        vidoraProduct: {}
    }
};

describe('extract t_vidora_product query', () => {
    beforeEach(() => {
        res.locals = {};
    });

    it('extract t_vidora_product query param into res.locals.vidoraProduct and populate with keys', (done) => {
        const req = {
            query: {
                t_vidora_product: 'HeraldSun'
            }
        };

        vidoraProduct(req, res, () => {
            expect(res.locals.vidoraProduct).to.have.all.keys('capiV2Key', 'capiV3Key', 'vidoraKey');
            done();
        });
    });

    it('if there is no t_vidora_product query param then DO NOT populate res.locals.vidoraProduct', (done) => {
        const req = {
            query: {}
        };

        vidoraProduct(req, res, () => {
            expect(res.locals.vidoraProduct).to.be.empty;
            done();
        });
    });

    it('if there is a t_vidora_product query param but no mapping to a product then DO NOT populate res.locals.vidoraProduct', (done) => {
        const req = {
            query: {
                t_vidora_product: 'InvalidProduct'
            }
        };

        vidoraProduct(req, res, () => {
            expect(res.locals.vidoraProduct).to.be.empty;
            done();
        });
    });
});
