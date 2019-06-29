var specHelper = require('../spec_helper'),
    tcog = specHelper.tcog,
    expect = require('chai').expect,
    requester = require('./helpers/requester');

describe('*AGAINST PRODUCTION* URLs that must work!', function() {
    before(tcog.start);

    describe('popular-plain', function() {
        it('module-header URL parameter" ', function(done) {
            var URL = 'search?category=/section/theaustralian.com.au/collection/popular-content/nationalaffairs/24hours/&product=tcog&display:module-header=Test+Headline&display:style=popular-plain';
            requester(URL, function(err, reply) {
                expect(err).to.not.be.ok;
                expect(reply.$('h3.heading').text()).to.equal('Test Headline');
                done();
            });
        });

        it('module-classes URL parameter" ', function(done) {
            var URL = 'search?category=/section/theaustralian.com.au/collection/popular-content/nationalaffairs/24hours/&product=tcog&display:module-classes=one+two&display:style=popular-plain';
            requester(URL, function(err, reply) {
                expect(err).to.not.be.ok;
                expect(reply.$('div.module').attr('class')).to.equal('module most-popular one two');
                done();
            });
        });

        it('list item formatting" ', function(done) {
            var URL = 'search?category=/section/theaustralian.com.au/collection/popular-content/nationalaffairs/24hours/&product=tcog&display:module-classes=one+two&display:style=popular-plain';
            requester(URL, function(err, reply) {
                expect(err).to.not.be.ok;
                var links = reply.$('li.lipos-1');
                expect(links.length).to.equal(1);
                done();
            });
        });
    });
});
