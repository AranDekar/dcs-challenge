'use strict';

const service = require('./../../../../../service'),
    request = require('supertest'),
    expect = require('chai').expect,
    nock = require('nock');

const baseUrl = '/spp-api/v1/widgets/public/newscorpau_static_template-655/?widgetID=newscorpau_static_template-655&product=newscomau';

describe('SPP-API integration: public widget as html', () => {
    let wordpress;

    afterEach((done) => {
        nock.cleanAll();
        done();
    });

    it('converts to the correct outbound call', (done) => {
        wordpress = nock('http://tabula:3000/http://news.com.au/spp-api/v1/widgets/public/newscorpau_static_template-655')
                .log(console.log)
                .get('?widgetID=newscorpau_static_template-655')
                .reply(200, (uri, requestBody) => {});

        request(service)
            .get(baseUrl)
            .end(function(err, res) {
                expect(wordpress.isDone()).to.be.true;
                done();
            });
    });
});
