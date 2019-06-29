var componentPath = '../../../../../../../transformers/1.0/components',
    fixturePath = __dirname + '/../../../../../../fixtures/fatwire-cid-result.html',
    expect = require('chai').expect,

    // Require the actual component
    parseFatwireNav =
   require(componentPath + '/article/middleware/parse-fatwire-nav'),

    // Fixture
    fixture = require('fs').readFileSync(fixturePath, 'utf8');

describe('/component/article', function() {
    describe('#parseFatwireNav', function() {
        var navTree = null;
        before(function(done) {
            var res, req = { locals: { data: { fatwireData: fixture } } };
            res = req;
            parseFatwireNav(req, res, function() {
                navTree = res.locals.data.navigation;
                done();
            });
        });

        it('correctly parses level one heading items', function() {
            expect(navTree).to.be.an('array');
            expect(navTree.length).to.equal(10);
            expect(navTree[0]).to.be.an('object');

            [
                { 'text': 'News', 'link': '/news', 'listClasses': 'sectionref-news first' },
                { 'text': 'Sport', 'link': '/sport', 'listClasses': 'sectionref-sport' },
                { 'text': 'Entertainment', 'link': '/entertainment', 'listClasses': 'sectionref-entertainment' },
                { 'text': 'Business', 'link': '/business', 'listClasses': 'sectionref-business' },
                { 'text': 'Lifestyle', 'link': '/lifestyle', 'listClasses': 'sectionref-lifestyle', 'linkClasses': 'lifestyle-nlm' },
                { 'text': 'Video', 'link': 'http://m.video.couriermail.com.au/News', 'listClasses': 'sectionref-video' },
                { 'text': 'My Quick Links', 'link': 'http://m.couriermail.com.au/activity-centre#social-sections' },
                { 'text': 'My Reading List', 'link': 'http://m.couriermail.com.au/activity-centre#social-reading-list' },
                { 'text': 'My History', 'link': 'http://m.couriermail.com.au/activity-centre#social-history' },
                { 'text': 'Rewards', 'link': 'https://plusrewards.com.au/couriermail/offers', 'listClasses': 'last' }
            ].forEach(function(item, index) {
                Object.keys(item).forEach(function(key) {
                    expect(item[key]).to.equal(navTree[index][key]);
                });
            });
        });

        it('correctly nests children', function() {
            expect(navTree[0].children).to.be.an('array');

            var expectedLinks = [
                '/news/breaking-news',
                '/questnews',
                '/news/queensland',
                '/news/national',
                '/news/world',
                '/news/weird',
                '/technology',
                '/news/opinion',
                '/news/photos',
                'http://weather.couriermail.com.au'
            ];

            navTree[0].children.forEach(function(child, index) {
                expect(child.link).to.equal(expectedLinks[index]);
            });
        });
    });
});
