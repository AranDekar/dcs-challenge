var base = '../../../../../../..',
    expect = require('chai').expect,
    normaliser = require(base + '/transformers/1.0/capi/v1/normalisers/get-section-from-url');

var testURLs = [
    {
        'url': 'http://www.newssit.com.au/national/breaking-news/the-best-quotes-of-2012/story-e6frfku9-1226536734450?sv=d7248f48d10cf0113836fc773a4e12dc',
        'sectionLink': '/national/breaking-news',
        'sectionName': 'Breaking News'
    },
    {
        'url': 'http://www.newssit.com.au/national/breaking-news/australias-winners-and-losers-of-2012/story-e6frfku9-1226536738841?sv=ead1992714e7fc385ce79e3a3d0c17a9',
        'sectionLink': '/national/breaking-news',
        'sectionName': 'Breaking News'
    },
    {
        'url': 'http://www.heraldsunsit.com.au/news/breaking-news/afl-legend-honoured-with-bravery-award/story-fni0xqi4-1226536621606?sv=8c5dbb2cd5a6ece22eabf41c9d89dfea',
        'sectionLink': '/news/breaking-news',
        'sectionName': 'Breaking News'
    },
    {
        'url': 'http://www.adelaidenowsit.com.au/sport/where-are-they-now-with-jesper-fjeldstad-this-week-bomber-clifford/story-fnii08h4-1226937600645?sv=d4c588f44beb57a7cc0117ce267abf1e',
        'sectionLink': '/sport',
        'sectionName': 'Sport'
    },
    {
        'url': 'http://www.theaustraliansit.com.au/sport/afl/after-16-months-we-still-dont-know-if-essendon-bombers-used-banned-drugs/story-fnca0u4y-1226940801757?sv=d5c3d9996d32b24b438ba1dcc4bd3745',
        'sectionLink': '/sport/afl',
        'sectionName': 'Afl'
    },
    {
        'url': 'http://www.heraldsunsit.com.au/sport/afl/recap-what-you-missed-on-tv-last-night-from-afl-360-talking-footy-on-the-couch-and-footy-classified/story-fnia3v71-1226940816675?sv=9f526cc02847f6f9e18b2b468b7d25c1',
        'sectionLink': '/sport/afl',
        'sectionName': 'Afl'
    },
    {
        'url': 'http://www.heraldsunsit.com.au/sport/special-features/footy-provides-an-oasis-of-hope/story-fnkxogit-1226936700096?sv=885a01912fc1f465c5fc8ef7398ae19c',
        'sectionLink': '/sport/special-features',
        'sectionName': 'Special Features'
    },
    {
        'url': 'http://www.newssit.com.au/entertainment/sport-newslist-aap-sport-newslist-for-weds-may-28/story-fni0b7jl-1226875768161?sv=c68cbc1070dd8b269e7577d325cbf7fd',
        'sectionLink': '/entertainment',
        'sectionName': 'Entertainment'
    },
    {
        'url': 'http://www.newssit.com.au/entertainment/afl-aflillness-hospitalises-hawks-afl-coach/story-fni0b7jl-1226875713624?sv=736cdaaeed151451c082ac604ee223a2',
        'sectionLink': '/entertainment',
        'sectionName': 'Entertainment'
    },
    {
        'url': 'http://www.theaustraliansit.com.au/news/in-your-dreams-kim/story-e6frg6n6-1226875620221?sv=f40d69428e9e4ab0717e7b251d5c3725',
        'sectionLink': '/news',
        'sectionName': 'News'
    },
    {
        'url': 'http://www.theaustraliansit.com.au/in-depth/gillon-mclachlan-takes-andrew-demetrious-afl-mantle/story-e6frgd26-1226873712796?sv=e584f592a15f9bd801c5e474d6047ccc',
        'sectionLink': '/in-depth',
        'sectionName': 'In Depth'
    },
    {
        'url': 'http://www.theaustraliansit.com.au/business/latest/flannery-takes-prime-stake-report/story-e6frg90f-1226873544955?sv=2904680660f36d2abaa6e6d7f11b63dd',
        'sectionLink': '/business/latest',
        'sectionName': 'Latest'
    },
    {
        'url': 'http://www.adelaidenow.com.au/news/national/footy-show-star-sam-newman-how-walking-the-kokoda-trail-changed-my-life/story-fni6ulvf-1226898194420?sv=ed2d43d457d3fdc1e7677b3159ba3120',
        'sectionLink': '/news/national',
        'sectionName': 'National'
    },
    {
        'url': 'http://www.adelaidenowsit.com.au/news/south-australia/afl-magpies-aflpies-ready-for-funny/story-fni6uo1m-1226873264646?sv=3ee54a06627cb57e2be9ff372c1fce94',
        'sectionLink': '/news/south-australia',
        'sectionName': 'South Australia'
    },
    {
        'url': 'http://www.dailytelegraph.com.au/news/opinion/afl-moots-saints-return-to-junction-oval/story-fni0cwl5-1226872283656?sv=b1f6cf0003e662954d999bd9d8ecfd1f',
        'sectionLink': '/news/opinion',
        'sectionName': 'Opinion'
    },
    {
        'url': 'http://www.theaustraliansit.com.au/50th-birthday/extended-headline-for-longform/story-fnlk0fie-1226870640331?sv=d30c5119f8069ded37a3dc3fa78fb73c',
        'sectionLink': '/50th-birthday',
        'sectionName': '50th Birthday'
    },
    {
        'url': 'http://www.heraldsunsit.com.au/afl/the-tackle-mark-robinson-says-scott-pendleburys-willpower-helped-pies-beat-sydney-swans/story-fnlt08l8-1226869127059?sv=75cea3179b78c88ab72ca02ca6725248',
        'sectionLink': '/afl',
        'sectionName': 'Afl'
    },
    {
        'url': 'http://www.couriermailsit.com.au/sport/more-sports/sports-media-and-broadcasting-legend-ian-frykberg-passes-away-after-lengthy-health-battle/story-fnii0hmp-1226869267214?sv=7a3c63e6802b52f1aeda96e5f0d0d98a',
        'sectionLink': '/sport/more-sports',
        'sectionName': 'More Sports'
    },
    {
        'url': 'http://www.heraldsun.com.au/news/victoria/no-scoreboard-ladder-or-match-results-for-junior-footballers-under-changes-to-be-unveiled-by-afl/story-fni0fit3-1226869120535?sv=9d94164713d172344d319eebb54d754c',
        'sectionLink': '/news/victoria',
        'sectionName': 'Victoria'
    },
    {
        'url': 'http://www.heraldsunsit.com.au/sport/afl/supercoach-studs-and-duds-from-round-2-afl-action/story-fnia3wm4-1226869037412?sv=7dd2e43b04a642fb6e07f4feb7a5424e',
        'sectionLink': '/sport/afl',
        'sectionName': 'Afl'
    }
];

