'use strict';

/* global afterEach:true, beforeEach:true */

var chai = require('chai'),
    nock = require('nock'),
    opsgenie = require('../../../../lib/opsgenie'),
    expect = chai.expect,
    conf = require('../../../../conf');

describe.skip('#module.exports', () => {
    let error,
        notificationData;

    beforeEach(function() {
        error = {
            message: 'a template error message'
        };

        notificationData = {
            product: 'masthead1',
            url: '/component/article/lifestyle/real-life/news-life/emperor-xi-jinping-china-enters-a-new-era-under-just-one-leader/news-story/2c22c1a34998a164055426f34e4d32eb?t_product=masthead1&t_template=../video/boom',
            template: '../video/boom'
        };
    });

    describe('with a configured opsgenie team & apiKey', () => {
        beforeEach(() => {
            conf.products.masthead1 = {
                opsgenieTeam: 'opsgenie-masthead1',
                opsgenieApiKey: 'abc'
            };
        });

        afterEach(() => {
            delete conf.products.masthead1;
            nock.cleanAll();
        });

        it('sends the correct data to opsgenie', (done) => {
            const opsgenieScope = nock('https://api.opsgenie.com:443')
                .log(console.log)
                .post('/v2/alerts')
                .reply(200, (uri, requestBody) => {
                    const expectedMessage = `TCOG Template ${conf.env}-${notificationData.product}-${notificationData.template}`;
                    expect(requestBody.message).to.equal(expectedMessage);
                    expect(requestBody.responders[0].name).to.equal(conf.products.masthead1.opsgenieTeam);
                    expect(requestBody.details.sentUTC).to.be.present;
                    expect(requestBody.details.product).to.equal(notificationData.product);
                    expect(requestBody.details.url).to.equal(notificationData.url);
                    expect(requestBody.details.template).to.equal(notificationData.template);
                    done();
                });

            opsgenie(error, notificationData, () => {});
        });
    });

    describe('without a configured opsgenieTeam & opsgenieApiKey', () => {
        afterEach(() => {
            nock.cleanAll();
        });

        it('doesnt send to opsgenie', (done) => {
            let skipped = true;

            nock('https://api.opsgenie.com:443')
                .log(console.log)
                .post('/v2/alerts')
                .reply(200, (uri, requestBody) => {
                    skipped = false;
                });

            opsgenie(error, notificationData, () => {
                expect(skipped).to.be.true;
                done();
            });
        });
    });
});
