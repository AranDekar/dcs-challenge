var specHelper = require('../spec_helper'),
    tcog = specHelper.tcog,
    expect = require('chai').expect,
    requester = require('./helpers/requester');

describe('*AGAINST PRODUCTION* URLs that must work!', function() {
    before(tcog.start);

    describe('Content retrieve', function() {
        it('correctly returns an article against the retrieve endpoint', function(done) {
            var URL = 'news/content/v1/17d8cb2f5077fc8284cb3e6464769c8d?product=tcog';
            requester(URL, function(err, reply) {
                expect(err).to.not.be.ok;
                var contentItem = reply.$('.content-item'),
                    heading = reply.$('h4.heading').text();

                expect(contentItem.length).to.equal(1);
                expect(heading).to.match(/gillard/i);
                done();
            });
        });
    });
});
