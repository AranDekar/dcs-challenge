'use strict';

const service = require('./../../../../../service'),
    request = require('supertest'),
    expect = require('chai').expect,
    nock = require('nock');

const baseUrl = '/spp-api/v1/pages/?spp_api_key=xyz-Y&spp_api_pagename=story/budget-2017&t_product=the-australian&t_domain=theaustralian.com.au&t_contentType=application/json&td_pagepos=main-content-mobile&td_myprimarycategory=budget-2017&td_mysecondarycategory=primary-category-only&td_startcount=0&td_stopcount=999';

describe('SPP-API integration: pages', () => {
    let wordpress;

    afterEach((done) => {
        nock.cleanAll();
        done();
    });

    it('converts to the correct outbound call', (done) => {
        wordpress = nock('http://tabula:3000')
                .log(console.log)
                .get('/http://theaustralian.com.au/spp-api/v1/pages?spp_api_key=xyz-Y&spp_api_pagename=story%2Fbudget-2017')
                .reply(200, (uri, requestBody) => {});

        request(service)
            .get(baseUrl)
            .end(function(err, res) {
                expect(wordpress.isDone()).to.be.true;
                done();
            });
    });
});
