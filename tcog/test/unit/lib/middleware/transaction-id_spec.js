'use strict';

let uuid = require('uuid/v4'),
    analyser,
    EventEmitter = require('events').EventEmitter,
    transactionIdMiddleware,
    expect = require('chai').expect,
    headerObj = {};

const fakeResponse = {
    setHeader: (key, value) => {
        headerObj[key] = value;
    },

    on: () => {}
};

describe('transaction-id middleware', () => {
    beforeEach(function() {
        analyser = {
            isInitials: [],
            analyse: function(req, res, isInital) {
                this.isInitials.push(isInital);
            }
        };
        transactionIdMiddleware = require('../../../../lib/middleware/transaction-id_implementation')(uuid, analyser);
    });

    it('sets the X-Correlation-Id', (done) => {
        transactionIdMiddleware({}, fakeResponse, (err) => {
            expect(headerObj).to.be.ok;
            expect(Object.keys(headerObj)[0]).to.equal('X-Correlation-ID');

            done();
        });
    });
});
