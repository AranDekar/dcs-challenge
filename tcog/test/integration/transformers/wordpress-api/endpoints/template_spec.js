'use strict';

const service = require('./../../../../../service'),
    request = require('supertest'),
    expect = require('chai').expect,
    nock = require('nock');

const baseUrl = '/spp-api/v1/template/?path=components.footer.footer&t_product=TownsvilleBulletin&domain=townsvillebulletin.com.au&w_isArticle=true';

describe('SPP-API integration: template', () => {
    let wordpress;

    afterEach((done) => {
        nock.cleanAll();
        done();
    });

    it('converts to the correct outbound call', (done) => {
        wordpress = nock('http://tabula:3000/http://townsvillebulletin.com.au/spp-api/v1/template/?domain=townsvillebulletin.com.au&path=components.footer.footer&w_isArticle=true')
                .log(console.log)
                .get('?domain=townsvillebulletin.com.au&path=components.footer.footer&w_isArticle=true')
                .reply(200, (uri, requestBody) => {});

        request(service)
            .get(baseUrl)
            .end(function(err, res) {
                expect(wordpress.isDone()).to.be.true;
                done();
            });
    });
});
