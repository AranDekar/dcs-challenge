const tcog = require('../../../service'),
    expect = require('chai').expect,
    request = require('supertest');

describe('service', () => {
    describe('routes', () => {
        it('/fatwire', (done) => {
            request(tcog)
                .get('/fatwire/?t_product=FoxSports&domain=foxsports.com.au&cid=1227265469484')
                .expect(410)
                .end(done);
        });
    });
});
