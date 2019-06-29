'use strict';

/**
 * The functionality tested here should be refactored so that the isAkamai boolean
 *  is set in one place, not two.
 */

const identifyAkamai = require('./../../../../lib/middleware').identifyAkamai,
    expect = require('chai').expect;

describe('setting req.isAkamai/res.isAkamai to true', () => {
    it('if the surrogate-capability header is present', (done) => {
        const res = {};

        const req = {
            headers: {
                'surrogate-capability': 'any value'
            }
        };

        identifyAkamai(req, res, () => {
            expect(req.isAkamai).to.be.true;
            expect(res.isAkamai).to.be.true;
            done();
        });
    });

    it('if the akamai-origin-hop header is present', (done) => {
        const res = {};

        const req = {
            headers: {
                'akamai-origin-hop': 'any value'
            }
        };

        identifyAkamai(req, res, () => {
            expect(req.isAkamai).to.be.true;
            expect(res.isAkamai).to.be.true;
            done();
        });
    });

    it('doesnt happen if the above headers are not present', (done) => {
        const res = {};

        const req = {
            headers: {}
        };

        identifyAkamai(req, res, () => {
            expect(req.isAkamai).to.be.undefined;
            expect(res.isAkamai).to.be.undefined;
            done();
        });
    });
});
