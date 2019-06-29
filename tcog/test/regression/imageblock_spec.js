var specHelper = require('../spec_helper'),
    tcog = specHelper.tcog,
    requester = require('./helpers/requester'),
    expect = require('chai').expect,
    html = require('html');

describe('*AGAINST PRODUCTION* URLs that must work!', function() {
    before(tcog.start);

    describe('imageblock', function() {
        it.only('has at least one imageblock" ', function(done) {
            var URL = 'search?category=/section/theaustralian.com.au/collection/popular-content/nationalaffairs/24hours/&product=tcog&display:style=imageblock';
            requester(URL, function(err, reply) {
                expect(err).to.not.be.ok;
                var imageblocks = reply.$('div.image-block');
                expect(imageblocks.length).to.be.gt(0);
                done();
            });
        });

        it("imageblock div has a class attribute beginning with 'image-' and containing width and height", function(done) {
            var URL = 'search?category=/section/theaustralian.com.au/collection/popular-content/nationalaffairs/24hours/&product=tcog&display:style=imageblock';
            requester(URL, function(err, reply) {
                expect(err).to.not.be.ok;
                var imageblocks = reply.$('div.image-block');
                var imageblock = imageblocks[0];
                var cssClasses = imageblock.attribs.class;
                var classes = cssClasses.split(/\s/);
                expect(classes.length).to.be.gt(1);
                expect(classes[1]).to.match(/image\-\d+w\d+h/);
                done();
            });
        });

        it('storyblock div has classes holding the position of the item in the results', function(done) {
            var URL = 'search?category=/section/theaustralian.com.au/collection/popular-content/nationalaffairs/24hours/&product=tcog&display:style=imageblock';
            requester(URL, function(err, reply) {
                expect(err).to.not.be.ok;
                var storyblocks = reply.$('div.story-block');
                var storyblock = storyblocks[0];
                var cssClasses = storyblock.attribs.class;
                expect(cssClasses).to.match(/sbpos\-\d./);
                expect(cssClasses).to.match(/sbrpos\-\d./);
                done();
            });
        });
    });
});
