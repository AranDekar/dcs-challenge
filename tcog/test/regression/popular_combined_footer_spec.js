var specHelper = require('../spec_helper'),
    tcog = specHelper.tcog,
    expect = require('chai').expect,
    requester = require('./helpers/requester');

describe('*AGAINST PRODUCTION* URLs that must work!', function() {
    before(tcog.start);

    describe('popular-footer', function() {
        it('Major most popular lists must not be empty or contain more than ten stories', function(done) {
            var URL = 'component/popular-combined?t_product=tcog&t_domain=news.com.au,theaustralian.com.au,heraldsun.com.au';
            requester(URL, function(err, reply) {
                expect(err).to.not.be.ok;
                var listItems = reply.$('.most-pop-major ol li');
                expect(listItems.length).to.be.lt(11);
                expect(listItems.length).to.be.gt(9);
                done();
            });
        });

        it('tcog:primaryBound changes the most-pop-major list limit', function(done) {
            var URL = 'component/popular-combined?t_product=tcog&t_domain=dailytelegraph.com.au&td_primary_bound=5';
            requester(URL, function(err, reply) {
                expect(err).to.not.be.ok;
                var listItems = reply.$('.most-pop-major ol li');
                expect(listItems.length).to.be.lt(6);
                expect(listItems.length).to.be.gt(4);
                done();
            });
        });

        it('Standard most popular lists must not be empty or contain more than 5 stories', function(done) {
            var URL = 'component/popular-combined?t_product=tcog&t_domain=news.com.au,theaustralian.com.au,heraldsun.com.au';
            requester(URL, function(err, reply) {
                expect(err).to.not.be.ok;
                var listItems = reply.$('.most-pop-standard ol li');
                expect(listItems.length).to.be.lt(16);
                expect(listItems.length).to.be.gt(3);
                done();
            });
        });
    });
});
