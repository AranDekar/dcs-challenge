var specHelper = require('../spec_helper'),
    tcog = specHelper.tcog,
    expect = require('chai').expect,
    requester = require('./helpers/requester');

describe('*AGAINST PRODUCTION* URLs that must work!', function() {
    before(tcog.start);

    describe('popular-footer', function() {
        it('rel="track-mostpopfooter" ', function(done) {
            var URL = 'search?category=/section/theaustralian.com.au/collection/popular-content/nationalaffairs/24hours/&product=tcog&display:style=popular-footer';
            requester(URL, function(err, reply) {
                expect(err).to.not.be.ok;
                var links = reply.$("a[rel='track-mostpopfooter']");
                expect(links.length).to.be.gt(0);
                done();
            });
        });
    });
});
