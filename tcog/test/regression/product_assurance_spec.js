var specHelper = require('../spec_helper'),
    tcog = specHelper.tcog,
    async = require('async'),
    cheerio = require('cheerio'),
    expect = require('chai').expect,
    html = require('html'),
    requester = require('./helpers/requester'),
    $;

var testURLs = function(urls, cb) {
    async.mapLimit(urls, 5, requester, cb);
};

describe('*AGAINST PRODUCTION* URLs that must work!', function() {
    before(tcog.start);

    describe('by product', function() {
        var productURLs;

        describe('Content Capability', function() {
            productURLs = [
                'common/search/placement/module?category=/section/theaustralian.com.au/collection/popular-content/all/today/&t_product=capability&tcog:templateconfig=breaking&tcog:preview=true&display:standfirst=false&display:thumbnail=false&display:kicker=false&pageSize=10',
                'collection/origin:fatwire.1226049188248?t_product=capability&offset=2',
                'search?category=/section/theaustralian.com.au/collection/popular-content/nationalaffairs/24hours/&t_product=capability&tcog:templateconfig=thumbnail&tcog:preview=true&display:standfirst=false&display:thumbnail=false&display:kicker=false&pageSize=10&display:module-header=Most+Popular+National+Affairs'
            ];

            productURLs.forEach(function(url) {
                it('url ' + url, function(done) {
                    testURLs([url], function(err, results) {
                        expect(err).to.not.be.ok;
                        results.forEach(function(result) {
                            expect(result.res.statusCode).to.equal(200);
                        });
                        done();
                    });
                });
            });
        });

        it('handles regular TCOG URLs successfully', function(done) {
            productURLs = [
                'common/search/placement/module?product=newscomau&origin=omniture&category=/section/news.com.au/collection/popular-content/news/national/today/&domain=news.com.au&display:style=popular-headline&display:module-header=most+read+national&pageSize=10',
                'common/search/placement/module?product=newscomau&origin=omniture&category=/section/news.com.au/collection/popular-content/news/world/today/&domain=news.com.au&display:style=popular-headline&display:module-header=most+read+world&pageSize=10',
                'common/search/placement/module?product=newscomau&origin=omniture&category=/section/news.com.au/collection/popular-content/finance/today/&domain=news.com.au&display:style=popular-headline&display:module-header=most+read+finance&pageSize=10',
                'common/search/placement/module?product=newscomau&origin=omniture&category=/section/news.com.au/collection/popular-content/sport/today/&domain=news.com.au&display:style=popular-headline&display:module-header=most+read+sport&pageSize=10',
                'common/search/placement/module?product=newscomau&origin=omniture&category=/section/news.com.au/collection/popular-content/entertainment/today/&domain=news.com.au&display:style=popular-headline&display:module-header=most+read+entertainment&pageSize=10',
                'common/search/placement/module?product=newscomau&origin=omniture&category=/section/news.com.au/collection/popular-content/lifestyle/today/&domain=news.com.au&display:style=popular-headline&display:module-header=most+read+lifestyle&pageSize=10',
                'common/search/placement/module?product=newscomau&origin=omniture&category=/section/news.com.au/collection/popular-content/travel/today/&domain=news.com.au&display:style=popular-headline&display:module-header=most+read+travel&pageSize=10',
                'common/search/placement/module?product=newscomau&origin=omniture&category=/section/news.com.au/collection/popular-content/technology/today/&domain=news.com.au&display:style=popular-headline&display:module-header=most+read+technology&pageSize=10',
                'search?product=newscomau&category=/section/dailytelegraph.com.au/collection/popular-content/all/today/&domain=dailytelegraph.com.au&origin=omniture&display:style=popular-headline&display:module-header=most+read+from&pageSize=10&display:module-classes=module-head-basic',
                'search?product=newscomau&category=/section/couriermail.com.au/collection/popular-content/all/today/&domain=couriermail.com.au&origin=omniture&display:style=popular-headline&display:module-header=most+read+from&pageSize=10&display:module-classes=module-head-basic',
                'search?category=/section/heraldsun.com.au/collection/popular-content/all/today/&domain=heraldsun.com.au&origin=omniture&display:style=popular-headline&display:module-header=most+read+from&product=newscomau&pageSize=10&display:module-classes=module-head-basic',
                'search?product=newscomau&category=/section/adelaidenow.com.au/collection/popular-content/all/today/&domain=adelaidenow.com.au&origin=omniture&display:style=popular-headline&display:module-header=most+read+from&pageSize=10&display:module-classes=module-head-basic',
                'search?product=newscomau&category=/section/perthnow.com.au/collection/popular-content/all/today/&domain=perthnow.com.au&origin=omniture&display:style=popular-headline&display:module-header=most+read+from&pageSize=10&display:module-classes=module-head-basic',
                'search?product=newscomau&category=/section/ntnews.com.au/collection/popular-content/all/today/&domain=ntnews.com.au&origin=omniture&display:style=popular-headline&display:module-header=most+read+from&pageSize=10&display:module-classes=module-head-basic',
                'search?product=newscomau&category=/section/themercury.com.au/collection/popular-content/all/today/&domain=themercury.com.au&origin=omniture&display:style=popular-headline&display:module-header=most+read+from&pageSize=10&display:module-classes=module-head-basic'
            ];
            testURLs(productURLs, function(err, results) {
                expect(err).to.not.be.ok;
                results.forEach(function(result) {
                    expect(result.res.statusCode).to.equal(200);
                });
                done();
            });
        });
    });
});
