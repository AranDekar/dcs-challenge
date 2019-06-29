'use strict';

const service = require('./../../../../../service'),
    request = require('supertest'),
    expect = require('chai').expect,
    nock = require('nock');

const baseUrl = '/spp-api/v1/widgets/newscorpau_reference_widget-228?spp_api_key=XuE5eOv3o2Wa4WcljO6E3aQVo8rkmgUVthUN6TtOg-Y&t_product=the-australian';

describe('SPP-API integration: widgets', () => {
    let wordpress;

    afterEach((done) => {
        nock.cleanAll();
        done();
    });

    it('converts to the correct outbound call', (done) => {
        wordpress = nock('http://tabula:3000/http://theaustralian.com.au/spp-api/v1/widgets/newscorpau_reference_widget-228')
                .log(console.log)
                .get('?spp_api_key=XuE5eOv3o2Wa4WcljO6E3aQVo8rkmgUVthUN6TtOg-Y')
                .reply(200, (uri, requestBody) => {});

        request(service)
            .get(baseUrl)
            .end(function(err, res) {
                expect(wordpress.isDone()).to.be.true;
                done();
            });
    });

    it('it passes through the format URI parameter', (done) => {
        wordpress = nock('http://tabula:3000/http://theaustralian.com.au/spp-api/v1/widgets/newscorpau_reference_widget-228')
                .log(console.log)
                .get('?format=html&spp_api_key=XuE5eOv3o2Wa4WcljO6E3aQVo8rkmgUVthUN6TtOg-Y')
                .reply(200, (uri, requestBody) => {});

        request(service)
            .get(baseUrl + '&format=html')
            .end(function(err, res) {
                expect(wordpress.isDone()).to.be.true;
                done();
            });
    });
});
