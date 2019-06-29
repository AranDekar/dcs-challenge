'use strict';

const favicon = require('./../../../../lib/middleware').favicon,
    expect = require('chai').expect;

describe('favicon requests', () => {
    it('are swallowed on the URL', () => {
        let swallowed = false;

        const req = {
            url: '/favicon.ico'
        };

        const res = {
            end: () => {
                swallowed = true;
            }
        };

        favicon(req, res, null);

        expect(swallowed).to.be.true;
    });

    it('are only swallowed on the URL match', (done) => {
        const req = {
            url: '/notfavicon'
        };

        favicon(req, null, done);
    });
});