describe('Get-section-from-url Normaliser', function() {
    it('Search results are modified to include a section link and section title', function() {
        var objectToNormalise = {
            data: {
                'results': testURLs.map(function(item) {
                    return {link: item.url};
                })
            }
        };

        normaliser(objectToNormalise);

        objectToNormalise.data.results.forEach(function(result, index) {
            expect(result.sectionLink).to.equal(testURLs[index].sectionLink);
            expect(result.sectionName).to.equal(testURLs[index].sectionName);
        });
    });

    it('Retrieve results are modified to include a section link and section title where the result to be modified is not contained in a results array', function() {
        var testsRun = 0;

        testURLs.forEach(function(item) {
            var objectToNormalise = { data: { link: item.url } };

            normaliser(objectToNormalise);
            expect(objectToNormalise.data.sectionLink).to.equal(item.sectionLink);
            expect(objectToNormalise.data.sectionName).to.equal(item.sectionName);
            testsRun++;
        });

        expect(testsRun).to.equal(testURLs.length);
    });

    it('A retrieve fixture is appropriately modified to include a section link', function() {
        var retrieveFixture = require('../../../../../../fixtures/api-content-retrieve1.json'),
            objectToNormalise = { data: retrieveFixture };

        normaliser(objectToNormalise);
        expect(objectToNormalise.data.sectionLink).to.equal('/news/opinion');
        expect(objectToNormalise.data.sectionName).to.equal('Opinion');
    });
});
