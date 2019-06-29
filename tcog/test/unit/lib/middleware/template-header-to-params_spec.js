'use strict';

const _ = require('lodash'),
    middleware = require('../../../../lib/middleware/template-header-to-params'),
    expect = require('chai').expect;

const req = {
    headers: {
        'x-tcog-template': 's3/ncatemp/router@2.0.0&td_display=desktop'
    },
    query: {
    }
};
describe('NCA specific middleware (see code comments)', () => {
    it('alters the X-TCOG-Template and req.query values if env is nca', (done) => {
        const clonedReq = _.cloneDeep(req);
        middleware(clonedReq, null, (err) => {
            expect(err).to.not.be.okay;
            expect(req).to.not.deep.eq(clonedReq);
            expect(clonedReq.headers['x-tcog-template']).to.equal('s3/ncatemp/router@2.0.0');
            expect(clonedReq.query.td_display).equals('desktop');
            done();
        });
    });
});
