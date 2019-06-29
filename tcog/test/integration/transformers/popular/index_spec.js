'use strict';

var express = require('express'),
    request = require('supertest'),
    expect = require('chai').expect,
    cheerio = require('cheerio'),
    nock = require('nock'),
    conf = require('../../../../conf'),
    router = require('./../../../../service');

let perthNowScope, perthNowFixture, capiScope, capiFixture;

describe('Popular-combined component', () => {
    beforeEach(() => {
        capiScope = nock('http://tabula:3000/http://cdn.newsapi.com.au')
            .log(console.log)
            .get(/content\/v2\/.*\/?api_key=.*/)
            .times(2)
            .reply(200, (uri, requestBody) => {
                return capiFixture;
            });

        perthNowScope = nock('http://tabula:3000/https://content.perthnow.com.au')
            .log(console.log)
            .get('/publication/popular')
            .reply(200, (uri, requestBody) => {
                return perthNowFixture;
            });
    });

    afterEach(() => {
        nock.cleanAll();
    });

    describe('when perthnow.com.au is specified as a domain', () => {
        it('delivers the expected JSON in res.local.data', (done) => {
            request(router)
                .get(
                '/component/popular-combined?t_product=tcog&t_domain=' +
                'news.com.au,perthnow.com.au,dailytelegraph.com.au'
                )
                .end(function(err, res) {
                    if (err) return done(err);
                    var $ = cheerio.load(res.text);
                    expect(capiScope.isDone()).to.be.true;
                    expect(perthNowScope.isDone()).to.be.true;
                    expect(res.text).to.match(/.*Bali volcano.*/);
                    expect($('.module').length).to.be.ok;
                    done();
                });
        });
    });
});

perthNowFixture = [
    {
        'url': 'https://www.perthnow.com.au/news/bali/bali-volcano-qantas-jetstar-rescue-flights-cancelled-as-mt-agung-ash-cloud-moves-ng-b88677555z',
        'title': 'Bali volcano: Qantas, Jetstar rescue flights cancelled as Mt Agung ash cloud moves'
    },
    {
        'url': 'https://www.perthnow.com.au/news/perth/perth-lord-mayor-lisa-scaffidi-to-learn-her-appeal-fate-ng-b88677433z',
        'title': 'Perth Lord Mayor Lisa Scaffidi wins appeal against travel, gift breaches'
    },
    {
        'url': 'https://www.perthnow.com.au/news/wa/the-social-lives-of-whale-sharks-have-been-revealed-in-a-22-year-study-that-tweaked-a-nasa-star-finder-tool-to-track-the-bus-sized-creatures-congregating-at-hotspots-across-the-globe-ng-b88677771z',
        'title': 'NASA star-finder tool tweaked to map thousands of whale sharks'
    },
    {
        'url': 'https://www.perthnow.com.au/business/your-money/perth-cheapest-mainland-state-to-live-ng-b88677346z',
        'title': 'Perth cheapest mainland state to live'
    },
    {
        'url': 'https://www.perthnow.com.au/politics/labor/local-government-association-refutes-barry-urbans-diploma-claims-ng-b88677355z',
        'title': 'Local Government Association refutes Barry Urban’s diploma claims'
    },
    {
        'url': 'https://www.perthnow.com.au/business/housing-market/latest-sales-figures-show-perth-property-prices-may-have-finally-bottomed-out-ng-b88677438z',
        'title': 'Latest sales figures show Perth property prices may have finally bottomed out'
    },
    {
        'url': 'https://www.perthnow.com.au/technology/south-korea-launched-a-counter-attack-within-six-minutes-of-kim-jong-uns-icbm-launch-ng-27b05325771a0d648828068d20195828',
        'title': 'South Korea launched a ‘counter attack’ within six minutes of Kim Jong-un’s ICBM launch'
    },
    {
        'url': 'https://www.perthnow.com.au/sport/cricket/perth-cricketer-alex-hepburn-facing-rape-charge-in-uk-ng-b88677254z',
        'title': 'Perth cricketer Alex Hepburn facing rape charge in UK'
    },
    {
        'url': 'https://www.perthnow.com.au/lifestyle/health-wellbeing/cervical-cancer-screening-five-yearly-hpv-replaces-pap-smear-ng-ab4183317ea79e5a8c7ecddd06dc9748',
        'title': 'Cervical cancer screening: five-yearly HPV replaces pap smear'
    },
    {
        'url': 'https://www.perthnow.com.au/news/vic/wild-weather-bureau-of-meteorology-urges-caution-ahead-of-severe-weather-event-ng-544cf8d5f1ceec5ea29f15fa5cc45471',
        'title': 'Wild weather: Victoria bracing for severe weather event'
    }
];

capiFixture = {
    'totalHits': 1,
    'offset': 0,
    'pageSize': 20,
    'results': [
        {
            'contentType': 'COLLECTION',
            'id': {
                'value': '9f75a8a9c204814645ffd6784943315f',
                'link': 'http://cdn.newsapi.com.au/content/v2/collection/9f75a8a9c204814645ffd6784943315f'
            },
            'originId': '/section/news.com.au/collection/popular-content/all/today/',
            'origin': 'OMNITURE',
            'title': 'Popular news story collection: /section/news.com.au/collection/popular-content/all/today/',
            'version': 'PUBLISHED',
            'dateUpdated': '2017-12-03T19:57:21.319Z',
            'dateLive': '2017-12-03T19:57:21.319Z',
            'dateCreated': '2017-12-03T19:57:21.319Z',
            'status': 'ACTIVE',
            'related': [
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': '96b855fe4bbcbba59ad508c898002a93',
                        'link': 'http://cdn.newsapi.com.au/content/v2/96b855fe4bbcbba59ad508c898002a93'
                    },
                    'originId': '29d2a81c-d580-11e7-8b48-4ba45b565343',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Forgotten hero of the Titanic',
                    'subtitle': 'John ‘Jack’ Phillips was the man known for trying to save the Titanic',
                    'description': 'AS WATER from the ocean deep began to fill the room, John Phillips refused to slow down.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/96b855fe4bbcbba59ad508c898002a93?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'news.com.au',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': '29d2a81c-d580-11e7-8b48-4ba45b565343',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T20:45:28.000Z',
                    'dateLive': '2017-12-03T13:29:00.000Z',
                    'customDate': '2017-12-03T20:45:00.000Z',
                    'dateCreated': '2017-11-30T03:40:09.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '2dfddb21b6777606c343f8b6517171bb',
                            'link': 'http://cdn.newsapi.com.au/image/v1/2dfddb21b6777606c343f8b6517171bb'
                        },
                        'originId': 'crop-48022aa8c250981ed788b65dfad7567e',
                        'origin': 'METHODE',
                        'title': "11/1997. As the ship sinks, lifeboats are rowed away in this scene from the epic film 'Titanic.' At $200 million, it is the costliest movie ever made and most anticipated of the holiday season. It is scheduled for release Dec. 19, 1997. (AP Photo/HO-Merie W. Wallace) /filmstills /ships /shipping-disasters",
                        'subtitle': '24d21d48-d57b-11e7-8b48-4ba45b565343',
                        'description': "11/1997. As the ship sinks, lifeboats are rowed away in this scene from the epic film 'Titanic.' At $200 million, it is the costliest movie ever made and most anticipated of the holiday season. It is scheduled for release Dec. 19, 1997. (AP Photo/HO-Merie W. Wallace) /filmstills /ships /shipping-disasters",
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/2dfddb21b6777606c343f8b6517171bb',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'AP',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T19:13:03.000Z',
                        'dateLive': '2017-12-03T13:29:00.000Z',
                        'dateCreated': '2017-11-30T03:04:13.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'categories': [],
                        'keywords': [
                            'holiday season',
                            'costliest movie',
                            'epic film',
                            'shipping-disasters',
                            'filmstills',
                            'ships',
                            'anticipated',
                            'HO-Merie W. Wallace',
                            'release',
                            'AP Photo',
                            'made',
                            'ship',
                            'Titanic',
                            'lifeboats',
                            'scene',
                            'sinks',
                            'season',
                            'costliest',
                            'holiday',
                            'Merie W. Wallace'
                        ],
                        'authors': [],
                        'domains': [
                            'newscorpaustralia.com',
                            'weeklytimesnow.com.au',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'clenchs',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '24d21d48d57b11e78b484ba45b565343',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': "11/1997. As the ship sinks, lifeboats are rowed away in this scene from the epic film 'Titanic.' At $200 million, it is the costliest movie ever made and most anticipated of the holiday season. It is scheduled for release Dec. 19, 1997. (AP Photo/HO-Merie W. Wallace) /filmstills /ships /shipping-disasters",
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '24d21d48-d57b-11e7-8b48-4ba45b565343',
                        'enterpriseAssetId': 'NEWSMMGLPICT000055164799',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'weeklytimesnow.com.au',
                            'link': 'http://www.weeklytimesnow.com.au/news/world/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        },
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/96b855fe4bbcbba59ad508c898002a93?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/lifestyle/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/lifestyle/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/lifestyle/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/lifestyle/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/lifestyle/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/lifestyle/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/lifestyle/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/lifestyle/real-life/true-stories/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/lifestyle/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/lifestyle/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/lifestyle/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/lifestyle/john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic/news-story/96b855fe4bbcbba59ad508c898002a93'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Real Life/True Stories/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Real%20Life/True%20Stories/',
                        'id': '1227105070628',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Real Life/True Stories/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Real%20Life/True%20Stories/',
                            'id': '1227105070628',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227105070628/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227105070628/',
                            'id': '1227105070628',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673762905',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226673762905/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226673762905/',
                            'id': '1226673762905',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/',
                            'id': '1226521171876',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226521171876/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226521171876/',
                            'id': '1226521171876',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/World/',
                            'id': '1226490532755',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226490532755/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226490532755/',
                            'id': '1226490532755',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Apple News/NewsComAu/Home/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Apple%20News/NewsComAu/Home/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227528026986/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227528026986/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Matt Young/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Matt%20Young/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/economy, business and finance/computing and information technology/wireless technology/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/economy,%20business%20and%20finance/computing%20and%20information%20technology/wireless%20technology/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/disaster and accident/flood/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/disaster%20and%20accident/flood/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/disaster and accident/rescue/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/disaster%20and%20accident/rescue/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/04003009/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/04003009/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/03005000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/03005000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/03017000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/03017000/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/wireless room/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/wireless%20room/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/wireless operator/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/wireless%20operator/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/upturned lifeboat/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/upturned%20lifeboat/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/senior wireless operator/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/senior%20wireless%20operator/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/British passenger liner/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/British%20passenger%20liner/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/fallen wireless operator/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/fallen%20wireless%20operator/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/rescue ship/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/rescue%20ship/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/set sail/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/set%20sail/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/ship Californian/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/ship%20Californian/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/family history/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/family%20history/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/passenger messages/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/passenger%20messages/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/stern section/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/stern%20section/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/maiden voyage/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/maiden%20voyage/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/electronic watertight doors/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/electronic%20watertight%20doors/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/watertight compartments/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/watertight%20compartments/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/dire warnings/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/dire%20warnings/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Harland and Wolff/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Harland%20and%20Wolff/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Rms Titanic Inc./otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Rms%20Titanic%20Inc./otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Junior Wireless Operator/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Junior%20Wireless%20Operator/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Belfast Morning News/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Belfast%20Morning%20News/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Senior Wireless Operator/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Senior%20Wireless%20Operator/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Chief Wireless Operator/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Chief%20Wireless%20Operator/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/John Phillips/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/John%20Phillips/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Smith/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Smith/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Lyn Wilton/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Lyn%20Wilton/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Matt Young/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Matt%20Young/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/New York/New York/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/New%20York/New%20York/',
                            'otcaConfidence': 92.2114,
                            'otcaRelevancy': 43.4957,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 40.714167,
                                'longitude': -74.006111
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Canada/Newfoundland and Labrador/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Canada/Newfoundland%20and%20Labrador/NOSUBURB/',
                            'otcaConfidence': 84.1263,
                            'otcaRelevancy': 37.3593,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Canada/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Canada/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 79.6279,
                            'otcaRelevancy': 37.3017,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United Kingdom/NOPROVINCESTATE/City of Southampton/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20Kingdom/NOPROVINCESTATE/City%20of%20Southampton/',
                            'otcaConfidence': 76.86,
                            'otcaRelevancy': 43.8915,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/England/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/England/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 75.1845,
                            'otcaRelevancy': 43.8307,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Ireland/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Ireland/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 74.0867,
                            'otcaRelevancy': 46.168,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/New South Wales/Sydney/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/New%20South%20Wales/Sydney/',
                            'otcaConfidence': 69.6505,
                            'otcaRelevancy': 49.2901,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': -33.867778,
                                'longitude': 151.207222
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/New York/New York/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/New%20York/New%20York/',
                            'otcaConfidence': 92.2114,
                            'otcaRelevancy': 43.4957,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 40.714167,
                                'longitude': -74.006111
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/Canada/Newfoundland and Labrador/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/Canada/Newfoundland%20and%20Labrador/NOSUBURB/',
                            'otcaConfidence': 84.1263,
                            'otcaRelevancy': 37.3593,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/Canada/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/Canada/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 79.6279,
                            'otcaRelevancy': 37.3017,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern Europe/United Kingdom/NOPROVINCESTATE/City of Southampton/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern%20Europe/United%20Kingdom/NOPROVINCESTATE/City%20of%20Southampton/',
                            'otcaConfidence': 76.86,
                            'otcaRelevancy': 43.8915,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern Europe/England/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern%20Europe/England/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 75.1845,
                            'otcaRelevancy': 43.8307,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern Europe/Ireland/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern%20Europe/Ireland/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 74.0867,
                            'otcaRelevancy': 46.168,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/New South Wales/Sydney/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/New%20South%20Wales/Sydney/',
                            'otcaConfidence': 69.6505,
                            'otcaRelevancy': 49.2901,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': -33.867778,
                                'longitude': 151.207222
                            }
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/Real Life/True stories/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/Real%20Life/True%20stories/',
                            'id': '1227105064273',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769552',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769553',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769550',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769549',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769551',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/Real%20Life/',
                            'id': '1226673807425',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462446',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956177',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462445',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956189',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226592254293',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462444',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956176',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/',
                            'id': '1226423680314',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226646528365',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956178',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956180',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956179',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Network%20News/World/',
                            'id': '1226628352350',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Network%20News/World/',
                            'id': '1226692643468',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Network%20News/World/',
                            'id': '1226696922805',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Network%20News/World/',
                            'id': '1226603199045',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Network%20News/World/',
                            'id': '1226696922808',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/weeklytimesnow.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/weeklytimesnow.com.au/Network%20News/World/',
                            'id': '1226696922806',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/World News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/World%20News/',
                            'id': '1226346011383',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Network%20News/World/',
                            'id': '1226646735401',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Network%20News/World/',
                            'id': '1226696922804',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Network%20News/World/',
                            'id': '1226696922807',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Network%20News/World/',
                            'id': '1226618422491',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Network%20News/World/',
                            'id': '1226618422489',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Network%20News/World/',
                            'id': '1226683748662',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'wireless room',
                        'wireless operator',
                        'upturned lifeboat',
                        'senior wireless operator',
                        'British passenger liner',
                        'fallen wireless operator',
                        'rescue ship',
                        'set sail',
                        'ship Californian',
                        'family history',
                        'passenger messages',
                        'stern section',
                        'maiden voyage',
                        'electronic watertight doors',
                        'watertight compartments',
                        'dire warnings',
                        'New York',
                        'United States of America',
                        'Northern America',
                        'North America',
                        'America',
                        'Newfoundland and Labrador',
                        'Canada',
                        'City of Southampton',
                        'United Kingdom',
                        'Northern Europe',
                        'Europe',
                        'England',
                        'Ireland',
                        'Sydney',
                        'New South Wales',
                        'Australia',
                        'Australia and New Zealand',
                        'Oceania',
                        'Harland and Wolff',
                        'Rms Titanic Inc.',
                        'Junior Wireless Operator',
                        'Belfast Morning News',
                        'Senior Wireless Operator',
                        'Chief Wireless Operator',
                        'John Phillips',
                        'Smith',
                        'Lyn Wilton',
                        'Matt Young'
                    ],
                    'authors': [
                        'Matt Young'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'weeklytimesnow.com.au',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '2dfddb21b6777606c343f8b6517171bb',
                                'link': 'http://cdn.newsapi.com.au/content/v2/2dfddb21b6777606c343f8b6517171bb'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-48022aa8c250981ed788b65dfad7567e',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '7476c2128d4aa66d89ad7a2a1c7880e6',
                                'link': 'http://cdn.newsapi.com.au/content/v2/7476c2128d4aa66d89ad7a2a1c7880e6'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-08b619b50fa75c1f2fa6c846f2958109',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '737819e6a600d5b8ac1336e8f956e34d',
                                'link': 'http://cdn.newsapi.com.au/content/v2/737819e6a600d5b8ac1336e8f956e34d'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-d53a8148022280699216a6d1e66240fd',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '1f0437acc2864b98a821861221cc0407',
                                'link': 'http://cdn.newsapi.com.au/content/v2/1f0437acc2864b98a821861221cc0407'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-bffbc8362261cb0f8954e51895331adc',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'b53971629a739130f9685898374fe2ed',
                                'link': 'http://cdn.newsapi.com.au/content/v2/b53971629a739130f9685898374fe2ed'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-176879b5094b53ced9859680d7ad3e8d',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '516e32ac827fa2d7491ffe64c83d9112',
                                'link': 'http://cdn.newsapi.com.au/content/v2/516e32ac827fa2d7491ffe64c83d9112'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-18ba967325011578c4ff7cace41559aa',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'c6e36ed0eb9d3d8049d1bb427649245f',
                                'link': 'http://cdn.newsapi.com.au/content/v2/c6e36ed0eb9d3d8049d1bb427649245f'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-9287d5af758d5b1dc1ff1679ab71bfa9',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'f4b0936473409ec212ebab442dfc592f',
                                'link': 'http://cdn.newsapi.com.au/content/v2/f4b0936473409ec212ebab442dfc592f'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-2d260312674be4638c12c97bdbaa54ae',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '457239c3afdec711ac87f7db234c9918',
                                'link': 'http://cdn.newsapi.com.au/content/v2/457239c3afdec711ac87f7db234c9918'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-84aeba6d40b1d4ab2cf636430c88ff4f',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'eb8cc66ac2a45db7488969ca6a75da54',
                                'link': 'http://cdn.newsapi.com.au/content/v2/eb8cc66ac2a45db7488969ca6a75da54'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-7d121a37657e34b08d34239cc74eb86b',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '7acf3b1be29fb1d4c7cb81b0dfd76b1b',
                                'link': 'http://cdn.newsapi.com.au/content/v2/7acf3b1be29fb1d4c7cb81b0dfd76b1b'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-a6d9a78e5f8c1243bfb44af259287e1c',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'a0878a367512eb81c228b52f2409b867',
                                'link': 'http://cdn.newsapi.com.au/content/v2/a0878a367512eb81c228b52f2409b867'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-1ee4e1a838aaacd244951133501554b5',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'eb4c51e2a4b28b663e35d45a72f3a3ef',
                                'link': 'http://cdn.newsapi.com.au/content/v2/eb4c51e2a4b28b663e35d45a72f3a3ef'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-adb61d31b9575fd7e4c7772d72d02af9',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'bd0112d3285a54395afd4199d2af0cec',
                                'link': 'http://cdn.newsapi.com.au/content/v2/bd0112d3285a54395afd4199d2af0cec'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-b14b9f416f567a655c5361dd8bc0dd5a',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '5b8fab6ee5c339435ad848fb8f0863c9',
                                'link': 'http://cdn.newsapi.com.au/content/v2/5b8fab6ee5c339435ad848fb8f0863c9'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-b95a2c37e9948a0c317c05506609fd24',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '8afa823733690b4bc86b76e37f778b3b',
                                'link': 'http://cdn.newsapi.com.au/content/v2/8afa823733690b4bc86b76e37f778b3b'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': 40.714167,
                            'longitude': -74.006111
                        },
                        {
                            'latitude': -33.867778,
                            'longitude': 151.207222
                        }
                    ],
                    'socialTitle': 'The story of the man who tried to save the Titanic',
                    'seoHeadline': 'The Titanic: John ‘Jack’ Phillips is the man who tried to save the ship',
                    'userOriginUpdated': 'clenchs',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'john-jack-phillips-was-the-man-known-for-trying-to-save-the-titanic',
                    'revision': 4,
                    'body': 'He had earlier shooed away the closest ships who had sent dire warnings of being “surrounded” by ice — and now he was trying to get them back.\n\nNicknamed Jack, the 25-year-old was the RMS Titanic’s Chief Wireless Operator at the time and he was under intense pressure to find a nearby saviour — the ship was sinking fast and there were not enough lifeboats to save its 2224 passengers on board.\n\nIt was 2.17am on April 15, 1912 and the British passenger liner’s side had ripped through an iceberg nearly three hours earlier. He could see the forward part of the ship flooding and knew time was of the essence. \n\nStopped in the dark of the night in the icy waters of the North Atlantic Ocean, slowly slipping towards a watery grave, Phillips continued to shoot messages across the sea in the hope of salvation. \n\nBut it was too late, there were only minutes left — and the ship lost power. She started to tilt upwards.\n\nCaptain Smith entered the wireless room and relieved them of their duties. There was nothing left to do, except survive.\n\nPhillips’ fate has been largely debated by scholars for decades. What we do know, however, is that his body was never recovered, and ever since, he’s been known as the man who tried to save the Titanic.\n\nPhillips’ story is one that has resonated throughout history but for Lyn Wilton, his has a bigger significance — the Australian recently discovered she was a relative of the fallen wireless operator on her father’s side.\n\n“This was a total surprise for me. I was pretty excited about it,” said Lyn, from Ambervale in Sydney’s southwest.\n\nUsing Ancestry, Lyn said she had already completed the bulk of her family tree when she was “starting to go up the branches to see the bits I missed out” when she made the discovery. \n\n“I saw some poor bugger had died on the Titanic, thinking it was really sad. I realised what an important role he played on the ship and I didn’t know what to do with myself.”\n\nHOW PHILLIPS TRIED TO SAVE THE TITANIC \n\nPhillips was promoted to senior wireless operator just one month before boarding the Titanic under the Marconi company. He was sent to the Harland and Wolff shipyard in Belfast, Ireland to join the White Star Line’s newest recruit on her maiden voyage. He spent his 25th birthday on board, two days before the disaster. \n\nAt the time, the Titanic was a marvel — an “unsinkable” mother ship, the largest passenger ship in the world that would float seamlessly along the sea. In 1911, the Belfast Morning News published a report touting the Titanic’s new era of modern technology: watertight compartments and electronic, watertight doors. \n\nThe Titanic set sail from Southampton, England, on April 10, 1912 and for four days, she steamed ahead towards New York City. \n\nWhen Phillips stepped aboard, he was joined by a junior wireless operator by the name of Harold Bride. Together, they installed the wireless equipment that would allow communications between passengers on and off board and allow communications with other ships nearby to warn of potential dangers at sea, notably icebergs.\n\nEventually, the pair would become the beacon that would help save at least some lives — 705 out of an estimated 2224 passengers on board.\n\nOn the night of April 14, 1912, Titanic made contact with an iceberg just before midnight, at 11.40pm. Titanic had received numerous warnings from ships cautioning her of the icy conditions ahead, but she kept moving.\n\nAt around 9.30pm, Phillips acknowledged a warning from the ship Mesaba reporting a large number of icebergs directly in Titanic’s path but it was never delivered to the Titanic’s bridge crew.\n\nOne of the last warnings came from the ship Californian, who was closest to the Titanic at the time, who was trying to warn the ship that it was surrounded by ice. The Californian had been forced to stop its engine after it too was surrounded by bergs.\n\n“Shut up! I am busy, I am working Cape Race,” Phillips snapped back to the Californian just 40 minutes before the ship struck. \n\nSome say if more attention had been paid to these messages, the Titanic might have lived to see another day.\n\nThat night, Phillips had been working tirelessly to clear a growing backlog of passenger messages after the system had broken down the prior day, sending them via Cape Race in Newfoundland, Canada.\n\nBride had entered the wireless room to take over Phillips’ shift just before midnight when Captain Smith entered the room and told Phillips to send out a distress signal and call for assistance. The news was grim.\n\nBoth Phillips and Bride worked tirelessly to send out SOS calls following instructions from Captain Smith. Both men carried on transmitting until Titanic lost power at 2.17am. The wireless room was flooding. She sunk just minutes later, at 2.20am.\n\nBride made it to an upturned lifeboat but Phillips’ fate has been widely debated since he was last seen alive heading towards Titanic’s aft.\n\nCharles Lightoller, the second officer on board who survived the sinking, later said that he saw Phillips on upturned lifeboat B, the same boat Bride had managed to swim to safety.\n\n“Phillips, the senior wireless operator, standing near me, told me the different ships that had answered our call,” he wrote in his autobiography, Titanic And Other Ships.\n\n“As it turned out, the information from Phillips, and the calculation, were about right, though poor old Phillips did not live to benefit by it. He hung on till daylight came in and we sighted one of the lifeboats in the distance...\n\n“I think it must have been the final and terrible anxiety that tipped the beam with Phillips, for he suddenly slipped down, sitting in the water, and though we held his head up, he never recovered. I insisted on taking him into the lifeboat with us, hoping there still might be life, but it was too late.”\n\nBride also reported seeing his body on the rescue ship Carpathia.\n\nYet according to experts, he most likely died “at the stern section with 1100 other people.”\n\n— Share your story: youngma@news.com.au \n\n— Discover your family history at Ancestry.com.au \n\n',
                    'standFirst': 'AS THE Titanic started to sink to its watery grave, there was one man who worked tirelessly to save it - John “Jack” Phillips. This is his incredible story.\n\n',
                    'kicker': 'Family history',
                    'byline': 'Matt Young',
                    'commentsAllowed': true,
                    'commentsTotal': 0,
                    'commentsShown': true,
                    'authorProfileIds': [
                        '710295aa609213191a54cd3f7218d130'
                    ],
                    'bylineNames': [
                        'Matt Young'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': 'ac87295f3b15e4e3ad3dada0b4f3e2c6',
                        'link': 'http://cdn.newsapi.com.au/content/v2/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                    },
                    'originId': '4f502f3a-d619-11e7-b5a9-0fbc45dc1ac5',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Aussie has the world’s best job',
                    'subtitle': '12 countries, 12 weeks, get paid: What it’s like to win the best job on the planet',
                    'description': 'IMAGINE getting paid $40,000 to spend three months globetrotting to some of the world’s most beautiful and exotic locations, staying in the very best luxury accommodation with all of your expenses and travel covered. Sounds pretty good right? For Sorelle Amore, 28, this quite literally, was a dream come true.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/ac87295f3b15e4e3ad3dada0b4f3e2c6?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'news.com.au',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': '4f502f3a-d619-11e7-b5a9-0fbc45dc1ac5',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T18:53:04.000Z',
                    'dateLive': '2017-12-03T08:07:00.000Z',
                    'customDate': '2017-12-03T18:53:00.000Z',
                    'dateCreated': '2017-11-30T21:56:25.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '60cfddd8b0ca49a429ce74517bbb9cae',
                            'link': 'http://cdn.newsapi.com.au/image/v1/60cfddd8b0ca49a429ce74517bbb9cae'
                        },
                        'originId': 'crop-1a22ad32320cac340be4f92f90b61e21',
                        'origin': 'METHODE',
                        'title': 'Winner of the best job in the world',
                        'subtitle': 'cfda5406-d618-11e7-b5a9-0fbc45dc1ac5',
                        'description': 'Winner of the best job in the world',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/60cfddd8b0ca49a429ce74517bbb9cae',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'Supplied',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T10:14:15.000Z',
                        'dateLive': '2017-12-03T08:07:00.000Z',
                        'dateCreated': '2017-11-30T21:52:51.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'categories': [],
                        'keywords': [],
                        'authors': [],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'clenchs',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': 'cfda5406d61811e7b5a90fbc45dc1ac5',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'DSC01862-Morocco.jpg',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': 'cfda5406-d618-11e7-b5a9-0fbc45dc1ac5',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/ac87295f3b15e4e3ad3dada0b4f3e2c6?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/travel/holiday-ideas/spa-luxury/12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet/news-story/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet/news-story/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/travel/holiday-ideas/spa-luxury/12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet/news-story/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/travel/holiday-ideas/spa-luxury/12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet/news-story/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet/news-story/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/news/12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet/news-story/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/travel/12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet/news-story/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/travel/travel-ideas/luxury/12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet/news-story/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/travel/holiday-ideas/ski/12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet/news-story/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/travel/12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet/news-story/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/travel/holiday-ideas/spa-luxury/12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet/news-story/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/news/12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet/news-story/ac87295f3b15e4e3ad3dada0b4f3e2c6'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Travel - News.com.au/Travel Ideas/Spa & Luxury/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Travel%20-%20News.com.au/Travel%20Ideas/Spa%20&%20Luxury/',
                        'id': '1226541287623',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Travel - News.com.au/Travel Ideas/Spa & Luxury/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Travel%20-%20News.com.au/Travel%20Ideas/Spa%20&%20Luxury/',
                            'id': '1226541287623',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226541287623/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226541287623/',
                            'id': '1226541287623',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Apple News/NewsComAu/Home/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Apple%20News/NewsComAu/Home/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227528026986/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227528026986/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Travel - News.com.au/Travel Ideas/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Travel%20-%20News.com.au/Travel%20Ideas/',
                            'id': '1226515132708',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226515132708/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226515132708/',
                            'id': '1226515132708',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Travel%20-%20News.com.au/',
                            'id': '1226515126871',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226515126871/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226515126871/',
                            'id': '1226515126871',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Kate Calacouras/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Kate%20Calacouras/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/economy, business and finance/tourism and leisure/hotel and accommodation/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/economy,%20business%20and%20finance/tourism%20and%20leisure/hotel%20and%20accommodation/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/lifestyle and leisure/travel and commuting/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/lifestyle%20and%20leisure/travel%20and%20commuting/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/04014002/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/04014002/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/10007000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/10007000/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/off-the-beaten path destination/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/off-the-beaten%20path%20destination/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/travel influencer/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/travel%20influencer/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/incredible castle/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/incredible%20castle/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/incredible beauty/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/incredible%20beauty/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/over-the-top opulant/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/over-the-top%20opulant/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/travel destination/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/travel%20destination/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/semi-nude photo shoots/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/semi-nude%20photo%20shoots/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/gig.Her accommodation/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/gig.Her%20accommodation/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/planet winner/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/planet%20winner/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/infinity-edge swimming pools/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/infinity-edge%20swimming%20pools/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/camera ready/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/camera%20ready/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/tourism videos/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/tourism%20videos/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/bedroom five-storey mansion/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/bedroom%20five-storey%20mansion/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/luxury destinations/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/luxury%20destinations/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/favourite locations/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/favourite%20locations/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/exotic locations/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/exotic%20locations/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Costa Rica/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Costa%20Rica/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 92.1669,
                            'otcaRelevancy': 62.1745,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Dominican Republic/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Dominican%20Republic/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 85.4774,
                            'otcaRelevancy': 48.7966,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/China/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/China/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 83.5596,
                            'otcaRelevancy': 62.0776,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Iceland/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Iceland/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 83.4459,
                            'otcaRelevancy': 46.2513,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 82.5022,
                            'otcaRelevancy': 61.8913,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Scotland/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Scotland/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 80.7297,
                            'otcaRelevancy': 70.2118,
                            'otcaFrequency': 4,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Bahamas/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Bahamas/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 75.5712,
                            'otcaRelevancy': 70.0892,
                            'otcaFrequency': 4,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Central America/Costa Rica/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Central%20America/Costa%20Rica/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 92.1669,
                            'otcaRelevancy': 62.1745,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Caribbean/Dominican Republic/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Caribbean/Dominican%20Republic/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 85.4774,
                            'otcaRelevancy': 48.7966,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Asia/NOSUBCONTINENT/Eastern Asia/China/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Asia/NOSUBCONTINENT/Eastern%20Asia/China/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 83.5596,
                            'otcaRelevancy': 62.0776,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern Europe/Iceland/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern%20Europe/Iceland/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 83.4459,
                            'otcaRelevancy': 46.2513,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 82.5022,
                            'otcaRelevancy': 61.8913,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern Europe/Scotland/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern%20Europe/Scotland/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 80.7297,
                            'otcaRelevancy': 70.2118,
                            'otcaFrequency': 4,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Caribbean/Bahamas/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Caribbean/Bahamas/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 75.5712,
                            'otcaRelevancy': 70.0892,
                            'otcaFrequency': 4,
                            'selected': 'auto'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/positive/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/positive/'
                        },
                        {
                            'value': '/display/couriermail.com.au/Travel - syndicated/Holiday Ideas/Spa & Luxury/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Travel%20-%20syndicated/Holiday%20Ideas/Spa%20&%20Luxury/',
                            'id': '1226646665787',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Travel - syndicated/Holiday Ideas/Spa & Luxury/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Travel%20-%20syndicated/Holiday%20Ideas/Spa%20&%20Luxury/',
                            'id': '1226617376955',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Travel - syndicated/Holiday Ideas/Spa & Luxury/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Travel%20-%20syndicated/Holiday%20Ideas/Spa%20&%20Luxury/',
                            'id': '1226617376953',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Travel - syndicated/Holiday Ideas/Ski/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Travel%20-%20syndicated/Holiday%20Ideas/Ski/',
                            'id': '1226596963867',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Travel - syndicated/Holiday Ideas/Spa & Luxury/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Travel%20-%20syndicated/Holiday%20Ideas/Spa%20&%20Luxury/',
                            'id': '1226617376954',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Travel/Travel Ideas/Luxury/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Travel/Travel%20Ideas/Luxury/',
                            'id': '1111112067672',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Travel - syndicated/Holiday Ideas/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Travel%20-%20syndicated/Holiday%20Ideas/',
                            'id': '1226646660574',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Travel - syndicated/Holiday Ideas/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Travel%20-%20syndicated/Holiday%20Ideas/',
                            'id': '1226617372794',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Travel - syndicated/Holiday Ideas/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Travel%20-%20syndicated/Holiday%20Ideas/',
                            'id': '1226617372796',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Travel - syndicated/Holiday Ideas/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Travel%20-%20syndicated/Holiday%20Ideas/',
                            'id': '1226596962860',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Travel - syndicated/Holiday Ideas/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Travel%20-%20syndicated/Holiday%20Ideas/',
                            'id': '1226617372795',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Travel/Travel Ideas/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Travel/Travel%20Ideas/',
                            'id': '1111112067645',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Travel - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Travel%20-%20syndicated/',
                            'id': '1226617365890',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Travel%20-%20News.com.au/',
                            'id': '1228033182299',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Travel - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Travel%20-%20syndicated/',
                            'id': '1226617365889',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Travel%20-%20News.com.au/',
                            'id': '1228033182298',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Travel - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Travel%20-%20syndicated/',
                            'id': '1226596961104',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Travel - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Travel%20-%20syndicated/',
                            'id': '1226617365888',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Travel%20-%20News.com.au/',
                            'id': '1228033182302',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Travel/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Travel/',
                            'id': '1111112067447',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Travel - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Travel%20-%20syndicated/',
                            'id': '1226646618129',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Travel%20-%20News.com.au/',
                            'id': '1228033182300',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Travel%20-%20News.com.au/',
                            'id': '1228033182301',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Travel%20-%20News.com.au/',
                            'id': '1228033182303',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'off-the-beaten path destination',
                        'travel influencer',
                        'incredible castle',
                        'incredible beauty',
                        'over-the-top opulant',
                        'travel destination',
                        'semi-nude photo shoots',
                        'gig.Her accommodation',
                        'planet winner',
                        'infinity-edge swimming pools',
                        'camera ready',
                        'tourism videos',
                        'bedroom five-storey mansion',
                        'luxury destinations',
                        'favourite locations',
                        'exotic locations',
                        'Costa Rica',
                        'Central America',
                        'North America',
                        'America',
                        'Dominican Republic',
                        'Caribbean',
                        'China',
                        'Eastern Asia',
                        'Asia',
                        'Iceland',
                        'Northern Europe',
                        'Europe',
                        'Australia',
                        'Australia and New Zealand',
                        'Oceania',
                        'Scotland',
                        'Bahamas'
                    ],
                    'authors': [
                        'Kate Calacouras'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '60cfddd8b0ca49a429ce74517bbb9cae',
                                'link': 'http://cdn.newsapi.com.au/content/v2/60cfddd8b0ca49a429ce74517bbb9cae'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-1a22ad32320cac340be4f92f90b61e21',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '9b78d218524b0240669c7ae8c0c3e263',
                                'link': 'http://cdn.newsapi.com.au/content/v2/9b78d218524b0240669c7ae8c0c3e263'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-be4b514bf2f8be3d5b6f5d4c9d707b7f',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '35155e689010a1f0a5641c99fdb5ce98',
                                'link': 'http://cdn.newsapi.com.au/content/v2/35155e689010a1f0a5641c99fdb5ce98'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-08f71d5d10a086e20f27a700d0fd629e',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '59cf296df896cb82be6fbca80b550352',
                                'link': 'http://cdn.newsapi.com.au/content/v2/59cf296df896cb82be6fbca80b550352'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-1a488eacce690b6a7f049c078960a885',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '3e300fe7253689b3b6f29284ffb1ae11',
                                'link': 'http://cdn.newsapi.com.au/content/v2/3e300fe7253689b3b6f29284ffb1ae11'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-752f44814e7e97363d754212871db31e',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '861252b9c81d3caaec2d3519d21aa6cd',
                                'link': 'http://cdn.newsapi.com.au/content/v2/861252b9c81d3caaec2d3519d21aa6cd'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-c3bebf83f460f59b7c9876b41c069b2a',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '7d38c445f58fe28df84df36630acc870',
                                'link': 'http://cdn.newsapi.com.au/content/v2/7d38c445f58fe28df84df36630acc870'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-32d8354ed43eae45049218540a86e000',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '83627a2fcbd26ef2c624d5719e23a858',
                                'link': 'http://cdn.newsapi.com.au/content/v2/83627a2fcbd26ef2c624d5719e23a858'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-066660d9714d527f76213d252a259d84',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'b46b248d38741c9b4f39a5b54f60f91e',
                                'link': 'http://cdn.newsapi.com.au/content/v2/b46b248d38741c9b4f39a5b54f60f91e'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-9808f6158d31726cef56bb1bd8b2a2b4',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'de5f892581a4628ca702a74a4058bbfd',
                                'link': 'http://cdn.newsapi.com.au/content/v2/de5f892581a4628ca702a74a4058bbfd'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-b54361eee6058577d0a2422d258553d9',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '7910e1317db9a00e25ac01c6a064352c',
                                'link': 'http://cdn.newsapi.com.au/content/v2/7910e1317db9a00e25ac01c6a064352c'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-8402f441f8870d1cd6b9e8a5da173be4',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'c93607313e4a60bf9b90bbe20ed2e6dc',
                                'link': 'http://cdn.newsapi.com.au/content/v2/c93607313e4a60bf9b90bbe20ed2e6dc'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-e46210933ea29ae2389100a6cd815c90',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'a13c43db192fdbe111b1b76dda39d39a',
                                'link': 'http://cdn.newsapi.com.au/content/v2/a13c43db192fdbe111b1b76dda39d39a'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-105d95ab373ac73c22afcac79e8f2be7',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '1f5951e61ee3f47192f8db96e421f2b1',
                                'link': 'http://cdn.newsapi.com.au/content/v2/1f5951e61ee3f47192f8db96e421f2b1'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [],
                    'socialTitle': 'Sorelle Amore got paid to show off 12 glamorous destinations',
                    'seoHeadline': 'Best job on the planet winner Sorelle Amore shows off luxury destinations',
                    'userOriginUpdated': 'clenchs',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': '12-countries-12-weeks-get-paid-what-its-like-to-win-the-best-job-on-the-planet',
                    'revision': 3,
                    'body': 'Beating 17,000 other applicants all competing for ThirdHome Best Job On The Planet, Sorelle Amore from Ballina in northern NSW was paid to document her travels and stay in 12 extravagant homes for 12 weeks in places like Scotland, Morocco, The Bahamas, Costa Rica and China before finishing up in Australia.\n\nEarlier this year, Sorelle wrote down her goal was to travel to 12 destinations and get paid for it, so she was shocked when her brother found the competition ad for the ‘Best Job On The Planet’.\n\n“It matched so perfectly to my goals, I was sure it was going to be me. I made sure I was truly vulnerable and honest in my video entries, pouring my heart into every single one. [ThirdHome] told me later that they liked how real I was. I was a goofball, but I guess normal, and people could relate. I think that’s what stood out — just me being me.”\n\nKicking off in July staying in a castle in Scotland, Sorelle was soon setting up shop in mansions, posh townhouses, villas and sprawling homes complete with infinity-edge swimming pools and stunning oceanfront views from Marrakesh to George Town. \n\nHer three favourite locations were the warm waters of the Bahamas where she swam with turtles and sharks, a stay in a 12-bedroom, five-storey mansion with eight staff in the Costa Rican rainforest, and the warm hospitality she experienced in China where she stayed close to the Great Wall. \n\n“I still don’t believe it’s real. I’m going to sit down soon and read through my diary as so much happened in such a short amount of time. I just experienced what some people will never experience in their lifetime, and I did it in three months. It was very intense but it’s for sure going to go down as one of the greatest times of my life.”\n\nAs glamorous as the life of a travel influencer may seem, though, it still has its challenges. Having to be picture-perfect all the time and constantly camera ready can take its toll, not to mention long stints of travel and alone time spent in airports. Sorelle said she just rolled with this, as she knew she had to churn out huge amounts of content week after week. Despite being able to take a friend along for the ride, she opted to spend seven out of the 12 weeks flying solo as she had often done in her previous travels. \n\n“There were three days out of the three months that I was like ‘I’m so sad’, but then it went away really quickly because I saw it from the perspective of the people around me,” she told news.com.au.\n\nSo how did she become an influencer and amass so many fans in the first place? \n\nAfter moving to Iceland from Australia two years ago on a whim inspired by a contestant on The Bachelorette, Sorelle found herself with a camera in hand and not much else to do other than take photos. Capturing otherworldly landscapes and producing quirky semi-nude photo shoots of herself in the snow, Sorelle’s Instagram began to grow and with it a lot of questions from her followers about Iceland as a travel destination. In an effort to answer their questions, she began to put together short tourism videos on YouTube. Before she knew it she’d amassed 100,000 subscribers which no doubt played a part in helping her land the Best Job On The Planet gig. \n\nNow with the world as her oyster, Sorelle plans to keep on doing what she does best — getting paid to travel and sharing tips with those wanting to follow in her footsteps.\n\n“I plan on doing what I’m doing and actually teaching people how to be a travel influencer because I discovered this is a really great way to live. Why would you not want to have a job like this?” \n\n',
                    'standFirst': 'SORELLE Amore’s ultimate goal seemed outrageous, but now she’s being paid to do what most people could only dream of.\n\n',
                    'kicker': 'Luxury travel',
                    'byline': 'Isabel Thomson-Officer',
                    'commentsAllowed': true,
                    'commentsTotal': 0,
                    'commentsShown': true,
                    'authorProfileIds': [
                        '945896f84d61e6b9830d063301c4dc8a'
                    ],
                    'bylineNames': [
                        'Isabel Thomson-Officer'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': '55a4a5164fc406b334cb59af186cc4c4',
                        'link': 'http://cdn.newsapi.com.au/content/v2/55a4a5164fc406b334cb59af186cc4c4'
                    },
                    'originId': 'db307bc4-d7e8-11e7-981c-07121f345a0f',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': '‘It’s a joke’: Blow-up over DRS',
                    'subtitle': 'Talking points from day two of the Second Ashes Test in Adelaide',
                    'description': 'SHAUN Marsh took control of the second Test on day two with a critic-answering century, his first in over 15 months, as the Aussies piled on the runs.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/55a4a5164fc406b334cb59af186cc4c4?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'news.com.au',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': 'db307bc4-d7e8-11e7-981c-07121f345a0f',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T20:16:59.000Z',
                    'dateLive': '2017-12-03T10:50:00.000Z',
                    'customDate': '2017-12-03T20:16:00.000Z',
                    'dateCreated': '2017-12-03T05:14:36.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': 'ca0cacb53fa3044a742b844bbb6359f9',
                            'link': 'http://cdn.newsapi.com.au/image/v1/ca0cacb53fa3044a742b844bbb6359f9'
                        },
                        'originId': 'crop-ce97ff7a2933f3e4eeeb84b0ab0aee62',
                        'origin': 'METHODE',
                        'title': 'Shaun Marsh DRS decision blow-up',
                        'subtitle': '23756fa6-d862-11e7-b5a9-0fbc45dc1ac5',
                        'description': 'Shaun Marsh DRS decision blow-up',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/ca0cacb53fa3044a742b844bbb6359f9',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'Channel 9',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T20:14:44.000Z',
                        'dateLive': '2017-12-03T10:50:00.000Z',
                        'dateCreated': '2017-12-03T19:42:47.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'primaryCategory': {
                            'value': '/author/newscorpaustralia.com/Clench, Samuel/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Clench,%20Samuel/'
                        },
                        'categories': [
                            {
                                'value': '/author/newscorpaustralia.com/Clench, Samuel/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Clench,%20Samuel/'
                            }
                        ],
                        'keywords': [],
                        'authors': [
                            'Clench, Samuel'
                        ],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'couriermail.com.au',
                            'goldcoastbulletin.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'bednallj',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '23756fa6d86211e7b5a90fbc45dc1ac5',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'marshdrs.JPG',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '23756fa6-d862-11e7-b5a9-0fbc45dc1ac5',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/55a4a5164fc406b334cb59af186cc4c4?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/sport/talking-points-from-day-two-of-the-second-ashes-test-in-adelaide/news-story/55a4a5164fc406b334cb59af186cc4c4'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/sport/talking-points-from-day-two-of-the-second-ashes-test-in-adelaide/news-story/55a4a5164fc406b334cb59af186cc4c4'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/sport/talking-points-from-day-two-of-the-second-ashes-test-in-adelaide/news-story/55a4a5164fc406b334cb59af186cc4c4'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/sport/talking-points-from-day-two-of-the-second-ashes-test-in-adelaide/news-story/55a4a5164fc406b334cb59af186cc4c4'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/sport/talking-points-from-day-two-of-the-second-ashes-test-in-adelaide/news-story/55a4a5164fc406b334cb59af186cc4c4'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/sport/talking-points-from-day-two-of-the-second-ashes-test-in-adelaide/news-story/55a4a5164fc406b334cb59af186cc4c4'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/sport/talking-points-from-day-two-of-the-second-ashes-test-in-adelaide/news-story/55a4a5164fc406b334cb59af186cc4c4'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/sport/cricket/the-ashes/talking-points-from-day-two-of-the-second-ashes-test-in-adelaide/news-story/55a4a5164fc406b334cb59af186cc4c4'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/sport/talking-points-from-day-two-of-the-second-ashes-test-in-adelaide/news-story/55a4a5164fc406b334cb59af186cc4c4'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/sport/talking-points-from-day-two-of-the-second-ashes-test-in-adelaide/news-story/55a4a5164fc406b334cb59af186cc4c4'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/sport/talking-points-from-day-two-of-the-second-ashes-test-in-adelaide/news-story/55a4a5164fc406b334cb59af186cc4c4'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/sport/talking-points-from-day-two-of-the-second-ashes-test-in-adelaide/news-story/55a4a5164fc406b334cb59af186cc4c4'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/Cricket news and galleries/Ashes/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/Ashes/',
                        'id': '1227347067025',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/Cricket news and galleries/Ashes/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/Ashes/',
                            'id': '1227347067025',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227347067025/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227347067025/',
                            'id': '1227347067025',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/',
                            'id': '1226487037076',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226487037076/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226487037076/',
                            'id': '1226487037076',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/All Sports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/All%20Sports/',
                            'id': '1226487051447',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226487051447/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226487051447/',
                            'id': '1226487051447',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/Cricket news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/',
                            'id': '1226507551544',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226507551544/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226507551544/',
                            'id': '1226507551544',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/James McKern/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/James%20McKern/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/sport/cricket/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/sport/cricket/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/human interest/people/celebrity/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/human%20interest/people/celebrity/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/social issue/abusive behaviour/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/social%20issue/abusive%20behaviour/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/15017000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/15017000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/08003002/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/08003002/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/14022000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/14022000/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/blockquote class/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/blockquote%20class/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/async src/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/async%20src/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Australian hero/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Australian%20hero/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Match changing stuff/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Match%20changing%20stuff/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/diabolical review system/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/diabolical%20review%20system/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/real shame/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/real%20shame/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/unsportsmanlike prat/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/unsportsmanlike%20prat/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/plumb dead/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/plumb%20dead/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/talking points/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/talking%20points/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/ruining cricket/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/ruining%20cricket/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/humble pie/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/humble%20pie/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/unconventional deep-in-the-crease stance/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/unconventional%20deep-in-the-crease%20stance/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Diabolical computers ruining/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Diabolical%20computers%20ruining/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/computers ruining cricket/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/computers%20ruining%20cricket/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Australian batting attack/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Australian%20batting%20attack/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/stalling tactics/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/stalling%20tactics/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/being run/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/being%20run/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/James Anderson/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/James%20Anderson/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Stuart Broad/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Stuart%20Broad/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Shaun Marsh/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Shaun%20Marsh/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Joe Root/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Joe%20Root/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Chris Lynn/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Chris%20Lynn/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Mark Nicholas/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Mark%20Nicholas/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Tim Paine/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Tim%20Paine/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Peter Handscomb/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Peter%20Handscomb/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Craig Overton/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Craig%20Overton/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/James McKern/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/James%20McKern/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Darren Berry/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Darren%20Berry/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Ashes— Tim Michell/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Ashes%E2%80%94%20Tim%20Michell/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Jon Ralph/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Jon%20Ralph/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Chris Woakes/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Chris%20Woakes/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/South Australia/Adelaide/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/South%20Australia/Adelaide/',
                            'otcaConfidence': 70.2263,
                            'otcaRelevancy': 61.9262,
                            'otcaFrequency': 3,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': -34.933333,
                                'longitude': 138.6
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 69.3924,
                            'otcaRelevancy': 58.42,
                            'otcaFrequency': 3,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/South Australia/Adelaide/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/South%20Australia/Adelaide/',
                            'otcaConfidence': 70.2263,
                            'otcaRelevancy': 61.9262,
                            'otcaFrequency': 3,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': -34.933333,
                                'longitude': 138.6
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 69.3924,
                            'otcaRelevancy': 58.42,
                            'otcaFrequency': 3,
                            'selected': 'auto'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/positive/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/positive/'
                        },
                        {
                            'value': '/display/news.com.au/Sport/Cricket/Ashes/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Sport/Cricket/Ashes/',
                            'id': '1227346985063',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Sport%20news%20and%20galleries/',
                            'id': '1226633804010',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Sport%20news%20and%20galleries/',
                            'id': '1227960774948',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Sport%20news%20and%20galleries/',
                            'id': '1226620933253',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Sport%20news%20and%20galleries/',
                            'id': '1227960774949',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Sport%20news%20and%20galleries/',
                            'id': '1226600307173',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Sport%20news%20and%20galleries/',
                            'id': '1226621617230',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Sport%20news%20and%20galleries/',
                            'id': '1227974998773',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Sport/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Sport/',
                            'id': '1226177573029',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Sport%20news%20and%20galleries/',
                            'id': '1226633804011',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Sport%20news%20and%20galleries/',
                            'id': '1227796732399',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Sport%20news%20and%20galleries/',
                            'id': '1227974998774',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Sport%20news%20and%20galleries/',
                            'id': '1227974993877',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Sport news and galleries/All Sports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Sport%20news%20and%20galleries/All%20Sports/',
                            'id': '1226647090407',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Sport news and galleries/All Sports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Sport%20news%20and%20galleries/All%20Sports/',
                            'id': '1226647090408',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Sport news and galleries/All Sports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Sport%20news%20and%20galleries/All%20Sports/',
                            'id': '1226643971853',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Sport news and galleries/All Sports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Sport%20news%20and%20galleries/All%20Sports/',
                            'id': '1226600325418',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Sport news and galleries/All Sports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Sport%20news%20and%20galleries/All%20Sports/',
                            'id': '1226643971852',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Sport/Sport/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Sport/Sport/',
                            'id': '1226396491529',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Sport news and galleries/Cricket news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/',
                            'id': '1226647094882',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Sport news and galleries/Cricket news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/',
                            'id': '1227975358651',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Sport news and galleries/Cricket news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/',
                            'id': '1226620936032',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Sport news and galleries/Cricket news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/',
                            'id': '1227975358655',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Sport news and galleries/Cricket news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/',
                            'id': '1226600327934',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Sport news and galleries/Cricket news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/',
                            'id': '1226621642094',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Sport news and galleries/Cricket news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/',
                            'id': '1227975358654',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Sport/Cricket/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Sport/Cricket/',
                            'id': '1226357859382',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Sport news and galleries/Cricket news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/',
                            'id': '1226647094881',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Sport news and galleries/Cricket news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/',
                            'id': '1227975358652',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Sport news and galleries/Cricket news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/',
                            'id': '1227975358653',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Sport news and galleries/Cricket news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Sport%20news%20and%20galleries/Cricket%20news%20and%20galleries/',
                            'id': '1227975358656',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'blockquote class',
                        'async src',
                        'Australian hero',
                        'Match changing stuff',
                        'diabolical review system',
                        'real shame',
                        'unsportsmanlike prat',
                        'plumb dead',
                        'talking points',
                        'ruining cricket',
                        'humble pie',
                        'unconventional deep-in-the-crease stance',
                        'Diabolical computers ruining',
                        'computers ruining cricket',
                        'Australian batting attack',
                        'stalling tactics',
                        'being run',
                        'Adelaide',
                        'South Australia',
                        'Australia',
                        'Australia and New Zealand',
                        'Oceania',
                        'James Anderson',
                        'Stuart Broad',
                        'Shaun Marsh',
                        'Joe Root',
                        'Chris Lynn',
                        'Mark Nicholas',
                        'Tim Paine',
                        'Peter Handscomb',
                        'Craig Overton',
                        'James McKern',
                        'Darren Berry',
                        'Ashes— Tim Michell',
                        'Jon Ralph',
                        'Chris Woakes'
                    ],
                    'authors': [
                        'James McKern'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'couriermail.com.au',
                        'goldcoastbulletin.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': 'ca0cacb53fa3044a742b844bbb6359f9',
                                'link': 'http://cdn.newsapi.com.au/content/v2/ca0cacb53fa3044a742b844bbb6359f9'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-ce97ff7a2933f3e4eeeb84b0ab0aee62',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '900fc8d10c0b368718a4315ba3f40694',
                                'link': 'http://cdn.newsapi.com.au/content/v2/900fc8d10c0b368718a4315ba3f40694'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-9ebb9992bc7e295e095a73585c44099f',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '5ae351071b0ab787b43010fc7983c1a1',
                                'link': 'http://cdn.newsapi.com.au/content/v2/5ae351071b0ab787b43010fc7983c1a1'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-be58ea8ae230c71d981ea7b49ec5bfea',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'e21e38b4c1ad915aea1cdc23f3687faf',
                                'link': 'http://cdn.newsapi.com.au/content/v2/e21e38b4c1ad915aea1cdc23f3687faf'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-d05db0aee54cda952f9455de9673ea9f',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '855ef0b315276bdd7e148c8626380d39',
                                'link': 'http://cdn.newsapi.com.au/content/v2/855ef0b315276bdd7e148c8626380d39'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-97a84566179e99b040f3b3ce5d4c8d50',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'ad31982efa91b7bbfec5e1bfb47d1cd2',
                                'link': 'http://cdn.newsapi.com.au/content/v2/ad31982efa91b7bbfec5e1bfb47d1cd2'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-e4bd90f40a8e7c2d35aeffed2d0be1dd',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'a00983356e6f5cd9e38602f9eea9e3df',
                                'link': 'http://cdn.newsapi.com.au/content/v2/a00983356e6f5cd9e38602f9eea9e3df'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-a6ec2cf0d7c028680f90d5d66cff2d1b',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '3abfd8428b4146e9694998f44670f19d',
                                'link': 'http://cdn.newsapi.com.au/content/v2/3abfd8428b4146e9694998f44670f19d'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-d2224015b406b0dbc916b02dd960bf1f',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '731d388da94ca4cab2efe1bc7adc82a3',
                                'link': 'http://cdn.newsapi.com.au/content/v2/731d388da94ca4cab2efe1bc7adc82a3'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-34724c6f914d34e2f3020b435633adaf',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '87af84d5eb62ed43026597ac9798f8ad',
                                'link': 'http://cdn.newsapi.com.au/content/v2/87af84d5eb62ed43026597ac9798f8ad'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '87af84d5eb62ed43026597ac9798f8ad',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '7e0a6ca9417b4972f30872259190c2c9',
                                'link': 'http://cdn.newsapi.com.au/content/v2/7e0a6ca9417b4972f30872259190c2c9'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '7e0a6ca9417b4972f30872259190c2c9',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '59c8c6cbe46316ea668e7c3a48423da5',
                                'link': 'http://cdn.newsapi.com.au/content/v2/59c8c6cbe46316ea668e7c3a48423da5'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '59c8c6cbe46316ea668e7c3a48423da5',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '2e2d52d35a0ec9098b97ba4dc3080b20',
                                'link': 'http://cdn.newsapi.com.au/content/v2/2e2d52d35a0ec9098b97ba4dc3080b20'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '2e2d52d35a0ec9098b97ba4dc3080b20',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'fd31756607bb98c39cf950893ebe9a89',
                                'link': 'http://cdn.newsapi.com.au/content/v2/fd31756607bb98c39cf950893ebe9a89'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'fd31756607bb98c39cf950893ebe9a89',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '873eeeae2c4ff9524d6e499243e9a490',
                                'link': 'http://cdn.newsapi.com.au/content/v2/873eeeae2c4ff9524d6e499243e9a490'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '873eeeae2c4ff9524d6e499243e9a490',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '002c474a91026a386a3de921a8b9823e',
                                'link': 'http://cdn.newsapi.com.au/content/v2/002c474a91026a386a3de921a8b9823e'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '002c474a91026a386a3de921a8b9823e',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '715e0bdb50706201e8c2f552b58ce530',
                                'link': 'http://cdn.newsapi.com.au/content/v2/715e0bdb50706201e8c2f552b58ce530'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '715e0bdb50706201e8c2f552b58ce530',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'c3a8fc3e684a5a25cb366b409f02e903',
                                'link': 'http://cdn.newsapi.com.au/content/v2/c3a8fc3e684a5a25cb366b409f02e903'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'c3a8fc3e684a5a25cb366b409f02e903',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'a53c712c1f6bb94b77c6e0f357aa45a6',
                                'link': 'http://cdn.newsapi.com.au/content/v2/a53c712c1f6bb94b77c6e0f357aa45a6'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'a53c712c1f6bb94b77c6e0f357aa45a6',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '15dd17ac6310a4104d36c68ce68115c2',
                                'link': 'http://cdn.newsapi.com.au/content/v2/15dd17ac6310a4104d36c68ce68115c2'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '15dd17ac6310a4104d36c68ce68115c2',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'b832791463f4b849416e0a54cfb31350',
                                'link': 'http://cdn.newsapi.com.au/content/v2/b832791463f4b849416e0a54cfb31350'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': -34.933333,
                            'longitude': 138.6
                        }
                    ],
                    'seoHeadline': 'Ashes 2017: Diabolical computers ruining cricket',
                    'userOriginUpdated': 'bednallj',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'talking-points-from-day-two-of-the-second-ashes-test-in-adelaide',
                    'revision': 6,
                    'body': 'The heated rivalry between the two sides went to another level after Stuart Broad dismissed Peter Handscomb in the first over of the day. The momentum then swung Australia’s way as they declared their first innings at 8/442 before rain hit late as England finished 1/29 at stumps.\n\nHere are all the talking points from the day’s play.\n\nCOMPUTERS RUNNING GAME \n\nControversy sparked during the Australian innings after two LBW decisions were overturned with the DRS.\n\nJames Anderson had both Shaun Marsh and Tim Paine trapped in front of their wickets and received the out call from the umpire.\n\nUnfortunately for the tourists, both calls were reviewed and with the DRS showing the ball was sailing over the top of the bails, both batters remained at the crease.\n\nWhile a majority of people agreed with the decisions — Nine commentator Mark Nicholas labelled Marsh’s “the review of the year” — not all were happy about the system.\n\nFormer Victorian wicketkeeper Darren Berry blasted the calls and slammed the game for being run by computers, labelling it a “joke”.\n\nROOT DOESN’T NEED ANOTHER TOSS \n\nEngland has no regrets at opting to bowl first in the Adelaide Test despite the call backfiring spectacularly. \n\nEngland captain Joe Root became the first captain electing to bowl first in an Adelaide Test since countryman Bob Willis in December 1982 — he lost that game by eight wickets. \n\nAnd only one team in history has won an Adelaide Test after bowling first — the then-mighty West Indies in February 1982.\n\nBut England coach Trevor Bayliss is defending Root’s controversial decision. “He wouldn’t do anything different,” Bayliss said. \n\n“It’s well-documented that one of our challenges, I suppose, is taking wickets on flatter wickets.\n\n“So Joe wanted to give our guys the best opportunity to take 20 wickets.\n\n“On this occasion, it didn’t work out our way even though I thought we bowled pretty well. That is just the way it is, that is the game of cricket.”\n\nBayliss said choosing to bowl first “certainly wasn’t an easy decision”. “It wasn’t taken lightly,” he said. \n\n“But for us to win games, we have got to take 20 wickets and that is what Joe thought our best opportunity was — to bowl first on a fresh wicket.” \n\n— AAP\n\nMARSH SERVES UP A SLICE OF HUMBLE PIE \n\nShaun Marsh overcame England’s stalling tactics to score his fifth Test century and ease doubts about his worth in the side.\n\nThe left-hander reached three figures with a pull shot off Chris Woakes that bisected two fielders in the deep to hit the rope.\n\nIt was a patient innings from the West Australian, who battled through a tough period midway through his dig where he lost his timing and couldn’t get off strike to raise his bat after 213 balls.\n\nJoe Root took plenty of time setting his field every delivery but Marsh kept his cool and scored his first Test ton since August, 2016.\n\nHis selection sparked plenty of debate as many fans around Australia questioned whether the 34-year-old — whose promise has largely outweighed his output — deserved to be recalled to the national team for an eighth time. But his innings in Adelaide silenced the haters and forced naysayers to eat a large slice of humble pie.\n\nMarsh was axed after this year’s Test tour of India and denied a Cricket Australia contract — it was hard not to feel like his time was finally up.\n\n“(Chairman of selectors) Trevor Hohns rang me and said the door wasn’t shut but six months ago I wasn’t sure whether I’d be back here,” Marsh told reporters. “I always dreamt of getting back in and sort of went away, just went to England and had some really good fun (playing domestic cricket) over there. I’m really happy I’ve got this last chance and happy with the way it’s going.” \n\nBROAD SLAMMED FOR SEND OFF \n\nPeter Handscomb was trapped LBW by Stuart Broad in the first over of day two and departed the crease before Australia could register a run for the morning.\n\nHandscomb’s unconventional deep-in-the-crease stance has been a hot topic this Test match and eventually cost him his wicket as Broad exposed his weakness.\n\nBroad got in Handscomb’s face after taking his wicket and copped a beating for an “unsportsmanlike” send-off after England went on record after the first Test complaining about Aussies “bullying” the tourists.\n\n',
                    'standFirst': 'TWO controversial umpiring reversals saved Australia yesterday, leading one former player to label the DRS system a “joke”.\n\n',
                    'kicker': 'Ashes',
                    'byline': 'James McKern',
                    'commentsAllowed': true,
                    'commentsTotal': 0,
                    'commentsShown': true,
                    'authorProfileIds': [],
                    'bylineNames': [
                        'James McKern'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': '6936453f7186357ed8a277e224ad8575',
                        'link': 'http://cdn.newsapi.com.au/content/v2/6936453f7186357ed8a277e224ad8575'
                    },
                    'originId': 'e7d91a80-d800-11e7-a38d-10a36ef4cb34',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Pink: Trump is ‘unbelievable’',
                    'subtitle': 'Pink is raising her kids gender-neutral and says Trump is ‘f***ing unbelievable’',
                    'description': 'PINK has opened up about how she’s raising her kids as gender neutral, and shared what she really thinks of Donald Trump.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/6936453f7186357ed8a277e224ad8575?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'News Corp Australia Network',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': 'e7d91a80-d800-11e7-a38d-10a36ef4cb34',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T09:54:06.000Z',
                    'dateLive': '2017-12-03T09:07:00.000Z',
                    'customDate': '2017-12-03T09:53:00.000Z',
                    'dateCreated': '2017-12-03T08:06:45.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '989e9f574426bdcccaf64c5dec4bd177',
                            'link': 'http://cdn.newsapi.com.au/image/v1/989e9f574426bdcccaf64c5dec4bd177'
                        },
                        'originId': 'crop-c6379d0100ce8b186ae14e9e5d838b80',
                        'origin': 'METHODE',
                        'title': 'American Music Awards - Arrivals',
                        'subtitle': 'ac4d7e16-d800-11e7-a38d-10a36ef4cb34',
                        'description': 'Singer Pink arrives at the 2017 American Music Awards, on November 19, 2017, in Los Angeles, California. / AFP PHOTO / MARK RALSTON',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/989e9f574426bdcccaf64c5dec4bd177',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'AFP',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T09:42:49.000Z',
                        'dateLive': '2017-12-03T09:07:00.000Z',
                        'dateCreated': '2017-12-03T08:05:06.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'primaryCategory': {
                            'value': '/author/newscorpaustralia.com/MARK RALSTON/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/MARK%20RALSTON/'
                        },
                        'categories': [
                            {
                                'value': '/author/newscorpaustralia.com/MARK RALSTON/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/MARK%20RALSTON/'
                            },
                            {
                                'value': '/location/iptc.org/United States/California/Los Angeles/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/location/iptc.org/United%20States/California/Los%20Angeles/',
                                'selected': 'auto'
                            },
                            {
                                'value': '/countrycode/iptc.org/USA/California/Los Angeles/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/countrycode/iptc.org/USA/California/Los%20Angeles/',
                                'selected': 'auto'
                            }
                        ],
                        'keywords': [
                            'music',
                            'awards',
                            'photo',
                            'Agence France Presse'
                        ],
                        'authors': [
                            'MARK RALSTON'
                        ],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'sichlauk',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': 'ac4d7e16d80011e7a38d10a36ef4cb34',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'US-ENTERTAINMENT-AMERICAN MUSIC AWARDS-ARRIVALS',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': 'ac4d7e16-d800-11e7-a38d-10a36ef4cb34',
                        'enterpriseAssetId': 'NEWSMMGLPICT000168337692',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/6936453f7186357ed8a277e224ad8575?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/entertainment/celebrity/pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable/news-story/6936453f7186357ed8a277e224ad8575'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/entertainment/pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable/news-story/6936453f7186357ed8a277e224ad8575'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/entertainment/celebrity/pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable/news-story/6936453f7186357ed8a277e224ad8575'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/entertainment/celebrity/pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable/news-story/6936453f7186357ed8a277e224ad8575'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/entertainment/pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable/news-story/6936453f7186357ed8a277e224ad8575'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/entertainment/pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable/news-story/6936453f7186357ed8a277e224ad8575'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/entertainment/pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable/news-story/6936453f7186357ed8a277e224ad8575'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/entertainment/celebrity-life/pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable/news-story/6936453f7186357ed8a277e224ad8575'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/entertainment/celebrity/pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable/news-story/6936453f7186357ed8a277e224ad8575'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/entertainment/pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable/news-story/6936453f7186357ed8a277e224ad8575'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/entertainment/celebrity/pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable/news-story/6936453f7186357ed8a277e224ad8575'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/entertainment/pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable/news-story/6936453f7186357ed8a277e224ad8575'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Life/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Life/',
                        'id': '1226496181309',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Life/',
                            'id': '1226496181309',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226496181309/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226496181309/',
                            'id': '1226496181309',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/',
                            'id': '1226494497264',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226494497264/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226494497264/',
                            'id': '1226494497264',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Katrina Sichlau/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Katrina%20Sichlau/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/social issue/family/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/social%20issue/family/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/human interest/people/celebrity/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/human%20interest/people/celebrity/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/14006000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/14006000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/08003002/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/08003002/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/gender neutral/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/gender%20neutral/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/singer Pink/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/singer%20Pink/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/ing unbelievable/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/ing%20unbelievable/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/daughter Willow/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/daughter%20Willow/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/traditional gender roles/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/traditional%20gender%20roles/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/pop superstar/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/pop%20superstar/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Willow Sage Hart/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Willow%20Sage%20Hart/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Beautiful trauma video/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Beautiful%20trauma%20video/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/trauma video clip/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/trauma%20video%20clip/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/sexual misconduct allegations/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/sexual%20misconduct%20allegations/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/hit reality show/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/hit%20reality%20show/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/staff writers/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/staff%20writers/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/style housewife/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/style%20housewife/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/label-less household/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/label-less%20household/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Baby girl/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Baby%20girl/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/gender neutral bathroom/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/gender%20neutral%20bathroom/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/clean-up operation/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/clean-up%20operation/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Getty Images Inc./otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Getty%20Images%20Inc./otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Agence France Presse/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Agence%20France%20Presse/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Jeremy Piven/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Jeremy%20Piven/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Donald Trump/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Donald%20Trump/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Alecia Moore/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Alecia%20Moore/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Jameson/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Jameson/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Channing Tatum/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Channing%20Tatum/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Ryan Pierse/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Ryan%20Pierse/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 69.0594,
                            'otcaRelevancy': 51.5561,
                            'otcaFrequency': 3,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 69.0594,
                            'otcaRelevancy': 51.5561,
                            'otcaFrequency': 3,
                            'selected': 'auto'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/positive/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/positive/'
                        },
                        {
                            'value': '/display/couriermail.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226646434873',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226617389624',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226617389621',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226597362952',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226617389623',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/Celebrity Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/Celebrity%20Life/',
                            'id': '1226072982788',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369329',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935502',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369324',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935504',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226588210335',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369322',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935507',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/',
                            'id': '1111112062929',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226637326589',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935503',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935505',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935506',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'gender neutral',
                        'singer Pink',
                        'ing unbelievable',
                        'daughter Willow',
                        'traditional gender roles',
                        'pop superstar',
                        'Willow Sage Hart',
                        'Beautiful trauma video',
                        'trauma video clip',
                        'sexual misconduct allegations',
                        'hit reality show',
                        'staff writers',
                        'style housewife',
                        'label-less household',
                        'Baby girl',
                        'gender neutral bathroom',
                        'clean-up operation',
                        'United States of America',
                        'Northern America',
                        'North America',
                        'America',
                        'Getty Images Inc.',
                        'Agence France Presse',
                        'Jeremy Piven',
                        'Donald Trump',
                        'Alecia Moore',
                        'Jameson',
                        'Channing Tatum',
                        'Ryan Pierse'
                    ],
                    'authors': [
                        'Katrina Sichlau'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '989e9f574426bdcccaf64c5dec4bd177',
                                'link': 'http://cdn.newsapi.com.au/content/v2/989e9f574426bdcccaf64c5dec4bd177'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-c6379d0100ce8b186ae14e9e5d838b80',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '67bebdd1183dec7b7bf816dabb3a240b',
                                'link': 'http://cdn.newsapi.com.au/content/v2/67bebdd1183dec7b7bf816dabb3a240b'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-d5290aca140dcb1effa9e5ff122cc098',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '640daec78e47f1c21e99b22d03e3add2',
                                'link': 'http://cdn.newsapi.com.au/content/v2/640daec78e47f1c21e99b22d03e3add2'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-2100c2f88974982ea5605cb963ffb887',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '588f8cbfd259a7fc035faa0a664b12b3',
                                'link': 'http://cdn.newsapi.com.au/content/v2/588f8cbfd259a7fc035faa0a664b12b3'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-ca6bc03317448f05351004807db335d1',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '896c6a6991c3cee38e36b28c52565c9d',
                                'link': 'http://cdn.newsapi.com.au/content/v2/896c6a6991c3cee38e36b28c52565c9d'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-d3a7441b73aa2227e7f88a1380ea02f3',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '7bc18ac76cae79d715f03e2dc2979b0b',
                                'link': 'http://cdn.newsapi.com.au/content/v2/7bc18ac76cae79d715f03e2dc2979b0b'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-33612a312880749c4dbc2b91ff096a09',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '7f648820988b50f5c78210b9c7edad0e',
                                'link': 'http://cdn.newsapi.com.au/content/v2/7f648820988b50f5c78210b9c7edad0e'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-98c6421f53d36768ee1d99def505d981',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '1570883410391399be777412db345ae7',
                                'link': 'http://cdn.newsapi.com.au/content/v2/1570883410391399be777412db345ae7'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-8466ca15af9ed3d879e37795a9e9c0b5',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'bafb9b2f11daee4f5a07f034b47742a5',
                                'link': 'http://cdn.newsapi.com.au/content/v2/bafb9b2f11daee4f5a07f034b47742a5'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-4245950fb5fbf63dca89274240e3f08f',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '76eaed48160fdb2e14cc05158ac6c3ad',
                                'link': 'http://cdn.newsapi.com.au/content/v2/76eaed48160fdb2e14cc05158ac6c3ad'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'UNCLASSIFIED',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '6e7a6352cae15142af93ae046e563ecd',
                                'link': 'http://cdn.newsapi.com.au/content/v2/6e7a6352cae15142af93ae046e563ecd'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [],
                    'socialTitle': 'Pink slams Donald Trump: ‘There’s zero there’',
                    'seoHeadline': 'Pink is raising her kids gender-neutral and says Trump is ‘f***ing unbelievable’',
                    'userOriginUpdated': 'sichlauk',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'pink-is-raising-her-kids-genderneutral-and-says-trump-is-fing-unbelievable',
                    'revision': 10,
                    'body': 'The Beautiful Trauma singer told The People that she does not want to impose traditional gender roles on her two children, six-year-old daughter Willow and 11-month-old son Jameson.\n\n“We are a very label-less household,” the popstar said of her family with motorcycle racer Carey Hart. \n\n“Last week Willow told me she is going to marry an African woman. I was like: ‘Great, can you teach me how to make African food?’” Pink said.\n\n“And she’s like: ‘Sure Mama, and we are going to live with you while our house is getting ready.’”\n\nThe singer also shared her reaction to seeing a gender neutral bathroom in a school:\n\n“I was in a school and the bathroom outside the kindergarten said: ‘Gender Neutral — anybody’, and it was a drawing of many different shapes.\n\n“I took a picture of it and I wrote: ‘Progress’. I thought that was awesome. I love that kids are having this conversation,” the 38-year-old told The People.\n\nThe singer was applauded earlier this year when she delivered a heartwarming speech at the VMAs in which she explained the true meaning of beauty to her daughter after the six-year-old told her “I’m the ugliest girl I know” and that she “looks like a boy”. \n\nIn the speech, Pink recounted the story, saying: “‘Well what do you think I look like?’ And she said, ‘Well you’re beautiful.’ And I was like, ‘Well, thanks. But when people make fun of me, that’s what they use. They say I look like a boy or I’m too masculine or I have too many opinions, my body is too strong.’”\n\nShe went on to say: “Baby girl, we don’t change. We take the gravel and the shell and we make a pearl. And we help other people to change so they can see more kinds of beauty.’”\n\nIn her latest video, for the single Beautiful Trauma, Pink addresses traditional gender roles by appearing as stereotypical 50s style housewife with her husband, played by Channing Tatum. When she catches Tatum dressed as a woman, she reacts with joy and the pair then dance with her in a suit and tie and him in a dress.\n\nBeautiful trauma video clip \n\nMeanwhile, Pink, whose real name is Alecia Moore, told The Sun that she couldn’t be a judge on The X Factor, ahead of a performance on the UK version of the hit reality show.\n\nThe singer revealed in an interview with The Sun that she is not suited to the job: “Would I be an X Factor judge? Nope. I’m not ­diplomatic and I wouldn’t be helpful.\n\n“I would be so uncomfortable the whole time because I wouldn’t want to be mean to anyone, but then I wouldn’t want to bulls**t anyone.\n\n“Everyone who does it is so talented and nice — they can have it.”\n\nHowever, one person Pink does has rude words for is US President Donald Trump, reports The Sun.\n\nEarlier this week she tweeted that actor Jeremy Piven was more heavily punished for sexual misconduct allegations than the US President. \n\nWhen asked about her ­political views, the star said: “The world the way it is now is dicey, dicey. It’s crazy times.\n\n“Every morning I wake up, throw my hands up in the air and I’m like, ‘F***ing unbelievable, this is unbelievable.’\n\n“What’s my reaction to Trump? Simply f***ing unbelievable.\n\n“There is no good stuff with him, no good stuff at all. There’s zero there. I just want this part over so we can get to the clean-up operation.”\n\nPart of this story originally appeared in The Sun. \n\n',
                    'standFirst': 'POP superstar Pink opens up about raising her kids as gender neutral, and shares what she really thinks of President Trump.\n\n',
                    'kicker': 'Tough talk',
                    'byline': 'Dan Wootton and staff writers',
                    'commentsAllowed': true,
                    'commentsTotal': 0,
                    'commentsShown': true,
                    'authorProfileIds': [],
                    'bylineNames': [
                        'Dan Wootton and staff writers'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': 'cd19d3b9ce3855b2de267b2d06209649',
                        'link': 'http://cdn.newsapi.com.au/content/v2/cd19d3b9ce3855b2de267b2d06209649'
                    },
                    'originId': '64e4e0fc-d7d1-11e7-b0af-5e743c45d30b',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Billionaire refused to save his grandson',
                    'subtitle': 'The billionaire who refused to pay kidnappers to save his grandson’s life',
                    'description': 'The upcoming film All the Money in the World has been garnering lots of buzz for the scandal around it. \n\n',
                    'link': 'http://cdn.newsapi.com.au/link/cd19d3b9ce3855b2de267b2d06209649?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'New York Post',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': '64e4e0fc-d7d1-11e7-b0af-5e743c45d30b',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T20:24:53.000Z',
                    'dateLive': '2017-12-03T02:49:00.000Z',
                    'customDate': '2017-12-03T20:24:00.000Z',
                    'dateCreated': '2017-12-03T02:26:39.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': 'ab92daf9afc27c3e07626fe1bf0a33a3',
                            'link': 'http://cdn.newsapi.com.au/image/v1/ab92daf9afc27c3e07626fe1bf0a33a3'
                        },
                        'originId': 'crop-15e09e7b0bab6ade0d256b040d0bea11',
                        'origin': 'METHODE',
                        'title': 'J.Paul Getty 111, was kidnapped in Italy. Although a $3million ransom was paid his ear was severed in the ordeal. From book Painfully Rich:J Paul Getty and His Heirs by John Pearson, Macmillan. oct 1995. p/',
                        'subtitle': '6cc59f62-d7d3-11e7-b5a9-0fbc45dc1ac5',
                        'description': 'J.Paul Getty 111, was kidnapped in Italy. Although a $3million ransom was paid his ear was severed in the ordeal. From book Painfully Rich:J Paul Getty and His Heirs by John Pearson, Macmillan. oct 1995. p/',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/ab92daf9afc27c3e07626fe1bf0a33a3',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'News Corp Australia',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T02:41:16.000Z',
                        'dateLive': '2017-12-03T02:49:00.000Z',
                        'dateCreated': '2017-12-03T02:41:12.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'categories': [],
                        'keywords': [
                            'John Pearson',
                            'Macmillan.',
                            'J.Paul Getty',
                            'oct 1995',
                            'Painfully Rich',
                            'His Heirs',
                            'book',
                            'p',
                            'ear',
                            'ordeal',
                            'ransom',
                            'J Paul Getty'
                        ],
                        'authors': [],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'couriermail.com.au',
                            'goldcoastbulletin.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'clenchs',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '6cc59f62d7d311e7b5a90fbc45dc1ac5',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'J.Paul Getty 111, was kidnapped in Italy. Although a $3million ransom was paid his ear was severed in the ordeal. From book Painfully Rich:J Paul Getty and His Heirs by John Pearson, Macmillan. oct 1995. p/',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '6cc59f62-d7d3-11e7-b5a9-0fbc45dc1ac5',
                        'enterpriseAssetId': 'NEWSMMGLPICT000060790789',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/cd19d3b9ce3855b2de267b2d06209649?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/lifestyle/the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life/news-story/cd19d3b9ce3855b2de267b2d06209649'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/lifestyle/the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life/news-story/cd19d3b9ce3855b2de267b2d06209649'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/lifestyle/the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life/news-story/cd19d3b9ce3855b2de267b2d06209649'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/lifestyle/the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life/news-story/cd19d3b9ce3855b2de267b2d06209649'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/lifestyle/the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life/news-story/cd19d3b9ce3855b2de267b2d06209649'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/lifestyle/the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life/news-story/cd19d3b9ce3855b2de267b2d06209649'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/lifestyle/the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life/news-story/cd19d3b9ce3855b2de267b2d06209649'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/lifestyle/real-life/news-life/the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life/news-story/cd19d3b9ce3855b2de267b2d06209649'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/lifestyle/the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life/news-story/cd19d3b9ce3855b2de267b2d06209649'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/lifestyle/the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life/news-story/cd19d3b9ce3855b2de267b2d06209649'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/lifestyle/the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life/news-story/cd19d3b9ce3855b2de267b2d06209649'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/lifestyle/the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life/news-story/cd19d3b9ce3855b2de267b2d06209649'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Real Life/News Life/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Real%20Life/News%20Life/',
                        'id': '1227347105401',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Real Life/News Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Real%20Life/News%20Life/',
                            'id': '1227347105401',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227347105401/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227347105401/',
                            'id': '1227347105401',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/',
                            'id': '1226521171876',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226521171876/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226521171876/',
                            'id': '1226521171876',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673762905',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226673762905/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226673762905/',
                            'id': '1226673762905',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Oliver Murray/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Oliver%20Murray/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/arts, culture and entertainment/cinema/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/arts,%20culture%20and%20entertainment/cinema/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/crime, law and justice/crime/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/crime,%20law%20and%20justice/crime/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/crime, law and justice/crime/kidnapping/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/crime,%20law%20and%20justice/crime/kidnapping/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/crime, law and justice/police/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/crime,%20law%20and%20justice/police/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/crime, law and justice/police/arrest/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/crime,%20law%20and%20justice/police/arrest/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/disaster and accident/accident (general)/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/disaster%20and%20accident/accident%20(general)/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/economy, business and finance/media/cinema industry/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/economy,%20business%20and%20finance/media/cinema%20industry/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/human interest/people/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/human%20interest/people/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/politics/defence/firearms/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/politics/defence/firearms/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/social issue/family/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/social%20issue/family/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/social issue/family/parent and child/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/social%20issue/family/parent%20and%20child/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/01005000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/01005000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/02001000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/02001000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/02001007/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/02001007/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/02003000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/02003000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/02003003/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/02003003/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/03013000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/03013000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/04010003/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/04010003/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/08003000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/08003000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/11001006/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/11001006/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/14006000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/14006000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/14006001/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/14006001/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/paralysing drug-induced stroke/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/paralysing%20drug-induced%20stroke/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/richest man/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/richest%20man/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Oil magnate John/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Oil%20magnate%20John/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/magnate John Paul/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/magnate%20John%20Paul/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Italian police/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Italian%20police/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/right ear/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/right%20ear/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Italian drug charges/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Italian%20drug%20charges/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/oil man/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/oil%20man/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/family oil business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/family%20oil%20business/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/finest art museums/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/finest%20art%20museums/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/heroin binge/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/heroin%20binge/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/fan mail/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/fan%20mail/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/oil baron/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/oil%20baron/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/included mafia members/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/included%20mafia%20members/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/petroleum business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/petroleum%20business/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/doing speedballs/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/doing%20speedballs/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/family members/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/family%20members/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Film trailer/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Film%20trailer/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/fake kidnapping/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/fake%20kidnapping/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/top-of-the-heap status/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/top-of-the-heap%20status/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/crime group/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/crime%20group/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/drug overdose/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/drug%20overdose/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/comic book/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/comic%20book/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/drug addict/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/drug%20addict/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Italian media/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Italian%20media/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Italian countryside/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Italian%20countryside/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/final words/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/final%20words/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/nude modelling/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/nude%20modelling/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/cold statement/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/cold%20statement/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/bohemian existence/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/bohemian%20existence/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/absolute insanity/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/absolute%20insanity/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Forbes magazine/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Forbes%20magazine/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/J. Paul Getty Museum/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/J.%20Paul%20Getty%20Museum/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/New York Post Company/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/New%20York%20Post%20Company/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Rolling Stones/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Rolling%20Stones/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Rolling Stone/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Rolling%20Stone/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Jack Nicholson/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Jack%20Nicholson/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/John Paul/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/John%20Paul/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Andy Warhol/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Andy%20Warhol/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Kevin Spacey/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Kevin%20Spacey/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/J. Paul Getty III/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/J.%20Paul%20Getty%20III/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Christopher Plummer/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Christopher%20Plummer/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Joe Eszterhas/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Joe%20Eszterhas/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/John Pearson/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/John%20Pearson/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Mick Jagger/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Mick%20Jagger/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Gail/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Gail/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Charles Fox/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Charles%20Fox/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Martine Zacher/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Martine%20Zacher/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Old John/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Old%20John/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Anna/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Anna/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Mickey Mouse/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Mickey%20Mouse/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Balthazar/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Balthazar/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Giovanni Jacovoni/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Giovanni%20Jacovoni/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/California/Los Angeles/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/California/Los%20Angeles/',
                            'otcaConfidence': 92.4582,
                            'otcaRelevancy': 25.0127,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 34.052222,
                                'longitude': -118.243611
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 92.4028,
                            'otcaRelevancy': 25.0652,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Italy/NOPROVINCESTATE/Rome/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Italy/NOPROVINCESTATE/Rome/',
                            'otcaConfidence': 84.9429,
                            'otcaRelevancy': 70.5829,
                            'otcaFrequency': 7,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 41.9,
                                'longitude': 12.483333
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Germany/NOPROVINCESTATE/Berlin/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Germany/NOPROVINCESTATE/Berlin/',
                            'otcaConfidence': 84.3587,
                            'otcaRelevancy': 27.8242,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 52.516667,
                                'longitude': 13.4
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United Kingdom/NOPROVINCESTATE/London/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20Kingdom/NOPROVINCESTATE/London/',
                            'otcaConfidence': 83.4069,
                            'otcaRelevancy': 35.5635,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Italy/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Italy/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 80.833,
                            'otcaRelevancy': 62.7603,
                            'otcaFrequency': 3,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Morocco/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Morocco/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 71.8411,
                            'otcaRelevancy': 42.9935,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/England/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/England/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 67.7803,
                            'otcaRelevancy': 47.1669,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/California/Los Angeles/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/California/Los%20Angeles/',
                            'otcaConfidence': 92.4582,
                            'otcaRelevancy': 25.0127,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 34.052222,
                                'longitude': -118.243611
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 92.4028,
                            'otcaRelevancy': 25.0652,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Southern Europe/Italy/NOPROVINCESTATE/Rome/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Southern%20Europe/Italy/NOPROVINCESTATE/Rome/',
                            'otcaConfidence': 84.9429,
                            'otcaRelevancy': 70.5829,
                            'otcaFrequency': 7,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 41.9,
                                'longitude': 12.483333
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Western Europe/Germany/NOPROVINCESTATE/Berlin/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Western%20Europe/Germany/NOPROVINCESTATE/Berlin/',
                            'otcaConfidence': 84.3587,
                            'otcaRelevancy': 27.8242,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 52.516667,
                                'longitude': 13.4
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern Europe/United Kingdom/NOPROVINCESTATE/London/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern%20Europe/United%20Kingdom/NOPROVINCESTATE/London/',
                            'otcaConfidence': 83.4069,
                            'otcaRelevancy': 35.5635,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Southern Europe/Italy/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Southern%20Europe/Italy/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 80.833,
                            'otcaRelevancy': 62.7603,
                            'otcaFrequency': 3,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Africa/NOSUBCONTINENT/Northern Africa/Morocco/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Africa/NOSUBCONTINENT/Northern%20Africa/Morocco/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 71.8411,
                            'otcaRelevancy': 42.9935,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern Europe/England/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Northern%20Europe/England/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 67.7803,
                            'otcaRelevancy': 47.1669,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/Real Life/News Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/Real%20Life/News%20Life/',
                            'id': '1227347020074',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462446',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956177',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462445',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956189',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226592254293',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462444',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956176',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/',
                            'id': '1226423680314',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226646528365',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956178',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956180',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956179',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769552',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769553',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769550',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769549',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769551',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/Real%20Life/',
                            'id': '1226673807425',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'paralysing drug-induced stroke',
                        'richest man',
                        'Oil magnate John',
                        'magnate John Paul',
                        'Italian police',
                        'right ear',
                        'Italian drug charges',
                        'oil man',
                        'family oil business',
                        'finest art museums',
                        'heroin binge',
                        'fan mail',
                        'oil baron',
                        'included mafia members',
                        'petroleum business',
                        'doing speedballs',
                        'family members',
                        'Film trailer',
                        'fake kidnapping',
                        'top-of-the-heap status',
                        'crime group',
                        'drug overdose',
                        'comic book',
                        'drug addict',
                        'Italian media',
                        'Italian countryside',
                        'final words',
                        'nude modelling',
                        'cold statement',
                        'bohemian existence',
                        'absolute insanity',
                        'Los Angeles',
                        'California',
                        'United States of America',
                        'Northern America',
                        'North America',
                        'America',
                        'Rome',
                        'Italy',
                        'Southern Europe',
                        'Europe',
                        'Berlin',
                        'Germany',
                        'Western Europe',
                        'London',
                        'United Kingdom',
                        'Northern Europe',
                        'Morocco',
                        'Northern Africa',
                        'Africa',
                        'England',
                        'Forbes magazine',
                        'J. Paul Getty Museum',
                        'New York Post Company',
                        'Rolling Stones',
                        'Rolling Stone',
                        'Jack Nicholson',
                        'John Paul',
                        'Andy Warhol',
                        'Kevin Spacey',
                        'J. Paul Getty III',
                        'Christopher Plummer',
                        'Joe Eszterhas',
                        'John Pearson',
                        'Mick Jagger',
                        'Gail',
                        'Charles Fox',
                        'Martine Zacher',
                        'Old John',
                        'Anna',
                        'Mickey Mouse',
                        'Balthazar',
                        'Giovanni Jacovoni'
                    ],
                    'authors': [
                        'Oliver Murray'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'couriermail.com.au',
                        'goldcoastbulletin.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': 'ab92daf9afc27c3e07626fe1bf0a33a3',
                                'link': 'http://cdn.newsapi.com.au/content/v2/ab92daf9afc27c3e07626fe1bf0a33a3'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-15e09e7b0bab6ade0d256b040d0bea11',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'de90c3f3d76bfd6fd20375b9ecfebbb3',
                                'link': 'http://cdn.newsapi.com.au/content/v2/de90c3f3d76bfd6fd20375b9ecfebbb3'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-40510ad75b1bf9069ddbeca309445009',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '050a887db9447bf1e588a664b62ba29a',
                                'link': 'http://cdn.newsapi.com.au/content/v2/050a887db9447bf1e588a664b62ba29a'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-36310edb882a0bb662cf394f7e902bb8',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '5e2387dd7002848ba7ca9642435b8723',
                                'link': 'http://cdn.newsapi.com.au/content/v2/5e2387dd7002848ba7ca9642435b8723'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-97329c0ecc76210a23b705a55537fc90',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '0259500c23ec40c58956835d6cce65a6',
                                'link': 'http://cdn.newsapi.com.au/content/v2/0259500c23ec40c58956835d6cce65a6'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-79efa05c7bcc303d95a6aca3edf438c9',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'bd65f5b62c2637a50d814b84e4defa3e',
                                'link': 'http://cdn.newsapi.com.au/content/v2/bd65f5b62c2637a50d814b84e4defa3e'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-3738e2487aa4b1a0121dcad825f9f25e',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '49e361f0c993b7c91694525965304f78',
                                'link': 'http://cdn.newsapi.com.au/content/v2/49e361f0c993b7c91694525965304f78'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-7536cfb07961370db315af81e6639cd5',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '5b8d490dd11e0ca89d88e8630e39dff7',
                                'link': 'http://cdn.newsapi.com.au/content/v2/5b8d490dd11e0ca89d88e8630e39dff7'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-3eb97b64aaed6717c512878d9c3ca178',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '11d1b8adf341c85611e609803878df44',
                                'link': 'http://cdn.newsapi.com.au/content/v2/11d1b8adf341c85611e609803878df44'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-f9dac7cf9c884be3c428674b1d8acb32',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '17f2beacb63b7f220c5bcf6f551726c8',
                                'link': 'http://cdn.newsapi.com.au/content/v2/17f2beacb63b7f220c5bcf6f551726c8'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-629ae42d4a8b4074310c3b09d3153bb7',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '0c5297d712280a2b3e6a62ad3c574cbd',
                                'link': 'http://cdn.newsapi.com.au/content/v2/0c5297d712280a2b3e6a62ad3c574cbd'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': 34.052222,
                            'longitude': -118.243611
                        },
                        {
                            'latitude': 41.9,
                            'longitude': 12.483333
                        },
                        {
                            'latitude': 52.516667,
                            'longitude': 13.4
                        }
                    ],
                    'seoHeadline': 'All the Money in the World: True story behind Hollywood film',
                    'userOriginUpdated': 'clenchs',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'the-billionaire-who-refused-to-pay-kidnappers-to-save-his-grandsons-life',
                    'revision': 7,
                    'body': 'A month ago, the filmmakers decided to erase star Kevin Spacey — now tainted by accusations of sexual misconduct — and replace him with Christopher Plummer. \n\nWith the movie due to hit theatres December 22, Plummer was still filming in Italy as recently as this past week.\n\nBut the scandal the movie is based on is just as shocking, reports the New York Post. \n\nIn 1973, John Paul Getty III — the 16-year-old grandson of oil man J. Paul Getty, then said to be the world’s richest man, worth some $1.2 billion (around $9.1 billion today) — was kidnapped in Rome. His abductors demanded $17 million, which his family wouldn’t pay, leading his captors to cut off his right ear.\n\nThe ordeal, coupled with terrible neglect, ruined the boy’s life. At just 24, he ended up paralysed as a result of a drug overdose.\n\nAs it turns out, all the money in the world could not save him.\n\nBorn in 1892 to Minnesotan parents in the petroleum business, J. Paul Getty turned mere wealth into billions by buying oil-rich land in the Middle East.\n\nBut “Old John,” as he came to be called, was a notorious tightwad. So much so that he kept a payphone at Sutton Place, his 75-acre estate in Surrey, England, so as not to get stuck paying for guests’ calls.\n\nHe was equally parsimonious about showing love to his family. “Raising kids ... would have gotten in the way of his mistresses,” John Pearson, author of Painfully Rich, on which the movie is based, told The Post.\n\nOld John had five wives and as many sons. He particularly disdained his third boy, John Paul Getty Jr, and viewed him as a dope-addled hippie. “John Paul [Jr] was cultured,” said Pearson. “But he was a drug addict and a layabout.”\n\nOld John did not meet his grandson, John Paul III — the oldest of four children that John Paul Jr had with first wife Gail — until the boy was 11 years old. Improbably, the old man was charmed.\n\nWhen they met again four years later, however, Old John was less impressed. It was 1971 and the 15-year-old boy, known as Paul, had evolved into a bell-bottoms-wearing hippie. His father, John Paul Jr, had divorced Gail in 1966 and been living a bohemian existence with his new wife, model Talitha Pol. They bounced around Rome and Morocco, hung out with the Rolling Stones, and smoked opium.\n\nBy the age of 15, Paul had already been exposed to the likes of Andy Warhol, Jack Nicholson and Mick Jagger. According to the 2013 biography of Paul, Uncommon Youth, by Charles Fox, Gail suspected that Paul “had a 24-hour really bad trip on whatever it was that [John Paul Jr’s mistress] had given him.”\n\nIn the aftermath of a 1971 heroin binge, Pol fatally overdosed.\n\n“But [Paul] idolised his father, thought he was a cool guy — even though he was dysfunctional and an emotional wreck,” said Pearson.\n\nBelieving that freedom would help her son, Gail allowed Paul to quit school and live in an apartment in Rome so he could pursue a career as a painter. At 16, he was mostly known for partying and nude modelling. Local media dubbed Paul “the Golden Hippie.”\n\nTHE GOLDEN HIPPIE IS KIDNAPPED \n\nAround 3am on July 10, 1973, the Golden Hippie was drunk and strolling home along the Piazza Farnese. He stopped at a newsstand to purchase the coming day’s paper and a Mickey Mouse comic book.\n\nA car pulled up and three men jumped out, brandishing pistols. They whisked Paul into the car. As he told writer Joe Eszterhas, during a 1974 Rolling Stone interview, “I didn’t know if I had f**ked somebody’s chick or whether they were the cops or whatever.”\n\nPaul got chloroformed and smacked in the head with the butt of a gun before passing out.\n\nThe men — part of a ragtag group that included mafia members, a carpenter and hospital orderly — drove Paul to a cave in southern Italy where he was tied to a stake. A captor said, “Listen, kid, you’re going to be here a long time. Don’t do anything stupid.”\n\nA day after the abduction, his mother, Gail, received a phone call asking for a ransom of $17 million.\n\nAt first, she wondered if perhaps the police were right in their assessment that he had himself “kidnapped” to bilk his family for money. \n\nIn fact, Paul had bragged to friends about a plan for the perfect fake kidnapping. Even the Italian media headlined it a hoax.\n\nMeanwhile, John Paul Jr, in London to escape Italian drug charges related to the death of Pol, was oblivious. “He lived on heroin and chocolate-chip cookies,” said Pearson. “He was out of it and useless.”\n\nFor weeks, Gail spun her wheels in trying to raise the money. Meanwhile, Old John provided a cold statement to the media: “I don’t believe in paying kidnappers. I have 14 other grandchildren and if I pay one penny now, then I’ll have 14 kidnapped grandchildren.”\n\nThe kidnappers kept Paul drunk on cheap cognac in the cave and rural huts. They gave him a radio and a pet bird. Each day he was unchained for an hour of walking and smoking. He tracked days by making small scratches on a rock. After 50 days passed with no action, the kidnappers became increasingly agitated.\n\n‘I PISSED MYSELF ALL THE TIME’ \n\nEarly one October morning, around three months into his ordeal, Paul received a haircut from his kidnappers. The next morning he was fed a meal of five steaks and pressed to eat as much as he could. Afterwards, the teen was blindfolded and a handkerchief was placed in his mouth. He bit hard as the men secured his arms, legs and head.\n\nThen, they sliced off his right ear with the single sweep of a razor-sharp blade.\n\n“I was vomiting,” Paul told Eszterhas, recalling how the wound became badly infected and the penicillin he was given poisoned him. “I didn’t even move for about 10 days. I pissed myself all the time.”\n\nHis ear was wrapped in a bag, along with strands of his hair and a note that said unless the ransom was paid within 10 days, “we shall send you the other ear.” \n\nIt was sent to Il Messaggero newspaper in Rome. But a national postal strike meant the gruesome parcel took three weeks to reach its destination.\n\nUpon its arrival, Gail and lawyer Giovanni Jacovoni raced to the paper’s office. She took one look at the ear, recognised the freckles, and said that it belonged to her son.\n\nAfter Polaroids of Paul, showing his emaciated body and missing ear, were left for Il Messaggero reporters to retrieve from the side of a highway, the family negotiated the ransom down to $2.9 million.\n\nGrudgingly, Old John put up $2.2 million — the maximum that could be tax deducted — and loaned the remaining $700,000 to his son, providing that the sum be paid back at 4 per cent interest. Pearson suspects that the debt was never repaid.\n\nOn December 12, five months after Paul was nabbed, money changed hands at a rendezvous in the Italian countryside. Three days later, he was released. He began walking and was soon picked up by the police and his mother.\n\nAt the main police station in Rome, a mob of reporters awaited the teen’s arrival. Paul described the homecoming as “absolute insanity.” A week or so later, back in Rome, he was as famous as a Rolling Stone, complete with screaming girls and fan mail: “All the letters,” Paul told Eszterhas, “basically said, ‘Give me your c**k.’”\n\nHe called his grandfather to thank him for putting up the money. But Old John would not take the call. Through an intermediary, his final words to Paul were, “Good luck.”\n\nSoon after Paul’s release, he met with Eszterhas in Berlin and Rome. Reportedly, Paul demanded $500 for the interview and $2000 for a photo session. “I heard that he was doing cocaine, lots of cocaine,” said Eszterhas. “He carried himself like a rock star, but he needed money. I had to put cash down on the table when we started the interview and more when we finished it.”\n\nEventually, nine men associated with the ’Ndrangheta organised crime group were arrested for the kidnapping, with two ultimately convicted. Only $85,000 of the $2.9 million was recovered.\n\nA year later, in 1974, at age 18, Paul married photographer Martine Zacher, 24. His grandfather disinherited him, not liking that Zacher was older — and five months pregnant. The couple’s son, Balthazar, now 42, went on to become a successful actor in films such as Lord of the Flies and the US ABC TV series Brothers and Sisters. (They also had a daughter, Anna.)\n\nFatherhood did little to mellow Paul. His family lived in a house behind the Whisky a Go Go on Hollywood’s Sunset Strip. Author Fox wrote of him being jumpy and doing speedballs (a mix of heroin and cocaine). By this point, Paul had no money himself, but various family members covered all the checks he could bounce.\n\nIn 1981, after a night of methadone, valium and alcohol, Paul, 25, suffered a stroke that left him a quadriplegic. Nevertheless, Eszterhas recalled hearing about him being rolled into Carlos and Charlies nightclub in his wheelchair.\n\nPaul and Gail sued John Paul Jr. for $28,000 per month to cover Paul’s care. Ultimately, after a long period of poor health, Paul died in 2011 at 54. By then his father and grandfather had both passed on.\n\nAlthough the Getty name endures on gas station signs across the United States — as well as through Los Angeles’ J. Paul Getty Museum and the Getty Villa, both ranking among the world’s finest art museums — the family oil business was sold for $10.1 billion to Texaco in 1984. In 2015, Forbes magazine estimated the Getty fortune to be a diminishing $5.4 billion. That made them the 56th wealthiest family in America — rich but a far cry from Old John’s former top-of-the-heap status.\n\nPearson thinks Old John would not have been pleased by Hollywood making money off his name.\n\n“The old man would have had the script rewritten for his own ends; he would have tried to shift blame from himself,” said Pearson. “I also think Getty would want to get whatever money he could out of it. That was his nature.”\n\nThis article originally appeared on the New York Post and was reproduced with permission \n\n',
                    'standFirst': 'HE WAS the world’s richest man, but when one of his grandchildren was kidnapped, he refused to pay the ransom.\n\n',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [
                        'b3cc8740651a8ac0a0789a6aabdd4727'
                    ],
                    'bylineNames': [],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': '1f7f50ef77ba48a3b165c12fed476923',
                        'link': 'http://cdn.newsapi.com.au/content/v2/1f7f50ef77ba48a3b165c12fed476923'
                    },
                    'originId': '8b219674-d3db-11e7-8b48-4ba45b565343',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Surprising $2 billion industry',
                    'subtitle': 'The $2 billion industry we can’t get enough of: Why personal services are booming in Australia',
                    'description': 'IF YOU’D rather spend your weekends at the beach instead of doing chores, you’re not alone.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/1f7f50ef77ba48a3b165c12fed476923?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'news.com.au',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': '8b219674-d3db-11e7-8b48-4ba45b565343',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T20:06:38.000Z',
                    'dateLive': '2017-12-03T10:14:00.000Z',
                    'customDate': '2017-12-03T20:06:00.000Z',
                    'dateCreated': '2017-11-28T01:29:14.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '4c97e3faca96c6378de3db02d62c4878',
                            'link': 'http://cdn.newsapi.com.au/image/v1/4c97e3faca96c6378de3db02d62c4878'
                        },
                        'originId': 'crop-f38470c2e5d187eade357a79bb9ba469',
                        'origin': 'METHODE',
                        'title': 'Joseph Marcell, Left, As Geoffrey, And James Avery, As Philip Banks, In An Episode Of The Fresh Prince Of Bel Air. Source  Ap',
                        'subtitle': '48bee13c-d3dc-11e7-8b48-4ba45b565343',
                        'description': 'Joseph Marcell, Left, As Geoffrey, And James Avery, As Philip Banks, In An Episode Of The Fresh Prince Of Bel Air. Source  Ap',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/4c97e3faca96c6378de3db02d62c4878',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'Supplied',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T19:01:04.000Z',
                        'dateLive': '2017-12-03T10:14:00.000Z',
                        'dateCreated': '2017-11-28T01:34:32.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'primaryCategory': {
                            'value': '/author/newscorpaustralia.com/Margaret Norton/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Margaret%20Norton/'
                        },
                        'categories': [
                            {
                                'value': '/author/newscorpaustralia.com/Margaret Norton/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Margaret%20Norton/'
                            }
                        ],
                        'keywords': [
                            'Fresh Prince',
                            'Source Ap',
                            'Episode',
                            'James',
                            'Philip',
                            'Avery',
                            'Banks',
                            'source',
                            'prince',
                            'air',
                            'bel',
                            'Joseph Marcell',
                            'James Avery',
                            'Philip Banks'
                        ],
                        'authors': [
                            'Margaret Norton'
                        ],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'chungf',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '48bee13cd3dc11e78b484ba45b565343',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'Joseph Marcell, Left, As Geoffrey, And James Avery, As Philip Banks, In An Episode Of The Fresh Prince Of Bel Air. Source  Ap',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '48bee13c-d3dc-11e7-8b48-4ba45b565343',
                        'enterpriseAssetId': 'NEWSMMGLPICT000047607489',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/1f7f50ef77ba48a3b165c12fed476923?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/business/work/the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia/news-story/1f7f50ef77ba48a3b165c12fed476923'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/business/work/the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia/news-story/1f7f50ef77ba48a3b165c12fed476923'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/business/work/the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia/news-story/1f7f50ef77ba48a3b165c12fed476923'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/business/work/the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia/news-story/1f7f50ef77ba48a3b165c12fed476923'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/business/work/the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia/news-story/1f7f50ef77ba48a3b165c12fed476923'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/business/work/the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia/news-story/1f7f50ef77ba48a3b165c12fed476923'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/business/work/the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia/news-story/1f7f50ef77ba48a3b165c12fed476923'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/finance/work/at-work/the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia/news-story/1f7f50ef77ba48a3b165c12fed476923'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/business/work/the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia/news-story/1f7f50ef77ba48a3b165c12fed476923'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/business/work/the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia/news-story/1f7f50ef77ba48a3b165c12fed476923'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/business/work/the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia/news-story/1f7f50ef77ba48a3b165c12fed476923'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/business/work/the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia/news-story/1f7f50ef77ba48a3b165c12fed476923'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Finance - syndicated/Work/At Work/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Finance%20-%20syndicated/Work/At%20Work/',
                        'id': '1226770590326',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Finance - syndicated/Work/At Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Finance%20-%20syndicated/Work/At%20Work/',
                            'id': '1226770590326',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226770590326/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226770590326/',
                            'id': '1226770590326',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Finance%20-%20syndicated/Work/',
                            'id': '1226544451302',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226544451302/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226544451302/',
                            'id': '1226544451302',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Finance - syndicated/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Finance%20-%20syndicated/Business/',
                            'id': '1226544095754',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226544095754/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226544095754/',
                            'id': '1226544095754',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Finance%20-%20syndicated/',
                            'id': '1226544095474',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226544095474/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226544095474/',
                            'id': '1226544095474',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Apple News/NewsComAu/Home/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Apple%20News/NewsComAu/Home/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227528026986/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227528026986/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Apple News/NewsComAu/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Apple%20News/NewsComAu/',
                            'id': '1227528023188',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227528023188/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227528023188/',
                            'id': '1227528023188',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Alexis Carey/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Alexis%20Carey/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/social issue/family/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/social%20issue/family/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/labour/employment/child labor/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/labour/employment/child%20labor/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/labour/employment/occupations/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/labour/employment/occupations/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/14006000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/14006000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/09003003/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/09003003/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/09003004/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/09003004/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/personal butlers/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/personal%20butlers/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/personal butler services/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/personal%20butler%20services/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/personal concierge assistance/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/personal%20concierge%20assistance/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/overflowing laundry basket/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/overflowing%20laundry%20basket/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/office organisation/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/office%20organisation/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/holiday planning/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/holiday%20planning/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/personal services/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/personal%20services/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/personal services industry/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/personal%20services%20industry/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/domestic tasks/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/domestic%20tasks/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/personal services companies/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/personal%20services%20companies/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/traditional butling profession/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/traditional%20butling%20profession/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/doing chores/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/doing%20chores/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/putting stuff/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/putting%20stuff/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/spare time/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/spare%20time/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/washing machine/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/washing%20machine/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/milenial generation/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/milenial%20generation/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Australian Butler Services/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Australian%20Butler%20Services/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Jay Z/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Jay%20Z/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Alexis Carey/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Alexis%20Carey/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Paris Hilton/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Paris%20Hilton/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Christopher Reid/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Christopher%20Reid/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 86.0401,
                            'otcaRelevancy': 79.8814,
                            'otcaFrequency': 5,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/New South Wales/Sydney/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/New%20South%20Wales/Sydney/',
                            'otcaConfidence': 84.477,
                            'otcaRelevancy': 51.093,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': -33.867778,
                                'longitude': 151.207222
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/Victoria/Melbourne/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/Victoria/Melbourne/',
                            'otcaConfidence': 74.7135,
                            'otcaRelevancy': 51.0245,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 86.0401,
                            'otcaRelevancy': 79.8814,
                            'otcaFrequency': 5,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/New South Wales/Sydney/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/New%20South%20Wales/Sydney/',
                            'otcaConfidence': 84.477,
                            'otcaRelevancy': 51.093,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': -33.867778,
                                'longitude': 151.207222
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/Victoria/Melbourne/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/Victoria/Melbourne/',
                            'otcaConfidence': 74.7135,
                            'otcaRelevancy': 51.0245,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/positive/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/positive/'
                        },
                        {
                            'value': '/display/couriermail.com.au/Finance - syndicated/Work/At Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Finance%20-%20syndicated/Work/At%20Work/',
                            'id': '1226770591485',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Finance - syndicated/Work/At Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Finance%20-%20syndicated/Work/At%20Work/',
                            'id': '1226770591480',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Finance - syndicated/Work/At Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Finance%20-%20syndicated/Work/At%20Work/',
                            'id': '1226770591481',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Finance - syndicated/Work/At Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Finance%20-%20syndicated/Work/At%20Work/',
                            'id': '1226770591482',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Finance - syndicated/Work/At Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Finance%20-%20syndicated/Work/At%20Work/',
                            'id': '1226770591483',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Finance/Work/At Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Finance/Work/At%20Work/',
                            'id': '1226765180264',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1226617464509',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1228018420923',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1226617464511',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1228018420922',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1226597503297',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1226617464510',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1228018420921',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Finance/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Finance/Work/',
                            'id': '1111112062335',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1226637313603',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1228018420924',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1228018420925',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1228018420926',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Finance - syndicated/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Finance%20-%20syndicated/Business/',
                            'id': '1226617459519',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Finance - syndicated/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Finance%20-%20syndicated/Business/',
                            'id': '1228018421645',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Finance - syndicated/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Finance%20-%20syndicated/Business/',
                            'id': '1226617459518',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Finance - syndicated/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Finance%20-%20syndicated/Business/',
                            'id': '1228018421648',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Finance - syndicated/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Finance%20-%20syndicated/Business/',
                            'id': '1226597502965',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Finance - syndicated/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Finance%20-%20syndicated/Business/',
                            'id': '1226617459520',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Finance - syndicated/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Finance%20-%20syndicated/Business/',
                            'id': '1228018421644',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Finance/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Finance/Business/',
                            'id': '1226331373571',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Finance - syndicated/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Finance%20-%20syndicated/Business/',
                            'id': '1226637310097',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Finance - syndicated/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Finance%20-%20syndicated/Business/',
                            'id': '1228018421647',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Finance - syndicated/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Finance%20-%20syndicated/Business/',
                            'id': '1228018421649',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Finance - syndicated/Business/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Finance%20-%20syndicated/Business/',
                            'id': '1228018421642',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Finance%20-%20syndicated/',
                            'id': '1226617455913',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Finance%20-%20syndicated/',
                            'id': '1228018264720',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Finance%20-%20syndicated/',
                            'id': '1226617455914',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Finance%20-%20syndicated/',
                            'id': '1228018278910',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Finance%20-%20syndicated/',
                            'id': '1226597501825',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Finance%20-%20syndicated/',
                            'id': '1226617455907',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Finance%20-%20syndicated/',
                            'id': '1228018264718',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Finance/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Finance/',
                            'id': '1111112062038',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Finance%20-%20syndicated/',
                            'id': '1226637308375',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Finance%20-%20syndicated/',
                            'id': '1226680532430',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Finance%20-%20syndicated/',
                            'id': '1228018264717',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Finance%20-%20syndicated/',
                            'id': '1228018264719',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'personal butlers',
                        'personal butler services',
                        'personal concierge assistance',
                        'overflowing laundry basket',
                        'office organisation',
                        'holiday planning',
                        'personal services',
                        'personal services industry',
                        'domestic tasks',
                        'personal services companies',
                        'traditional butling profession',
                        'doing chores',
                        'putting stuff',
                        'spare time',
                        'washing machine',
                        'milenial generation',
                        'Australia',
                        'Australia and New Zealand',
                        'Oceania',
                        'Sydney',
                        'New South Wales',
                        'Melbourne',
                        'Victoria',
                        'Australian Butler Services',
                        'Jay Z',
                        'Alexis Carey',
                        'Paris Hilton',
                        'Christopher Reid'
                    ],
                    'authors': [
                        'Alexis Carey'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '4c97e3faca96c6378de3db02d62c4878',
                                'link': 'http://cdn.newsapi.com.au/content/v2/4c97e3faca96c6378de3db02d62c4878'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-f38470c2e5d187eade357a79bb9ba469',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '4e0397e224a766ac34e8211cd8c8d1e9',
                                'link': 'http://cdn.newsapi.com.au/content/v2/4e0397e224a766ac34e8211cd8c8d1e9'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-49ca5809d335175024b1430d0491e843',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'b22293f04431c4ed5aac88bc5972f207',
                                'link': 'http://cdn.newsapi.com.au/content/v2/b22293f04431c4ed5aac88bc5972f207'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-401a4a627baaa3e1eacc41e86287a662',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'ca2b677472793fe21f1dd852a0eca357',
                                'link': 'http://cdn.newsapi.com.au/content/v2/ca2b677472793fe21f1dd852a0eca357'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-0c449f0d81e6e351e6ed95e2b5384edd',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '3ec9326aa50cabf76b45d2659621b068',
                                'link': 'http://cdn.newsapi.com.au/content/v2/3ec9326aa50cabf76b45d2659621b068'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-c7bc3cae8252c2e81a249b78ce65b836',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '97147cb31685ec8b26463e6490f54d75',
                                'link': 'http://cdn.newsapi.com.au/content/v2/97147cb31685ec8b26463e6490f54d75'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-0658ab486409ee99b4249ff9907c6e18',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'aecb55ab2acae29f650877b53a5f1d53',
                                'link': 'http://cdn.newsapi.com.au/content/v2/aecb55ab2acae29f650877b53a5f1d53'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': -33.867778,
                            'longitude': 151.207222
                        }
                    ],
                    'socialTitle': '‘It’s becoming more and more normalised and it’s entering the mainstream’',
                    'seoHeadline': 'Personal butlers a growing trend in Australia',
                    'userOriginUpdated': 'chungf',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'the-2-billion-industry-we-cant-get-enough-of-why-personal-services-are-booming-in-australia',
                    'revision': 4,
                    'body': 'As Australians become more and more time-poor, the personal services industry is booming — and the use of butlers in particular is skyrocketing. \n\nWhile in the past the outsourcing of domestic tasks was reserved for the upper crust, these days, even everyday Aussies are hiring butlers and cleaners and having their groceries and shopping delivered to their front door. \n\nStart-ups like Jarvis promise you can have “all your cleaning and errands handled just $35 per hour”, while Running In Heels offers once-off personal concierge assistance for $65 per hour.\n\nButlers can make your bed, clean the house, empty the bins and do the laundry as well as run errands such as grocery shopping and organising dry cleaning, while some services also offer home and office organisation, gift buying and even holiday planning. \n\nJarvis co-founder Matthew Vethecan predicted the personal services industry was worth a staggering $2 billion per year in Australia.\n\nHe said his company had been growing at a rate of over 20 per cent per month since the start of the year, with up to 70 butlers now on the books in Sydney and Melbourne.\n\n“Personal services is a really exciting space, and we estimate it’s worth $2 billion a year in Australia alone,” he said.\n\n“It’s being propped up by other trends as well … now the middle class has a higher discretionary income, we work longer hours than ever before, we’re seeing the rise of the milenial generation, and there’s a whole lot of changing attitudes about the outsourcing of domestic tasks.\n\n“It’s becoming more and more normalised and it’s entering the mainstream. Clients are seeing it’s OK to ask for help, especially when it means they are able to spend their weekends how they want rather than cleaning up after themselves.\n\n“We’re also seeing the role of technology as an enabler. There are some really exciting start-ups that are revolutionising business models, and that wouldn’t have been possible 20 years ago.”\n\nThis Tax Season, Do You Have to Pay a Nanny Tax? \n\nBut what is it like to actually be a butler?\n\nMebourne mum Steph Tan has worked as a personal butler for Jarvis for eight months, and she said none of her clients had ever hired a butler before her.\n\n“Originally I thought I’d be working for super affluent people in huge houses and I didn’t know what I would have to do — should I draw them a bath? But my clients aren’t like Paris Hilton — they are average people who have no spare time and could use some help. The only thing my clients have in common is that they have no time,” she said.\n\n“Most clients when we first meet have no idea what we are able to do. I ask them what they really don’t like doing, and I help them think of things they’d like me to do. It’s different for everyone. \n\n“Once clients realise we can be a big help they start adding things to the list. Because we’re not classified as cleaners we can get a bit creative with what we can help with, like organising closets.\n\n“For example, one of my clients is Jewish and I do all the stuff they can’t do on the Sabbath, like turning off the dishwasher and putting stuff in the washing machine or dryer.”\n\nHowever, Australian Butler Services CEO Christopher Reid said the rise of new personal services companies was concerning, as it was “changing the landscape” of the traditional butling profession.\n\n“I’m seeing a trend of people coming into the industry who have not been properly trained at a formal level. There seems to be a trend taking place where there are services offered by people with no experience in the profession at all …[which could lead to] a distorted view of what a butler is,” he said.\n\n“The profession has been around for 1000-plus years. It is about serving with dignity, intelligence and respect.\n\n“The profession of bustling requires a heart for service and excellence, and the butler has to have been formally trained or been entrenched in the profession in a home for many years.\n\n“Butlers can be concierges but concierges can’t be butlers. It’s not a transaction, it’s a relationship.”\n\nHe said the demand for traditional, high-end butlers was also growing as more and more wealth was created both globally and in Australia.\n\n“In some countries a new billionaire is made every 55 days. Business is flourishing globally and there’s a lot of new money coming into the market, and there’s also a lot of old money,” he said. \n\nalexis.carey@news.com.au \n\n',
                    'standFirst': 'THOUGHT personal butlers were only for the rich and famous? Think again, because this industry is booming in Australia.\n\n',
                    'kicker': 'New industries',
                    'byline': 'Alexis Carey',
                    'commentsAllowed': true,
                    'commentsTotal': 0,
                    'commentsShown': true,
                    'authorProfileIds': [],
                    'bylineNames': [
                        'Alexis Carey'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': 'a3505bd5a7015b305b0be18f12396107',
                        'link': 'http://cdn.newsapi.com.au/content/v2/a3505bd5a7015b305b0be18f12396107'
                    },
                    'originId': '0ee17b32-d7d8-11e7-981c-07121f345a0f',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Redheads have genetic superpowers',
                    'subtitle': 'Science shows redheads have genetic superpowers',
                    'description': 'Amy Adams is a lucky woman. Not only is she one of Hollywood’s most talented actors with five Oscar nominations under her fashionable belt, she actually smells sexy. \n\n',
                    'link': 'http://cdn.newsapi.com.au/link/a3505bd5a7015b305b0be18f12396107?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'New York Post',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': '0ee17b32-d7d8-11e7-981c-07121f345a0f',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T19:00:37.000Z',
                    'dateLive': '2017-12-03T04:09:00.000Z',
                    'customDate': '2017-12-03T19:00:00.000Z',
                    'dateCreated': '2017-12-03T03:14:22.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': 'cceb2f75e7a3863528ae523e64f8d4fa',
                            'link': 'http://cdn.newsapi.com.au/image/v1/cceb2f75e7a3863528ae523e64f8d4fa'
                        },
                        'originId': 'crop-4a38e334c881f7a66324a1a9376be0e4',
                        'origin': 'METHODE',
                        'title': 'Nominee for Best Actress "La La Land" Emma Stone arrives on the red carpet for the 89th Oscars on February 26, 2017 in Hollywood, California.  / AFP PHOTO / VALERIE MACON',
                        'subtitle': 'a68e2c56-d7d7-11e7-981c-07121f345a0f',
                        'description': 'Nominee for Best Actress "La La Land" Emma Stone arrives on the red carpet for the 89th Oscars on February 26, 2017 in Hollywood, California.  / AFP PHOTO / VALERIE MACON',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/cceb2f75e7a3863528ae523e64f8d4fa',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'AFP',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T04:44:10.000Z',
                        'dateLive': '2017-12-03T04:09:00.000Z',
                        'dateCreated': '2017-12-03T03:11:27.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'primaryCategory': {
                            'value': '/author/newscorpaustralia.com/VALERIE MACON/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/VALERIE%20MACON/'
                        },
                        'categories': [
                            {
                                'value': '/author/newscorpaustralia.com/VALERIE MACON/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/VALERIE%20MACON/'
                            },
                            {
                                'value': '/location/iptc.org/United States/California/Hollywood/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/location/iptc.org/United%20States/California/Hollywood/',
                                'selected': 'auto'
                            },
                            {
                                'value': '/countrycode/iptc.org/USA/California/Hollywood/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/countrycode/iptc.org/USA/California/Hollywood/',
                                'selected': 'auto'
                            }
                        ],
                        'keywords': [
                            'red carpet',
                            'us-oscars-arrivals',
                            'Emily Jean Stone'
                        ],
                        'authors': [
                            'VALERIE MACON'
                        ],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'holmesj1',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': 'a68e2c56d7d711e7981c07121f345a0f',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'Nominee for Best Actress "La La Land" Emma Stone a',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': 'a68e2c56-d7d7-11e7-981c-07121f345a0f',
                        'enterpriseAssetId': 'NEWSMMGLPICT000152593715',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/a3505bd5a7015b305b0be18f12396107?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/lifestyle/science-shows-redheads-have-genetic-superpowers/news-story/a3505bd5a7015b305b0be18f12396107'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/lifestyle/science-shows-redheads-have-genetic-superpowers/news-story/a3505bd5a7015b305b0be18f12396107'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/lifestyle/science-shows-redheads-have-genetic-superpowers/news-story/a3505bd5a7015b305b0be18f12396107'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/lifestyle/science-shows-redheads-have-genetic-superpowers/news-story/a3505bd5a7015b305b0be18f12396107'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/lifestyle/science-shows-redheads-have-genetic-superpowers/news-story/a3505bd5a7015b305b0be18f12396107'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/lifestyle/science-shows-redheads-have-genetic-superpowers/news-story/a3505bd5a7015b305b0be18f12396107'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/lifestyle/science-shows-redheads-have-genetic-superpowers/news-story/a3505bd5a7015b305b0be18f12396107'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/lifestyle/real-life/science-shows-redheads-have-genetic-superpowers/news-story/a3505bd5a7015b305b0be18f12396107'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/lifestyle/science-shows-redheads-have-genetic-superpowers/news-story/a3505bd5a7015b305b0be18f12396107'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/lifestyle/science-shows-redheads-have-genetic-superpowers/news-story/a3505bd5a7015b305b0be18f12396107'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/lifestyle/science-shows-redheads-have-genetic-superpowers/news-story/a3505bd5a7015b305b0be18f12396107'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/lifestyle/science-shows-redheads-have-genetic-superpowers/news-story/a3505bd5a7015b305b0be18f12396107'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Real Life/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Real%20Life/',
                        'id': '1226673762905',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673762905',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226673762905/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226673762905/',
                            'id': '1226673762905',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/',
                            'id': '1226521171876',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226521171876/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226521171876/',
                            'id': '1226521171876',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Isabelle Gogoll/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Isabelle%20Gogoll/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/education/university/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/education/university/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/arts, culture and entertainment/television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/arts,%20culture%20and%20entertainment/television/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/arts, culture and entertainment/cinema/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/arts,%20culture%20and%20entertainment/cinema/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/social issue/family/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/social%20issue/family/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/05007000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/05007000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/01016000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/01016000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/01005000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/01005000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/14006000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/14006000/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/genetic superpowers/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/genetic%20superpowers/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/red-headed women/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/red-headed%20women/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/vitamin D/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/vitamin%20D/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/red hair/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/red%20hair/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Science shows redheads/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Science%20shows%20redheads/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/hair colours/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/hair%20colours/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/beautiful red locks/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/beautiful%20red%20locks/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/popular man/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/popular%20man/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Red-headed women handle/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Red-headed%20women%20handle/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/human temperature-detecting gene/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/human%20temperature-detecting%20gene/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/women handle pain/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/women%20handle%20pain/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/cloudy European environments/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/cloudy%20European%20environments/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/redhead gene/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/redhead%20gene/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/gene mutation/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/gene%20mutation/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/fire gods/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/fire%20gods/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/dye molecules/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/dye%20molecules/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/circus clown/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/circus%20clown/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/celebrity stylist/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/celebrity%20stylist/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/native redheads/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/native%20redheads/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/cold temperatures/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/cold%20temperatures/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/talented actors/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/talented%20actors/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Hawaiian word/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Hawaiian%20word/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/thermal extremes/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/thermal%20extremes/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/University of Buffalo/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/University%20of%20Buffalo/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Oslo University/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Oslo%20University/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/McGill University/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/McGill%20University/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/New York Post Company/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/New%20York%20Post%20Company/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Getty Images Inc./otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Getty%20Images%20Inc./otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/University of Louisville/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/University%20of%20Louisville/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Agence France Presse/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Agence%20France%20Presse/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Erin La Rosa/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Erin%20La%20Rosa/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Ronald McDonald/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Ronald%20McDonald/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Martins/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Martins/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Andrew Stott/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Andrew%20Stott/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Michael Kovac/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Michael%20Kovac/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Emily Jean Stone/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Emily%20Jean%20Stone/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Eric Charbonneau/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Eric%20Charbonneau/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Dean Buscher/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Dean%20Buscher/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Amy Adams/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Amy%20Adams/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Danny Moon/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Danny%20Moon/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Papua New Guinea/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Papua%20New%20Guinea/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 93.4326,
                            'otcaRelevancy': 37.8065,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/California/Hollywood/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/California/Hollywood/',
                            'otcaConfidence': 73.7179,
                            'otcaRelevancy': 58.0624,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 34.098333,
                                'longitude': -118.326667
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Morocco/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Morocco/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 72.8548,
                            'otcaRelevancy': 37.713,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Melanesia/Papua New Guinea/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Melanesia/Papua%20New%20Guinea/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 93.4326,
                            'otcaRelevancy': 37.8065,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/California/Hollywood/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/California/Hollywood/',
                            'otcaConfidence': 73.7179,
                            'otcaRelevancy': 58.0624,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 34.098333,
                                'longitude': -118.326667
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Africa/NOSUBCONTINENT/Northern Africa/Morocco/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Africa/NOSUBCONTINENT/Northern%20Africa/Morocco/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 72.8548,
                            'otcaRelevancy': 37.713,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/positive/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/positive/'
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769552',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769553',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769550',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769549',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769551',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/Real%20Life/',
                            'id': '1226673807425',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462446',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956177',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462445',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956189',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226592254293',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462444',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956176',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/',
                            'id': '1226423680314',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226646528365',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956178',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956180',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956179',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'genetic superpowers',
                        'red-headed women',
                        'vitamin D',
                        'red hair',
                        'Science shows redheads',
                        'hair colours',
                        'beautiful red locks',
                        'popular man',
                        'Red-headed women handle',
                        'human temperature-detecting gene',
                        'women handle pain',
                        'cloudy European environments',
                        'redhead gene',
                        'gene mutation',
                        'fire gods',
                        'dye molecules',
                        'circus clown',
                        'celebrity stylist',
                        'native redheads',
                        'cold temperatures',
                        'talented actors',
                        'Hawaiian word',
                        'thermal extremes',
                        'Papua New Guinea',
                        'Melanesia',
                        'Oceania',
                        'Hollywood',
                        'California',
                        'United States of America',
                        'Northern America',
                        'North America',
                        'America',
                        'Morocco',
                        'Northern Africa',
                        'Africa',
                        'University of Buffalo',
                        'Oslo University',
                        'McGill University',
                        'New York Post Company',
                        'Getty Images Inc.',
                        'University of Louisville',
                        'Agence France Presse',
                        'Erin La Rosa',
                        'Ronald McDonald',
                        'Martins',
                        'Andrew Stott',
                        'Michael Kovac',
                        'Emily Jean Stone',
                        'Eric Charbonneau',
                        'Dean Buscher',
                        'Amy Adams',
                        'Danny Moon'
                    ],
                    'authors': [
                        'Isabelle Gogoll'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': 'cceb2f75e7a3863528ae523e64f8d4fa',
                                'link': 'http://cdn.newsapi.com.au/content/v2/cceb2f75e7a3863528ae523e64f8d4fa'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-4a38e334c881f7a66324a1a9376be0e4',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'b45316351e422377cb42ed1ce0891acf',
                                'link': 'http://cdn.newsapi.com.au/content/v2/b45316351e422377cb42ed1ce0891acf'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-646ac2cbdb9b6cf5f4ba5caf5a0a16f2',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '82e66d945f5f97ba8e7956736ff2b055',
                                'link': 'http://cdn.newsapi.com.au/content/v2/82e66d945f5f97ba8e7956736ff2b055'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-3666a0cd5cde7bcd26e4d7f103a7ee6a',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '3374f0e97660f9b6c3266d2ec971ff63',
                                'link': 'http://cdn.newsapi.com.au/content/v2/3374f0e97660f9b6c3266d2ec971ff63'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-20b86eb4e7262f13cdcad0e40bd5e52f',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '2ae2ee4d32d5fefd93a3e4219d1a8bc6',
                                'link': 'http://cdn.newsapi.com.au/content/v2/2ae2ee4d32d5fefd93a3e4219d1a8bc6'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-a80717c52b4b029f444043b6e38317a6',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '79ab5cc4bdffaaf42da80357ef956e93',
                                'link': 'http://cdn.newsapi.com.au/content/v2/79ab5cc4bdffaaf42da80357ef956e93'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-d42ae1470b0af7d84b730b1013bd5ef9',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'e6298fddcd27e28e691c72fe83fd77d2',
                                'link': 'http://cdn.newsapi.com.au/content/v2/e6298fddcd27e28e691c72fe83fd77d2'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-324f4456f8b1cff86cdaa7322f588c27',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'e642f0be962a96834a7949f1bb1a8a84',
                                'link': 'http://cdn.newsapi.com.au/content/v2/e642f0be962a96834a7949f1bb1a8a84'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-63a27219ffd0d2377057d95b1430682e',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '20ebfd5acee95e58e05a12eeb64d49ba',
                                'link': 'http://cdn.newsapi.com.au/content/v2/20ebfd5acee95e58e05a12eeb64d49ba'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-e30bbba12d20f8afe3e510eba47aaa87',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'a15519871354a0761dd18f53d4ff621d',
                                'link': 'http://cdn.newsapi.com.au/content/v2/a15519871354a0761dd18f53d4ff621d'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-7f112d21f2aa39c811727cf149d7d363',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '5fd99f993c17fec452f20b8dc28746eb',
                                'link': 'http://cdn.newsapi.com.au/content/v2/5fd99f993c17fec452f20b8dc28746eb'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': 34.098333,
                            'longitude': -118.326667
                        }
                    ],
                    'socialTitle': 'Science shows redheads have genetic superpowers',
                    'seoHeadline': 'Redheads have genetic superpowers, science says',
                    'userOriginUpdated': 'holmesj1',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'science-shows-redheads-have-genetic-superpowers',
                    'revision': 3,
                    'body': '\n\nDr. Augustin Galopin first recorded this fact in his 1886 book Le Parfum de la Femme. \n\nHe reportedly detected that red-headed women emit a particularly distinct aroma — that of ambergris, an earthy and sensual scent. (Later, science proved that skin mantle — a thin, acidic film on our skin’s surface — is actually more acidic in redheads, causing perfume to more quickly evaporate when applied and potentially emitting a unique smell of its own.)\n\nThis and other fascinating facts fill the new tome The Big Redhead Book (St. Martins), out now, by scarlet-haired writer Erin La Rosa.\n\nNot only are “gingers” a mere 2 per cent of the population (the rarest combination is a redhead with blue eyes like Adams), they’re also different in far subtler ways. Research indicates that redheads have higher thresholds for pain and need less vitamin D than the rest of us thanks to the MC1R gene mutation, which gives their hair its hue.\n\nHere are some of the most intriguing facts about the so-called “unicorns of the human world” adapted from La Rosa’s book: \n\nThey don’t need as much vitamin D \n\nThanks to higher concentration of red hair and pale skin in cloudy European environments, redheads adapted a greater ability to create their own vitamin D. So when a redhead goes outside, he or she produces more vitamin D in a shorter amount of time than people with other hair colours. This gives an evolutionary advantage, since low levels of vitamin D can lead to ailments like rickets, diabetes and arthritis.\n\nRed-headed women handle pain better \n\nA 2003 McGill University study showed that red-headed women can tolerate up to 25 per cent more pain than people with other hair colours. Another study out of Oslo University found that red-headed women feel less pain when pricked by a pin. Still, they’re harder to sedate. The University of Louisville found that it takes 20 per cent more general anaesthesia during surgery to put a redhead under. And while a brunette may only need one shot of Novocaine at the dentist, a redhead needs two or three.\n\nThey know when it’s getting cold \n\nRedheads feel hot and cold temperatures more severely than anyone else. In 2005, the University of Louisville discovered this hidden gift and hypothesised that the redhead gene, MC1R, may cause the human temperature-detecting gene to become overactivated, making redheads more sensitive to thermal extremes. So if a redhead tells you they’re feeling a bit chilly, you’d better grab a blanket, because winter is coming.\n\nRed is the hardest colour to fake \n\nRed hair from a bottle is almost always easy to spot. This is partially because red is a more intense hue and the bolder the colour, the faster it fades. Also, as celebrity stylist Danny Moon told InStyle, the dye molecules found in red hair are larger than those in other hues — and larger molecules can’t penetrate the hair as deeply as smaller molecules can.\n\nThey aren’t all white \n\nRedheads aren’t always fair skinned. There are native redheads born in places like Papua New Guinea and Morocco who have darker skin. There’s even a Hawaiian word for Polynesians with red hair — ‘ehu’ — whom they believe are the descendants of fire gods.\n\nRedheads are popular in commercials \n\nA 2014 report by Upstream Analysis found that 30 per cent of the TV commercials that run during prime time prominently feature a redhead. At one point, CBS showcased a ginger every 106 seconds. That’s a lot of red when you consider they’re just 2 per cent of the world’s population.\n\nRedheads are seen as funnier \n\nAccording to Professor Andrew Stott, who teaches the history of comedy at the University of Buffalo, we first began to see the circus clown as we know it — complete with face paint and brightly coloured wigs — in the early 19th century. The wigs needed to be bright to be seen from the backs of large theatres, so red was an obvious choice. Stott also speculates that the notion of the red-haired clown solidified in our culture during the early 20th century as a nod to the influx of Irish immigrants to America. “It’s no accident ... that Ronald McDonald spells his surname the Irish way instead of Scottish,” Stott tells La Rosa in the book.\n\nThis article was originally published on the New York Post and was republished here with permission. \n\n',
                    'standFirst': 'Forget everything you’ve heard about gingers. According to science, redheads have genetic superpowers and have higher thresholds for pain. \n\n',
                    'kicker': 'Redheads rejoice',
                    'byline': 'Susannah Cahalan',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [],
                    'bylineNames': [
                        'Susannah Cahalan'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': '1aabcba55e450aa2c6f85fa922b8a7d9',
                        'link': 'http://cdn.newsapi.com.au/content/v2/1aabcba55e450aa2c6f85fa922b8a7d9'
                    },
                    'originId': '01db2f8a-d57d-11e7-8b48-4ba45b565343',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Mysterious ancient city frozen in time',
                    'subtitle': 'China’s mysterious underwater city',
                    'description': 'HIDDEN in the depths of Qiandao Lake in China lies an eerily beautiful sunken city. Its ornate temples and intricately carved monuments perfectly preserved, a peculiar time capsule of Imperial China.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/1aabcba55e450aa2c6f85fa922b8a7d9?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'news.com.au',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': '01db2f8a-d57d-11e7-8b48-4ba45b565343',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T09:02:09.000Z',
                    'dateLive': '2017-11-30T04:40:00.000Z',
                    'customDate': '2017-12-03T09:02:00.000Z',
                    'dateCreated': '2017-11-30T03:17:33.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '12e5d1a3c3c68d762411fcad418fe5fd',
                            'link': 'http://cdn.newsapi.com.au/image/v1/12e5d1a3c3c68d762411fcad418fe5fd'
                        },
                        'originId': 'crop-ed113429aa71bd99092d1e04aff813fd',
                        'origin': 'METHODE',
                        'title': 'A Chinese city, forgotten after it was flooded when the government built a dam that turned the valley it was in into a lake, has resurfaced as an underwater adventure park for tourists.\n\nThe ancient city of Shi Cheng was also known as the Lion City because it was located in the province of Zhejiang, where it was surrounded by the five Lion Mountains.\n\nFounded over 1,300 years ago, it vanished from view 53 years ago when the Chinese government decided they needed a new hydroelectric power station. A dam was built to create a man-made lake, and as the water rose, the city was left at the bottom of this new found body of water.\n\nDepending on where on the lake bottom it is, the city is between 85 and 131 feet underwater.\n\nAnd there it remained forgotten until Qiu Feng, a local official in charge of tourism, introduced the idea of using Shi Cheng as a destination for diving clubs.\n\nFor the first try it was a voyage of discovery, and Qui said: "We were lucky. As soon as we dived into the lake, we found the outside wall of the town and even picked up a brick to prove it."\n\nIt was later discovered that the entire town was intact, including wooden beams and stairs.\n\nNow the city had attracted interest from archaeologists and a film crew has been on site to record the preservation of the lost ruins.  Picture: CEN/australscope',
                        'subtitle': '25e5630c-d30a-11e7-8263-c1e29330f0f6',
                        'description': 'A Chinese city, forgotten after it was flooded when the government built a dam that turned the valley it was in into a lake, has resurfaced as an underwater adventure park for tourists.\n\nThe ancient city of Shi Cheng was also known as the Lion City because it was located in the province of Zhejiang, where it was surrounded by the five Lion Mountains.\n\nFounded over 1,300 years ago, it vanished from view 53 years ago when the Chinese government decided they needed a new hydroelectric power station. A dam was built to create a man-made lake, and as the water rose, the city was left at the bottom of this new found body of water.\n\nDepending on where on the lake bottom it is, the city is between 85 and 131 feet underwater.\n\nAnd there it remained forgotten until Qiu Feng, a local official in charge of tourism, introduced the idea of using Shi Cheng as a destination for diving clubs.\n\nFor the first try it was a voyage of discovery, and Qui said: "We were lucky. As soon as we dived into the lake, we found the outside wall of the town and even picked up a brick to prove it."\n\nIt was later discovered that the entire town was intact, including wooden beams and stairs.\n\nNow the city had attracted interest from archaeologists and a film crew has been on site to record the preservation of the lost ruins.  Picture: CEN/australscope',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/12e5d1a3c3c68d762411fcad418fe5fd',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'australscope',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-11-27T00:30:20.000Z',
                        'dateLive': '2017-11-30T04:40:00.000Z',
                        'dateCreated': '2017-11-27T00:30:19.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'categories': [],
                        'keywords': [
                            'forgotten',
                            'years',
                            'bottom',
                            'dam',
                            'underwater adventure',
                            'Chinese city',
                            'hydroelectric power station',
                            'film crew',
                            'local official',
                            'Chinese government',
                            'new hydroelectric power',
                            'entire town',
                            'ancient city',
                            'water rose',
                            'new found body',
                            'wooden beams',
                            'lost ruins',
                            'diving clubs',
                            'first try',
                            'man-made lake',
                            'government',
                            'lake',
                            'chinese',
                            'water',
                            'town',
                            'archaeologists',
                            'power',
                            'interest',
                            'Shi Cheng',
                            'Qiu Feng'
                        ],
                        'authors': [],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'banksa',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '25e5630cd30a11e78263c1e29330f0f6',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'A Chinese city, forgotten after it was flooded wh',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '25e5630c-d30a-11e7-8263-c1e29330f0f6',
                        'enterpriseAssetId': 'NEWSMMGLPICT000168664750',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/1aabcba55e450aa2c6f85fa922b8a7d9?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/travel/world/asia/chinas-mysterious-underwater-city/news-story/1aabcba55e450aa2c6f85fa922b8a7d9'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/chinas-mysterious-underwater-city/news-story/1aabcba55e450aa2c6f85fa922b8a7d9'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/travel/world/asia/chinas-mysterious-underwater-city/news-story/1aabcba55e450aa2c6f85fa922b8a7d9'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/travel/world/asia/chinas-mysterious-underwater-city/news-story/1aabcba55e450aa2c6f85fa922b8a7d9'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/chinas-mysterious-underwater-city/news-story/1aabcba55e450aa2c6f85fa922b8a7d9'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/news/chinas-mysterious-underwater-city/news-story/1aabcba55e450aa2c6f85fa922b8a7d9'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/travel/chinas-mysterious-underwater-city/news-story/1aabcba55e450aa2c6f85fa922b8a7d9'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/travel/world-travel/asia/chinas-mysterious-underwater-city/news-story/1aabcba55e450aa2c6f85fa922b8a7d9'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/travel/world/asia/chinas-mysterious-underwater-city/news-story/1aabcba55e450aa2c6f85fa922b8a7d9'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/travel/chinas-mysterious-underwater-city/news-story/1aabcba55e450aa2c6f85fa922b8a7d9'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/travel/world/asia/chinas-mysterious-underwater-city/news-story/1aabcba55e450aa2c6f85fa922b8a7d9'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/news/chinas-mysterious-underwater-city/news-story/1aabcba55e450aa2c6f85fa922b8a7d9'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Travel - News.com.au/World Travel/Asia/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Travel%20-%20News.com.au/World%20Travel/Asia/',
                        'id': '1226515145871',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Travel - News.com.au/World Travel/Asia/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Travel%20-%20News.com.au/World%20Travel/Asia/',
                            'id': '1226515145871',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226515145871/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226515145871/',
                            'id': '1226515145871',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Travel - News.com.au/World Travel/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Travel%20-%20News.com.au/World%20Travel/',
                            'id': '1226515135900',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226515135900/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226515135900/',
                            'id': '1226515135900',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Travel%20-%20News.com.au/',
                            'id': '1226515126871',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226515126871/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226515126871/',
                            'id': '1226515126871',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Apple News/NewsComAu/Home/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Apple%20News/NewsComAu/Home/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227528026986/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227528026986/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Julia Corderoy/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Julia%20Corderoy/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/arts, culture and entertainment/archaeology/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/arts,%20culture%20and%20entertainment/archaeology/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/economy, business and finance/tourism and leisure/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/economy,%20business%20and%20finance/tourism%20and%20leisure/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/economy, business and finance/energy and resource/electricity production and distribution/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/economy,%20business%20and%20finance/energy%20and%20resource/electricity%20production%20and%20distribution/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/01001000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/01001000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/04014000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/04014000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/04005006/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/04005006/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/ancient city/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/ancient%20city/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Chinese government/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Chinese%20government/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/lost ruins/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/lost%20ruins/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/diving clubs/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/diving%20clubs/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/film crew/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/film%20crew/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/wooden beams/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/wooden%20beams/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/underwater city/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/underwater%20city/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/hydroelectric power station/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/hydroelectric%20power%20station/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/lost city/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/lost%20city/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/underwater adventure/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/underwater%20adventure/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Chinese city/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Chinese%20city/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/water rose/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/water%20rose/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/peculiar time capsule/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/peculiar%20time%20capsule/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/man-made lake/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/man-made%20lake/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Mysterious ancient city/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Mysterious%20ancient%20city/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Eery anicent city/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Eery%20anicent%20city/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/historical buildings date/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/historical%20buildings%20date/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/preserved temples date/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/preserved%20temples%20date/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/entrance gates/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/entrance%20gates/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/British Broadcasting Corporation/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/British%20Broadcasting%20Corporation/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Shi Cheng/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Shi%20Cheng/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Qiu Feng/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Qiu%20Feng/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/China/NOPROVINCESTATE/Shanghai/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/China/NOPROVINCESTATE/Shanghai/',
                            'otcaConfidence': 85.6397,
                            'otcaRelevancy': 56.9948,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 31.222222,
                                'longitude': 121.458056
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/China/Zhejiang/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/China/Zhejiang/NOSUBURB/',
                            'otcaConfidence': 82.6387,
                            'otcaRelevancy': 68.7596,
                            'otcaFrequency': 3,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/China/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/China/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 75.8558,
                            'otcaRelevancy': 77.0543,
                            'otcaFrequency': 4,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Asia/NOSUBCONTINENT/Eastern Asia/China/NOPROVINCESTATE/Shanghai/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Asia/NOSUBCONTINENT/Eastern%20Asia/China/NOPROVINCESTATE/Shanghai/',
                            'otcaConfidence': 85.6397,
                            'otcaRelevancy': 56.9948,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 31.222222,
                                'longitude': 121.458056
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Asia/NOSUBCONTINENT/Eastern Asia/China/Zhejiang/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Asia/NOSUBCONTINENT/Eastern%20Asia/China/Zhejiang/NOSUBURB/',
                            'otcaConfidence': 82.6387,
                            'otcaRelevancy': 68.7596,
                            'otcaFrequency': 3,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Asia/NOSUBCONTINENT/Eastern Asia/China/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Asia/NOSUBCONTINENT/Eastern%20Asia/China/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 75.8558,
                            'otcaRelevancy': 77.0543,
                            'otcaFrequency': 4,
                            'selected': 'auto'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/couriermail.com.au/Travel - syndicated/World/Asia/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Travel%20-%20syndicated/World/Asia/',
                            'id': '1226646713420',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Travel - syndicated/World/Asia/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Travel%20-%20syndicated/World/Asia/',
                            'id': '1226617399811',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Travel - syndicated/World/Asia/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Travel%20-%20syndicated/World/Asia/',
                            'id': '1226617399810',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Travel - syndicated/World/Asia/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Travel%20-%20syndicated/World/Asia/',
                            'id': '1226596966250',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Travel - syndicated/World/Asia/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Travel%20-%20syndicated/World/Asia/',
                            'id': '1226617399809',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Travel/World Travel/Asia/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Travel/World%20Travel/Asia/',
                            'id': '1111112067573',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Travel - syndicated/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Travel%20-%20syndicated/World/',
                            'id': '1226646670499',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Travel - syndicated/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Travel%20-%20syndicated/World/',
                            'id': '1226617383565',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Travel - syndicated/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Travel%20-%20syndicated/World/',
                            'id': '1226617383564',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Travel - syndicated/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Travel%20-%20syndicated/World/',
                            'id': '1226596966056',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Travel - syndicated/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Travel%20-%20syndicated/World/',
                            'id': '1226617383563',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Travel/World Travel/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Travel/World%20Travel/',
                            'id': '1111112067546',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Travel - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Travel%20-%20syndicated/',
                            'id': '1226617365890',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Travel%20-%20News.com.au/',
                            'id': '1228033182299',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Travel - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Travel%20-%20syndicated/',
                            'id': '1226617365889',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Travel%20-%20News.com.au/',
                            'id': '1228033182298',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Travel - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Travel%20-%20syndicated/',
                            'id': '1226596961104',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Travel - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Travel%20-%20syndicated/',
                            'id': '1226617365888',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Travel%20-%20News.com.au/',
                            'id': '1228033182302',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Travel/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Travel/',
                            'id': '1111112067447',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Travel - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Travel%20-%20syndicated/',
                            'id': '1226646618129',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Travel%20-%20News.com.au/',
                            'id': '1228033182300',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Travel%20-%20News.com.au/',
                            'id': '1228033182301',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Travel - News.com.au/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Travel%20-%20News.com.au/',
                            'id': '1228033182303',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'ancient city',
                        'Chinese government',
                        'lost ruins',
                        'diving clubs',
                        'film crew',
                        'wooden beams',
                        'underwater city',
                        'hydroelectric power station',
                        'lost city',
                        'underwater adventure',
                        'Chinese city',
                        'water rose',
                        'peculiar time capsule',
                        'man-made lake',
                        'Mysterious ancient city',
                        'Eery anicent city',
                        'historical buildings date',
                        'preserved temples date',
                        'entrance gates',
                        'Shanghai',
                        'China',
                        'Eastern Asia',
                        'Asia',
                        'Zhejiang',
                        'British Broadcasting Corporation',
                        'Shi Cheng',
                        'Qiu Feng'
                    ],
                    'authors': [
                        'Julia Corderoy'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '12e5d1a3c3c68d762411fcad418fe5fd',
                                'link': 'http://cdn.newsapi.com.au/content/v2/12e5d1a3c3c68d762411fcad418fe5fd'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-ed113429aa71bd99092d1e04aff813fd',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '1b0ee489f1a9a93c69a462c867e1a733',
                                'link': 'http://cdn.newsapi.com.au/content/v2/1b0ee489f1a9a93c69a462c867e1a733'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-881389f6a81046489098c17ae2f6cb1d',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '01031e8d91aa2a46827f40327d7db7fa',
                                'link': 'http://cdn.newsapi.com.au/content/v2/01031e8d91aa2a46827f40327d7db7fa'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-3424bbc65d15a111a257b53f1dc4ede5',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'dbe3a3170216cb78ef891f137f0d2ae6',
                                'link': 'http://cdn.newsapi.com.au/content/v2/dbe3a3170216cb78ef891f137f0d2ae6'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-e554295bb47b22440105844a9f0cce15',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '1359c21cccc059409a9e5b9fbe57821e',
                                'link': 'http://cdn.newsapi.com.au/content/v2/1359c21cccc059409a9e5b9fbe57821e'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-d1781c029e5a1cca2d02bf939aa46fec',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'bb7a54ea839351914575f23474f09e39',
                                'link': 'http://cdn.newsapi.com.au/content/v2/bb7a54ea839351914575f23474f09e39'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-8e82d418a3a1f6674a77bbb163134f0c',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '8434b87f351872badbd857d9a30de3a4',
                                'link': 'http://cdn.newsapi.com.au/content/v2/8434b87f351872badbd857d9a30de3a4'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-53f4501501405594be881d89fd6d49a8',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '31f3242276300882862ebcfb2863955f',
                                'link': 'http://cdn.newsapi.com.au/content/v2/31f3242276300882862ebcfb2863955f'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': 31.222222,
                            'longitude': 121.458056
                        }
                    ],
                    'socialTitle': 'Eerie ancient city frozen in time',
                    'seoHeadline': 'Lion City, China: Underwater city attracts tourists for diving | Pictures',
                    'userOriginUpdated': 'banksa',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'chinas-mysterious-underwater-city',
                    'revision': 1,
                    'body': 'The city, known as Shi Cheng, lies 40m underwater in Zhejiang province, 400km south of Shanghai. Built during the Eastern Han Dynasty, the historical buildings date back to the 2nd century.\n\nIts name loosely translates to “Lion City” but since the regal city was drowned and forgotten about until recently, Shi Cheng has come to be dubbed the “Atlantis of the East” (after the mythical underwater island). \n\nBut unlike Atlantis, Shi Cheng didn’t succumb to the depths under dramatic or mysterious circumstances. The city was purposely flooded in 1959 to create the Xin’an Dam, built to power a hydro-electric plant. \n\nAccording to the , nearly 300,000 people were relocated for the project, some of whom had families that had lived in the city for centuries.\n\nIt was left untouched and unremembered for decades until 2001, when the Chinese government decided to see what might remain of the lost metropolis.\n\nInterest in this ancient city frozen in time increased when Qiu Feng, a local official in charge of tourism, introduced the idea of using Shi Cheng as a destination for diving clubs. “We were lucky. As soon as we dived into the lake, we found the outside wall of the town and even picked up a brick to prove it,” he said. \n\nIt was later discovered that the entire town was intact, including wooden beams and stairs. Expeditions revealed that the city had five entrance gates, as opposed to the traditional four, according to the , and its wide streets had 265 archways featuring preserved stonework of lions, dragons, phoenixes and historical inscriptions.\n\nToday, it is popular attraction for tourists with dive operators running regular dives between April and November when the water is warmer. \n\nThere are plans to boost its tourism potential by constructing a floating tunnel across the lake.\n\nThe city has also attracted interest from archaeologists and a film crew has been on site to record the preservation of the lost ruins.\n\n',
                    'standFirst': 'BENEATH the water of a lake lies a peculiar time capsule of Imperial China. Its perfectly preserved temples date back thousands of years.\n\n',
                    'kicker': 'China',
                    'byline': 'Julia Corderoy',
                    'commentsAllowed': true,
                    'commentsTotal': 0,
                    'commentsShown': true,
                    'authorProfileIds': [],
                    'bylineNames': [
                        'Julia Corderoy'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': 'ded2c1c8d4c297316454a2f66c357f48',
                        'link': 'http://cdn.newsapi.com.au/content/v2/ded2c1c8d4c297316454a2f66c357f48'
                    },
                    'originId': 'a946d19a-d7ce-11e7-b5a9-0fbc45dc1ac5',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Sia’s extreme overshare with fans is hilarious',
                    'subtitle': 'Sia shared with her fans why she was late and they were far from disappointed',
                    'description': 'SIA could possibly be one of the most down-to-earth stars on the planet.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/ded2c1c8d4c297316454a2f66c357f48?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'news.com.au',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': 'a946d19a-d7ce-11e7-b5a9-0fbc45dc1ac5',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T04:59:08.000Z',
                    'dateLive': '2017-12-03T02:56:00.000Z',
                    'customDate': '2017-12-03T04:54:00.000Z',
                    'dateCreated': '2017-12-03T02:07:06.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': 'ca27c99c40b1dff59d2b9c0ab41326c2',
                            'link': 'http://cdn.newsapi.com.au/image/v1/ca27c99c40b1dff59d2b9c0ab41326c2'
                        },
                        'originId': 'crop-bce7d5b7884215dec6b4cc791c13f96d',
                        'origin': 'METHODE',
                        'title': 'The Weinstein Company With The Hollywood Reporter, Samsung Galaxy And The Cinema Society Host A Screening Of "Django Unchained"  - Arrivals',
                        'subtitle': '4e4563b0-d7d3-11e7-b5a9-0fbc45dc1ac5',
                        'description': 'NEW YORK, NY - DECEMBER 11:  Sia Furler attends a screening of "Django Unchained" hosted by The Weinstein Company with The Hollywood Reporter, Samsung Galaxy and The Cinema Society at Ziegfeld Theater on December 11, 2012 in New York City.  (Photo by Stephen Lovekin/Getty Images)',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/ca27c99c40b1dff59d2b9c0ab41326c2',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'Supplied',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T04:54:31.000Z',
                        'dateLive': '2017-12-03T02:56:00.000Z',
                        'dateCreated': '2017-12-03T02:40:20.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'primaryCategory': {
                            'value': '/author/newscorpaustralia.com/Stephen Lovekin/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Stephen%20Lovekin/'
                        },
                        'categories': [
                            {
                                'value': '/author/newscorpaustralia.com/Stephen Lovekin/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Stephen%20Lovekin/'
                            },
                            {
                                'value': '/location/iptc.org/United States/NY/New York/Ziegfeld Theater/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/location/iptc.org/United%20States/NY/New%20York/Ziegfeld%20Theater/',
                                'selected': 'auto'
                            },
                            {
                                'value': '/countrycode/iptc.org/USA/NY/New York/Ziegfeld Theater/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/countrycode/iptc.org/USA/NY/New%20York/Ziegfeld%20Theater/',
                                'selected': 'auto'
                            }
                        ],
                        'keywords': [
                            'screening',
                            'photo',
                            'society',
                            'cinema',
                            'Hollywood Reporter',
                            'The Weinstein Company',
                            'Samsung Galaxy and The Cinema Society',
                            'Ziegfeld Theater',
                            'Getty Images Inc.',
                            'Sia Furler',
                            'Stephen Lovekin'
                        ],
                        'authors': [
                            'Stephen Lovekin'
                        ],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'coyb',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '4e4563b0d7d311e7b5a90fbc45dc1ac5',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'The Weinstein Company With The Hollywood Reporter, Samsung Galaxy And The Cinema Society Host A Screening Of "Django Unchained"  - Arrivals',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '4e4563b0-d7d3-11e7-b5a9-0fbc45dc1ac5',
                        'enterpriseAssetId': 'NEWSMMGLPICT000113426841',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/ded2c1c8d4c297316454a2f66c357f48?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/entertainment/music/sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed/news-story/ded2c1c8d4c297316454a2f66c357f48'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/entertainment/music/sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed/news-story/ded2c1c8d4c297316454a2f66c357f48'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/entertainment/music/sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed/news-story/ded2c1c8d4c297316454a2f66c357f48'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/entertainment/music/sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed/news-story/ded2c1c8d4c297316454a2f66c357f48'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/entertainment/music/sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed/news-story/ded2c1c8d4c297316454a2f66c357f48'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/entertainment/music/sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed/news-story/ded2c1c8d4c297316454a2f66c357f48'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/entertainment/music/sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed/news-story/ded2c1c8d4c297316454a2f66c357f48'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/entertainment/music/tours/sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed/news-story/ded2c1c8d4c297316454a2f66c357f48'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/entertainment/music/sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed/news-story/ded2c1c8d4c297316454a2f66c357f48'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/entertainment/music/sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed/news-story/ded2c1c8d4c297316454a2f66c357f48'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/entertainment/music/sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed/news-story/ded2c1c8d4c297316454a2f66c357f48'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/entertainment/music/sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed/news-story/ded2c1c8d4c297316454a2f66c357f48'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Music/Music Tours/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Music/Music%20Tours/',
                        'id': '1226550982663',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Music/Music Tours/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Music/Music%20Tours/',
                            'id': '1226550982663',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226550982663/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226550982663/',
                            'id': '1226550982663',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Music/',
                            'id': '1226494578312',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226494578312/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226494578312/',
                            'id': '1226494578312',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/',
                            'id': '1226494497264',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226494497264/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226494497264/',
                            'id': '1226494497264',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Bailee Dean/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Bailee%20Dean/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/arts, culture and entertainment/music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/arts,%20culture%20and%20entertainment/music/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/economy, business and finance/tourism and leisure/tour operator/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/economy,%20business%20and%20finance/tourism%20and%20leisure/tour%20operator/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/human interest/people/celebrity/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/human%20interest/people/celebrity/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/weather/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/weather/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/01011000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/01011000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/04014005/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/04014005/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/08003002/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/08003002/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/17000000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/17000000/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/blockquote class/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/blockquote%20class/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/async src/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/async%20src/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/crazy diarrhoea/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/crazy%20diarrhoea/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/plane due/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/plane%20due/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Massive apologies/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Massive%20apologies/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/crazy diarrhea/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/crazy%20diarrhea/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Australian tour/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Australian%20tour/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/city skies/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/city%20skies/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Music Video/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Music%20Video/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Getty Images Inc./otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Getty%20Images%20Inc./otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Stephen Lovekin/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Stephen%20Lovekin/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Dusk Till/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Dusk%20Till/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/New South Wales/Sydney/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/New%20South%20Wales/Sydney/',
                            'otcaConfidence': 82.716,
                            'otcaRelevancy': 74.5364,
                            'otcaFrequency': 4,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': -33.867778,
                                'longitude': 151.207222
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/Victoria/Melbourne/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/Victoria/Melbourne/',
                            'otcaConfidence': 79.2763,
                            'otcaRelevancy': 67.0899,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/New South Wales/Sydney/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/New%20South%20Wales/Sydney/',
                            'otcaConfidence': 82.716,
                            'otcaRelevancy': 74.5364,
                            'otcaFrequency': 4,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': -33.867778,
                                'longitude': 151.207222
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/Victoria/Melbourne/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/Victoria/Melbourne/',
                            'otcaConfidence': 79.2763,
                            'otcaRelevancy': 67.0899,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/couriermail.com.au/Entertainment - syndicated/Music/Music Tours/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Entertainment%20-%20syndicated/Music/Music%20Tours/',
                            'id': '1226646446137',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/Music/tours/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/Music/tours/',
                            'id': '1111112063361',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Entertainment - syndicated/Music/Music Tours/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Entertainment%20-%20syndicated/Music/Music%20Tours/',
                            'id': '1226617407899',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Entertainment - syndicated/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Entertainment%20-%20syndicated/Music/',
                            'id': '1226617400437',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Entertainment - syndicated/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Entertainment%20-%20syndicated/Music/',
                            'id': '1228018416042',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Entertainment - syndicated/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Entertainment%20-%20syndicated/Music/',
                            'id': '1226617400436',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Entertainment - syndicated/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Entertainment%20-%20syndicated/Music/',
                            'id': '1228018416047',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Entertainment - syndicated/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Entertainment%20-%20syndicated/Music/',
                            'id': '1226597417636',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Entertainment - syndicated/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Entertainment%20-%20syndicated/Music/',
                            'id': '1226617400435',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Entertainment - syndicated/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Entertainment%20-%20syndicated/Music/',
                            'id': '1228018416046',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/Music/',
                            'id': '1111112063289',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Entertainment - syndicated/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Entertainment%20-%20syndicated/Music/',
                            'id': '1226646444757',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Entertainment - syndicated/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Entertainment%20-%20syndicated/Music/',
                            'id': '1228018416043',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Entertainment - syndicated/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Entertainment%20-%20syndicated/Music/',
                            'id': '1228018416045',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Entertainment - syndicated/Music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Entertainment%20-%20syndicated/Music/',
                            'id': '1228018416044',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369329',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935502',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369324',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935504',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226588210335',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369322',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935507',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/',
                            'id': '1111112062929',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226637326589',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935503',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935505',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935506',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'blockquote class',
                        'async src',
                        'crazy diarrhoea',
                        'plane due',
                        'Massive apologies',
                        'crazy diarrhea',
                        'Australian tour',
                        'city skies',
                        'Music Video',
                        'Sydney',
                        'New South Wales',
                        'Australia',
                        'Australia and New Zealand',
                        'Oceania',
                        'Melbourne',
                        'Victoria',
                        'Getty Images Inc.',
                        'Stephen Lovekin',
                        'Dusk Till'
                    ],
                    'authors': [
                        'Bailee Dean'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': 'ca27c99c40b1dff59d2b9c0ab41326c2',
                                'link': 'http://cdn.newsapi.com.au/content/v2/ca27c99c40b1dff59d2b9c0ab41326c2'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-bce7d5b7884215dec6b4cc791c13f96d',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'c1ff2b1132f2ca2ddabd5bc324c6e814',
                                'link': 'http://cdn.newsapi.com.au/content/v2/c1ff2b1132f2ca2ddabd5bc324c6e814'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-13cbb87c1d6e174cffe8a0dd7d3c897d',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'a1a431598dceb60d34d9a5f2e1d82908',
                                'link': 'http://cdn.newsapi.com.au/content/v2/a1a431598dceb60d34d9a5f2e1d82908'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-819ea5e943d57153b28cd720dea2a591',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '3d1b0b19cda3b6276a341dfbeef6be2c',
                                'link': 'http://cdn.newsapi.com.au/content/v2/3d1b0b19cda3b6276a341dfbeef6be2c'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-de77a6229545cfd8a37d770a66001469',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'dac98f680ab677f586a4714084345856',
                                'link': 'http://cdn.newsapi.com.au/content/v2/dac98f680ab677f586a4714084345856'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-c5c1a201b86d43d409d051eb4b3ebf4b',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '4227a0910c792466f03846940b30da0e',
                                'link': 'http://cdn.newsapi.com.au/content/v2/4227a0910c792466f03846940b30da0e'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-00eab88137d92d11b440dc88d4c92231',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '6d4b04833799430441c3a73320724161',
                                'link': 'http://cdn.newsapi.com.au/content/v2/6d4b04833799430441c3a73320724161'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-af2cd34eeaca65459a1717f983194d3b',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '2282b6534d76adcf4c01959a7da6c1a5',
                                'link': 'http://cdn.newsapi.com.au/content/v2/2282b6534d76adcf4c01959a7da6c1a5'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '2282b6534d76adcf4c01959a7da6c1a5',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'fd67bfb5f29a89fe1e750e9a91c9b6f2',
                                'link': 'http://cdn.newsapi.com.au/content/v2/fd67bfb5f29a89fe1e750e9a91c9b6f2'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'fd67bfb5f29a89fe1e750e9a91c9b6f2',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '46777118a5f10359f45455104216de9b',
                                'link': 'http://cdn.newsapi.com.au/content/v2/46777118a5f10359f45455104216de9b'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '46777118a5f10359f45455104216de9b',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '07f56646c5ed3a8e1764273295b63417',
                                'link': 'http://cdn.newsapi.com.au/content/v2/07f56646c5ed3a8e1764273295b63417'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': -33.867778,
                            'longitude': 151.207222
                        }
                    ],
                    'socialTitle': 'Sia’s preconcert ‘crazy-diarrhoea’ fiasco',
                    'seoHeadline': 'Sia Australian tour: ‘Crazy diarrhoea’',
                    'userOriginUpdated': 'coyb',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'sia-shared-with-her-fans-why-she-was-late-and-they-were-far-from-disappointed',
                    'revision': 8,
                    'body': 'The Aussie singer-songwriter and producer is currently on tour in Oz and all was sailing smoothly until a couple of days ago. \n\nOn Friday she had a show in Sydney. Due to the tidal wave of rain gracing the city skies where she was in Melbourne, Sia was unable to catch her flight as planned.\n\nBut she didn’t let the setback stop her. \n\nSoldiering on, the star drove 13 hours to get to the gig. Talk about determination. \n\nAll was going well until she got a flat tyre. \n\nNot the end of the world, but when you’ve literally got thousands of fans waiting for you to perform and you’re running late, the pressure would surely be a little overwhelming - as Sia experienced.\n\nIn fact, the stress of the situation became so much it gave her “crazy diarrhoea”, as she tweeted to her 3.6 million followers.\n\nStill pushing to get to the venue she kept her fans updated. \n\nHer fans went absolute nuts over her dedication. \n\nOne user tweeted, “Omg it’s not called diarrhoea anymore but Siarrhea from now on”. \n\nHer fans continued to assure her. \n\nOne wrote, “Don’t worry Queen, we would wait the whole lifetime for you”. \n\nWhile another said: \n\nSia made it to the venue and finished her concert with a deafening cheer from the crowd. \n\nYou go girl. \n\n',
                    'standFirst': 'AUSSIE sonstress Sia has hilariously shocked fans by revealing the very graphic reason she was running late to her concert. \n\n',
                    'kicker': 'Crazy diarrhoea',
                    'byline': 'Bailee Dean',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [],
                    'bylineNames': [
                        'Bailee Dean'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': '6ea07aedf315e6ec67475dcaf3ca1b3d',
                        'link': 'http://cdn.newsapi.com.au/content/v2/6ea07aedf315e6ec67475dcaf3ca1b3d'
                    },
                    'originId': '10699c36-d603-11e7-b0af-5e743c45d30b',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': '‘Pulled muscle’ a death sentence for GP',
                    'subtitle': 'Sore shoulder was in reality aggressive cancer that GP picked up at hospital where she worked',
                    'description': 'WHEN a healthy, successful GP felt a pain in her shoulder one day, she wasn’t too worried, assuming it was a pulled muscle.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/6ea07aedf315e6ec67475dcaf3ca1b3d?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'news.com.au',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': '10699c36-d603-11e7-b0af-5e743c45d30b',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T19:04:15.000Z',
                    'dateLive': '2017-11-30T19:47:00.000Z',
                    'customDate': '2017-12-03T19:04:00.000Z',
                    'dateCreated': '2017-11-30T19:17:10.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '278893b5cbbb6b66abcb8565efa7a3f9',
                            'link': 'http://cdn.newsapi.com.au/image/v1/278893b5cbbb6b66abcb8565efa7a3f9'
                        },
                        'originId': 'crop-4c1023f01e8043f23f0ed343210efaea',
                        'origin': 'METHODE',
                        'title': 'F22GRAB\nGrab for asbestos',
                        'subtitle': '5e979a46-d605-11e7-b0af-5e743c45d30b',
                        'description': 'F22GRAB\nGrab for asbestos',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/278893b5cbbb6b66abcb8565efa7a3f9',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'Supplied',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T05:37:13.000Z',
                        'dateLive': '2017-11-30T19:47:00.000Z',
                        'dateCreated': '2017-11-30T19:33:40.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'categories': [],
                        'keywords': [
                            'asbestos'
                        ],
                        'authors': [],
                        'domains': [
                            'newscorpaustralia.com',
                            'weeklytimesnow.com.au',
                            'couriermail.com.au',
                            'goldcoastbulletin.com.au',
                            'adelaidenow.com.au',
                            'heraldsun.com.au',
                            'themercury.com.au',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'news.com.au',
                            'perthnow.com.au',
                            'townsvillebulletin.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'holmesj1',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '5e979a46d60511e7b0af5e743c45d30b',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'F22GRAB\nGrab for asbestos',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '5e979a46-d605-11e7-b0af-5e743c45d30b',
                        'enterpriseAssetId': 'NEWSMMGLPICT000168129888',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'weeklytimesnow.com.au',
                            'link': 'http://www.weeklytimesnow.com.au/news/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        },
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/6ea07aedf315e6ec67475dcaf3ca1b3d?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/lifestyle/health/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/lifestyle/health/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/lifestyle/health/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/news/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/news/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/lifestyle/health/health-problems/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/lifestyle/health/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/lifestyle/health/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/news/sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked/news-story/6ea07aedf315e6ec67475dcaf3ca1b3d'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Health/Health Problems/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Health/Health%20Problems/',
                        'id': '1226521258930',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Health/Health Problems/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Health/Health%20Problems/',
                            'id': '1226521258930',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226521258930/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226521258930/',
                            'id': '1226521258930',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Apple News/NewsComAu/Home/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Apple%20News/NewsComAu/Home/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227528026986/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227528026986/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/',
                            'id': '1226487036675',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226487036675/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226487036675/',
                            'id': '1226487036675',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/National/',
                            'id': '1226490441611',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226490441611/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226490441611/',
                            'id': '1226490441611',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/National/news.com.auNSW/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/National/news.com.auNSW/',
                            'id': '1226683638751',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226683638751/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226683638751/',
                            'id': '1226683638751',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/National/news.com.auNSW/news.com.auNSW-ACT-NEWS/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/National/news.com.auNSW/news.com.auNSW-ACT-NEWS/',
                            'id': '1227585684429',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227585684429/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227585684429/',
                            'id': '1227585684429',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/',
                            'id': '1226521171876',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226521171876/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226521171876/',
                            'id': '1226521171876',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Health/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Health/',
                            'id': '1226521179224',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226521179224/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226521179224/',
                            'id': '1226521179224',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Emma Reynolds/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Emma%20Reynolds/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/health/disease/cancer/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/health/disease/cancer/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/health/health treatment/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/health/health%20treatment/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/labour/employee/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/labour/employee/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/health/illness/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/health/illness/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/07001004/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/07001004/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/07003000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/07003000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/09016000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/09016000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/07017000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/07017000/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/asbestos exposure/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/asbestos%20exposure/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/asbestos fibre/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/asbestos%20fibre/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/kindergarten site/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/kindergarten%20site/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/asbestos-related illness/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/asbestos-related%20illness/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/asbestos fibres/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/asbestos%20fibres/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Asbestos clean-up/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Asbestos%20clean-up/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/cause cancer/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/cause%20cancer/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/sugar cane/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/sugar%20cane/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/aggressive illness/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/aggressive%20illness/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/death sentence/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/death%20sentence/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/roof sheeting/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/roof%20sheeting/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/pulled muscle/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/pulled%20muscle/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/asbestos cancers/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/asbestos%20cancers/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/aware asbestos exposure/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/aware%20asbestos%20exposure/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/asbestos materials/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/asbestos%20materials/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/ASBESTOS TIPS/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/ASBESTOS%20TIPS/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/asbestos safety equipment/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/asbestos%20safety%20equipment/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/accredited testing lab/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/accredited%20testing%20lab/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/asbestos products/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/asbestos%20products/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/lung cancer/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/lung%20cancer/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/ceiling tiles/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/ceiling%20tiles/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/steam pipes/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/steam%20pipes/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/executive partner/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/executive%20partner/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/home renovations/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/home%20renovations/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/latency period/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/latency%20period/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/radiation therapy/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/radiation%20therapy/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Pulled shoulder muscle/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Pulled%20shoulder%20muscle/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/survival rates/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/survival%20rates/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/tribute page/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/tribute%20page/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/safety standards/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/safety%20standards/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/mesothelioma dead/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/mesothelioma%20dead/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Show caution/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Show%20caution/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/people die/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/people%20die/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/workplace infrastructure/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/workplace%20infrastructure/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/classic cars/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/classic%20cars/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/unfortunate things/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/unfortunate%20things/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/integral part/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/integral%20part/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Australian employees/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Australian%20employees/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/eBay Inc./otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/eBay%20Inc./otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Asbestos Safety and Eradication Agency/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Asbestos%20Safety%20and%20Eradication%20Agency/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/John/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/John/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Ben Harrison/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Ben%20Harrison/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Pauline Vizzard/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Pauline%20Vizzard/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Emma Reynolds/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Emma%20Reynolds/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/David Jones/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/David%20Jones/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Chris Eastman/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Chris%20Eastman/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/Victoria/Melbourne/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/Victoria/Melbourne/',
                            'otcaConfidence': 80.0022,
                            'otcaRelevancy': 47.2501,
                            'otcaFrequency': 3,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 78.835,
                            'otcaRelevancy': 50.7607,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/China/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/China/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 78.1128,
                            'otcaRelevancy': 38.5922,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/Queensland/Cairns/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/Queensland/Cairns/',
                            'otcaConfidence': 69.4752,
                            'otcaRelevancy': 49.6495,
                            'otcaFrequency': 2,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': -16.916667,
                                'longitude': 145.766667
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/Victoria/Melbourne/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/Victoria/Melbourne/',
                            'otcaConfidence': 80.0022,
                            'otcaRelevancy': 47.2501,
                            'otcaFrequency': 3,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 78.835,
                            'otcaRelevancy': 50.7607,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Asia/NOSUBCONTINENT/Eastern Asia/China/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Asia/NOSUBCONTINENT/Eastern%20Asia/China/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 78.1128,
                            'otcaRelevancy': 38.5922,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/Queensland/Cairns/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/Queensland/Cairns/',
                            'otcaConfidence': 69.4752,
                            'otcaRelevancy': 49.6495,
                            'otcaFrequency': 2,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': -16.916667,
                                'longitude': 145.766667
                            }
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/Health/Illness/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/Health/Illness/',
                            'id': '1226646564396',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/Health/Illness/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/Health/Illness/',
                            'id': '1226617476565',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/Health/Illness/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/Health/Illness/',
                            'id': '1226617476563',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/Health/Illness/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/Health/Illness/',
                            'id': '1226600808760',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/Health/Illness/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/Health/Illness/',
                            'id': '1226617476564',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/Health and Fitness/Health Problems/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/Health%20and%20Fitness/Health%20Problems/',
                            'id': '1226427030697',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Network%20News/',
                            'id': '1111112000022',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Network%20News/',
                            'id': '1226692466903',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Network%20News/',
                            'id': '1111112026929',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Network%20News/',
                            'id': '1226696899975',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Network%20News/',
                            'id': '1111112043252',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Network%20News/',
                            'id': '1111112081508',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Network%20News/',
                            'id': '1226696899976',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/weeklytimesnow.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/weeklytimesnow.com.au/Network%20News/',
                            'id': '1226696899972',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Network%20News/',
                            'id': '1111112018754',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Network%20News/',
                            'id': '1226683746263',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Network%20News/',
                            'id': '1226696899973',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Network%20News/',
                            'id': '1226696899974',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Network%20News/National/',
                            'id': '1226628352059',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Network%20News/National/',
                            'id': '1226692643376',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Network%20News/National/',
                            'id': '1226696905240',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Network%20News/National/',
                            'id': '1226596458827',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Network%20News/National/',
                            'id': '1226696905243',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/weeklytimesnow.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/weeklytimesnow.com.au/Network%20News/National/',
                            'id': '1226696905239',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/National News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/National%20News/',
                            'id': '1226312254910',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Network%20News/National/',
                            'id': '1226646734598',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Network%20News/National/',
                            'id': '1226696905241',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Network%20News/National/',
                            'id': '1226696905242',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Network%20News/National/',
                            'id': '1226618420664',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Network%20News/National/',
                            'id': '1226618420663',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Network%20News/National/',
                            'id': '1226683748532',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/National News/NSW/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/National%20News/NSW/',
                            'id': '1226683644802',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/National News/NSW/NSW ACT NEWS/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/National%20News/NSW/NSW%20ACT%20NEWS/',
                            'id': '1227585577675',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462446',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956177',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462445',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956189',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226592254293',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462444',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956176',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/',
                            'id': '1226423680314',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226646528365',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956178',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956180',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956179',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/Health/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/Health/',
                            'id': '1226617474714',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Lifestyle - syndicated/Health/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Lifestyle%20-%20syndicated/Health/',
                            'id': '1228018445514',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/Health/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/Health/',
                            'id': '1226617474715',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Lifestyle - syndicated/Health/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Lifestyle%20-%20syndicated/Health/',
                            'id': '1228018445546',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/Health/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/Health/',
                            'id': '1226592256005',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/Health/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/Health/',
                            'id': '1226617474713',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Lifestyle - syndicated/Health/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Lifestyle%20-%20syndicated/Health/',
                            'id': '1228018445540',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/Health and Fitness/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/Health%20and%20Fitness/',
                            'id': '1226427015271',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/Health/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/Health/',
                            'id': '1226646564144',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Lifestyle - syndicated/Health/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Lifestyle%20-%20syndicated/Health/',
                            'id': '1228018445537',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Lifestyle - syndicated/Health/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Lifestyle%20-%20syndicated/Health/',
                            'id': '1228018445543',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Lifestyle - syndicated/Health/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Lifestyle%20-%20syndicated/Health/',
                            'id': '1228018445545',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'asbestos exposure',
                        'asbestos fibre',
                        'kindergarten site',
                        'asbestos-related illness',
                        'asbestos fibres',
                        'Asbestos clean-up',
                        'cause cancer',
                        'sugar cane',
                        'aggressive illness',
                        'death sentence',
                        'roof sheeting',
                        'pulled muscle',
                        'asbestos cancers',
                        'aware asbestos exposure',
                        'asbestos materials',
                        'ASBESTOS TIPS',
                        'asbestos safety equipment',
                        'accredited testing lab',
                        'asbestos products',
                        'lung cancer',
                        'ceiling tiles',
                        'steam pipes',
                        'executive partner',
                        'home renovations',
                        'latency period',
                        'radiation therapy',
                        'Pulled shoulder muscle',
                        'survival rates',
                        'tribute page',
                        'safety standards',
                        'mesothelioma dead',
                        'Show caution',
                        'people die',
                        'workplace infrastructure',
                        'classic cars',
                        'unfortunate things',
                        'integral part',
                        'Australian employees',
                        'Melbourne',
                        'Victoria',
                        'Australia',
                        'Australia and New Zealand',
                        'Oceania',
                        'China',
                        'Eastern Asia',
                        'Asia',
                        'Cairns',
                        'Queensland',
                        'eBay Inc.',
                        'Asbestos Safety and Eradication Agency',
                        'John',
                        'Ben Harrison',
                        'Pauline Vizzard',
                        'Emma Reynolds',
                        'David Jones',
                        'Chris Eastman'
                    ],
                    'authors': [
                        'Emma Reynolds'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'weeklytimesnow.com.au',
                        'couriermail.com.au',
                        'goldcoastbulletin.com.au',
                        'adelaidenow.com.au',
                        'heraldsun.com.au',
                        'themercury.com.au',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'news.com.au',
                        'perthnow.com.au',
                        'townsvillebulletin.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '278893b5cbbb6b66abcb8565efa7a3f9',
                                'link': 'http://cdn.newsapi.com.au/content/v2/278893b5cbbb6b66abcb8565efa7a3f9'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-4c1023f01e8043f23f0ed343210efaea',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '15a2e129d43e2508f2f40c5e1d53b888',
                                'link': 'http://cdn.newsapi.com.au/content/v2/15a2e129d43e2508f2f40c5e1d53b888'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-ba1ea8adc080b3ac379e77674d55b136',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'eba9a4df41ef8862f77a91ea868dd29a',
                                'link': 'http://cdn.newsapi.com.au/content/v2/eba9a4df41ef8862f77a91ea868dd29a'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-baf9fb32ad12a10f29f6b8bd198779e6',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '173936860ce97584d7345d876041944b',
                                'link': 'http://cdn.newsapi.com.au/content/v2/173936860ce97584d7345d876041944b'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-6e04f7066e18eb9b0b17818deb897194',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '516cfd2b87e0ddc07522f5baafd128a0',
                                'link': 'http://cdn.newsapi.com.au/content/v2/516cfd2b87e0ddc07522f5baafd128a0'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-731053744abd86b555604c56fbaf84ab',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'b0c32c88d5c5f3d308bd9221cb2e3c1d',
                                'link': 'http://cdn.newsapi.com.au/content/v2/b0c32c88d5c5f3d308bd9221cb2e3c1d'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-a24a2ba1be537be6829a4c1e417fba04',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'bc9896ef8774f317a6d605fdabef4d19',
                                'link': 'http://cdn.newsapi.com.au/content/v2/bc9896ef8774f317a6d605fdabef4d19'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-9c7069b538293d79b012f9ce81516bbb',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '27ffd2ae8be50da68947bfb2fbc18d37',
                                'link': 'http://cdn.newsapi.com.au/content/v2/27ffd2ae8be50da68947bfb2fbc18d37'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-3cd8697da5104534177751356e9ad3af',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '5fcfa6624775d772736592c6ccd7083e',
                                'link': 'http://cdn.newsapi.com.au/content/v2/5fcfa6624775d772736592c6ccd7083e'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-d61a0e979ef03e6126efd02d54c9f05a',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '525c72148bc1afd1088e6f12edc68862',
                                'link': 'http://cdn.newsapi.com.au/content/v2/525c72148bc1afd1088e6f12edc68862'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': -16.916667,
                            'longitude': 145.766667
                        }
                    ],
                    'socialTitle': 'GP died in months after pain in shoulder',
                    'seoHeadline': 'Asbestos cancer: NSW GP with mesothelioma dead in months',
                    'userOriginUpdated': 'holmesj1',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'sore-shoulder-was-in-reality-aggressive-cancer-that-gp-picked-up-at-hospital-where-she-worked',
                    'revision': 7,
                    'body': 'To her shock, the 63-year-old discovered she had developed an aggressive cancer in her ribcage from asbestos exposure at a hospital in the NSW Hunter Region. She would be dead within months.\n\nPauline Vizzard’s family, friends and patients were devastated to learn the energetic doctor was riddled with disease in the lining of her organs. They had never thought for a second that she was at risk from this quiet killer in her line of work.\n\n“It was a surprise on everyone’s behalf,” son Ben Harrison, 34, told news.com.au. “You sort of associate asbestos cancers with people who may work in industry for all their life, and to have someone who is so removed from what you’d normally expect to be a high-risk industry ... there’s no cure for mesothelioma at all, it’s fatal 100 per cent of the time.\n\n“You hear about survival rates for cancer improving year after year, but with mesothelioma, it’s a death sentence straight off the bat. There’s no hope for a cure, no hope of getting better and that’s quite a terrible diagnosis. The treatment was purely to prolong life, to get a few more months.”\n\nDr Vizzard had contracted the cancer at a public hospital where she regularly conducted ward rounds in the ’70s and ’80s. Dust and particles from deteriorated lagging around hot water and steam pipes accumulated on top of ceiling tiles and slid into the hallway when the tile was tipped up during frequent maintenance.\n\nInhaling an asbestos fibre can cause thickening of the pleura (membrane around the lung), the appearance of plaque in lung tissue and excess fluids in the pleural space. This can lead to laryngeal, colon, ovarian and lung cancers.\n\nWhile many believe asbestos-related illness is dying out, it is in fact a growing risk to Australian employees thanks to ageing workplace infrastructure. The Asbestos Safety and Eradication Agency’s 2016-17 report recorded an increase in occupational exposure to 70 per cent from 64 per cent the previous year. \n\nDespite a 2003 nationwide ban on the production, importation and use of asbestos, Australia continues to grapple with the legacy of being one of the world’s highest users per capita of asbestos materials from the mid-40s to late ’80s. \n\nTo add to the tragedy, at the time of her diagnosis, Dr Vizzard was sole carer for husband John, who had late-stage Parkinson’s and dementia. “Mum was always quite upbeat about things. She did her best,” said Mr Harrison, from the NSW Central Coast. “She was still trying to be everyone’s mum.\n\n“She had to undergo chemo and other forms of radiation therapy to try to prolong her life and give her a few more months and that had a huge negative effect, and then in the last month or two, she went into a rapid decline.”\n\nDr Vizzard died in April 2015, and her husband followed not long after. One patient wrote on a tribute page: “I’m finding it extremely hard to believe this every morning when I wake. Pauline was my doctor close to 30 years. I will miss her dreadfully.”\n\nAnother said: “Not only a great doctor and an integral part of the Singleton community but an aunty who I have always loved and admired. Sadly missed but so fortunate to have known her.”\n\nMr Harrison says he’s not angry with anyone over what happened to his mother, but wants people to be aware asbestos exposure can still be a risk in what we may consider unlikely settings. “It’s one of those unfortunate things that this material that we now know is so deadly managed to find its way to the most innocent of places, even hospitals,” he said. \n\nAsbestos has this year been discovered in classic cars, on a Melbourne kindergarten site where children were playing and in homes damaged by storms. Experts have warned the rise of DIY home renovations fuelled by reality TV could lead to a “third wave” of asbestos-related diseases in Australia.\n\nAround 600 people die of asbestos-related illness around the country each year.\n\nDavid Jones, Hunter Region executive partner from Carroll & O’Dea Lawyers, which managed Dr Vizzard’s case, said: “As the case demonstrates, mesothelioma has a long latency period after exposure, meaning that workers exposed to asbestos a generation ago might still contract the disease.\n\n“Asbestos in situ can still be found in many older public buildings and homes, and as the fabric of these infrastructures containing asbestos products deteriorates, the dangers of exposure to asbestos fibres is on the increase. Many are part of the ageing public infrastructure.”\n\nASBESTOS TIPS \n\n• Show caution when removing asbestos in the home. If in doubt, have a licensed removalist assess, safely remove and properly dispose of it for you.\n\n• Some toys and crayons from overseas, particularly from China, have been found to contain asbestos. Avoid crushing, scraping or melting them, as this can release asbestos fibres.\n\n• Be careful when buying online — buying a cheap toy on eBay from China may not be worth the risk.\n\n• Buy from reputable brands and businesses that demand high safety standards from suppliers.\n\n• If you have any concerns about your workplace, talk to your employer.\n\n• To find your nearest accredited testing lab, call 1800 621 666. If you think you may have been exposed to asbestos, register your details on the National Asbestos Exposure Register.\n\nemma.reynolds@news.com.au | @emmareyn \n\n',
                    'standFirst': 'A MUM and doctor thought she had just pulled a muscle. But it was a deadly illness that few people expect in 2017, from the most unlikely place.\n\n',
                    'kicker': 'Shock diagnosis',
                    'byline': 'Emma Reynolds',
                    'commentsAllowed': true,
                    'commentsTotal': 0,
                    'commentsShown': true,
                    'authorProfileIds': [
                        'f927af19cabb9d72384796ba74be9d13'
                    ],
                    'bylineNames': [
                        'Emma Reynolds'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': '391333d502a6eda68c2c5faaaeda10a6',
                        'link': 'http://cdn.newsapi.com.au/content/v2/391333d502a6eda68c2c5faaaeda10a6'
                    },
                    'originId': 'e5ea4a1a-d7af-11e7-b5a9-0fbc45dc1ac5',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Twins could hold key to sexuality',
                    'subtitle': 'How lesbian twin and straight sister could unlock secrets to sexuality',
                    'description': 'A LESBIAN twin and her straight sister have been studied by scientists who are searching for answers about human sexuality.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/391333d502a6eda68c2c5faaaeda10a6?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'The Sun',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': 'e5ea4a1a-d7af-11e7-b5a9-0fbc45dc1ac5',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T05:22:23.000Z',
                    'dateLive': '2017-12-02T23:03:00.000Z',
                    'customDate': '2017-12-03T05:21:00.000Z',
                    'dateCreated': '2017-12-02T22:26:53.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '737eb5de82955d1866e9f1911568ab3f',
                            'link': 'http://cdn.newsapi.com.au/image/v1/737eb5de82955d1866e9f1911568ab3f'
                        },
                        'originId': 'crop-aa9dadb759a1411269d0c5266e5fb409',
                        'origin': 'METHODE',
                        'title': 'Rosie, left, and Sarah Nunn sere studied by scientists investigateing their sexuality.',
                        'subtitle': '31290076-d7af-11e7-b5a9-0fbc45dc1ac5',
                        'description': 'Rosie, left, and Sarah Nunn sere studied by scientists investigateing their sexuality.',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/737eb5de82955d1866e9f1911568ab3f',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'Facebook',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T05:21:42.000Z',
                        'dateLive': '2017-12-02T23:03:00.000Z',
                        'dateCreated': '2017-12-02T22:21:50.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'categories': [],
                        'keywords': [
                            'Sarah Nunn'
                        ],
                        'authors': [],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'coyb',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '31290076d7af11e7b5a90fbc45dc1ac5',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'SARAHNUNNFACEBOOK.jpg',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '31290076-d7af-11e7-b5a9-0fbc45dc1ac5',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/391333d502a6eda68c2c5faaaeda10a6?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/lifestyle/relationships/how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality/news-story/391333d502a6eda68c2c5faaaeda10a6'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/lifestyle/how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality/news-story/391333d502a6eda68c2c5faaaeda10a6'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/lifestyle/relationships/how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality/news-story/391333d502a6eda68c2c5faaaeda10a6'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/lifestyle/relationships/how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality/news-story/391333d502a6eda68c2c5faaaeda10a6'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/lifestyle/how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality/news-story/391333d502a6eda68c2c5faaaeda10a6'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/lifestyle/how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality/news-story/391333d502a6eda68c2c5faaaeda10a6'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/lifestyle/how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality/news-story/391333d502a6eda68c2c5faaaeda10a6'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/lifestyle/relationships/sex/how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality/news-story/391333d502a6eda68c2c5faaaeda10a6'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/lifestyle/relationships/how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality/news-story/391333d502a6eda68c2c5faaaeda10a6'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/lifestyle/how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality/news-story/391333d502a6eda68c2c5faaaeda10a6'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/lifestyle/relationships/how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality/news-story/391333d502a6eda68c2c5faaaeda10a6'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/lifestyle/how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality/news-story/391333d502a6eda68c2c5faaaeda10a6'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Relationships/Sex/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Relationships/Sex/',
                        'id': '1226521278839',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Relationships/Sex/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Relationships/Sex/',
                            'id': '1226521278839',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226521278839/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226521278839/',
                            'id': '1226521278839',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Relationships/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Relationships/',
                            'id': '1226521216876',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226521216876/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226521216876/',
                            'id': '1226521216876',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673762905',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226673762905/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226673762905/',
                            'id': '1226673762905',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Lifestyle%20-%20syndicated/',
                            'id': '1226521171876',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226521171876/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226521171876/',
                            'id': '1226521171876',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Debbie Schipp/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Debbie%20Schipp/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/science and technology/science (general)/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/science%20and%20technology/science%20(general)/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/social issue/minority group/gays and lesbians/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/social%20issue/minority%20group/gays%20and%20lesbians/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/13009000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/13009000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/14010001/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/14010001/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/identical twins/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/identical%20twins/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/lesbian twin/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/lesbian%20twin/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/straight sister/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/straight%20sister/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/human sexuality/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/human%20sexuality/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Gay twin/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Gay%20twin/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/tomboy tendencies/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/tomboy%20tendencies/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/differences pre-puberty/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/differences%20pre-puberty/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/psychology academic/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/psychology%20academic/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/boy things/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/boy%20things/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/behaviour patterns/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/behaviour%20patterns/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/boy crazy/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/boy%20crazy/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/gender-atypical mannerisms/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/gender-atypical%20mannerisms/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/female characters/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/female%20characters/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/valuable insights/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/valuable%20insights/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/female behaviour/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/female%20behaviour/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/video games/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/video%20games/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/University of Essex/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/University%20of%20Essex/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Facebook, Inc./otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Facebook,%20Inc./otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/The Times/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/The%20Times/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Charlie Parker/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Charlie%20Parker/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Sarah Nunn/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Sarah%20Nunn/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Gerulf Rieger/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Gerulf%20Rieger/otca/'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/Relationships/Sex/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/Relationships/Sex/',
                            'id': '1226646569852',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/Relationships/Sex/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/Relationships/Sex/',
                            'id': '1226617487327',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/Relationships/Sex/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/Relationships/Sex/',
                            'id': '1226617487326',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/Relationships/Sex/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/Relationships/Sex/',
                            'id': '1226600840734',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/Relationships/Sex/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/Relationships/Sex/',
                            'id': '1226617487321',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/Relationships/Sex/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/Relationships/Sex/',
                            'id': '1226423712279',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/Relationships/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/Relationships/',
                            'id': '1226646568782',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/Relationships/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/Relationships/',
                            'id': '1226617486063',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/Relationships/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/Relationships/',
                            'id': '1226617486061',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/Relationships/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/Relationships/',
                            'id': '1226592256158',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/Relationships/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/Relationships/',
                            'id': '1226617486062',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/Relationships/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/Relationships/',
                            'id': '1226423703062',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769552',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769553',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769550',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769549',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/Real%20Life/',
                            'id': '1226673769551',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/Real Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/Real%20Life/',
                            'id': '1226673807425',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462446',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956177',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462445',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956189',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226592254293',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226617462444',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956176',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Lifestyle/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Lifestyle/',
                            'id': '1226423680314',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1226646528365',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956178',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956180',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Lifestyle - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Lifestyle%20-%20syndicated/',
                            'id': '1227986956179',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'identical twins',
                        'lesbian twin',
                        'straight sister',
                        'human sexuality',
                        'Gay twin',
                        'tomboy tendencies',
                        'differences pre-puberty',
                        'psychology academic',
                        'boy things',
                        'behaviour patterns',
                        'boy crazy',
                        'gender-atypical mannerisms',
                        'female characters',
                        'valuable insights',
                        'female behaviour',
                        'video games',
                        'University of Essex',
                        'Facebook, Inc.',
                        'The Times',
                        'Charlie Parker',
                        'Sarah Nunn',
                        'Gerulf Rieger'
                    ],
                    'authors': [
                        'Debbie Schipp'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '737eb5de82955d1866e9f1911568ab3f',
                                'link': 'http://cdn.newsapi.com.au/content/v2/737eb5de82955d1866e9f1911568ab3f'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-aa9dadb759a1411269d0c5266e5fb409',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '1e4ce6e69b02b0c03a1725114b4ef8d7',
                                'link': 'http://cdn.newsapi.com.au/content/v2/1e4ce6e69b02b0c03a1725114b4ef8d7'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-fbcc5a9ed685e72429e99acf1c89593a',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '9a08b5f38ea6e17309dd5fbd0e24b2c7',
                                'link': 'http://cdn.newsapi.com.au/content/v2/9a08b5f38ea6e17309dd5fbd0e24b2c7'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-7f782a7f29b58a3a0ab21f4344ecd7ad',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'fe596e0690920a169eb808b7b4adb863',
                                'link': 'http://cdn.newsapi.com.au/content/v2/fe596e0690920a169eb808b7b4adb863'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-ceca2240031b928f1b20a8aa37c31aa0',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '76b6a40aab69dd0b13b0e87c48cf404a',
                                'link': 'http://cdn.newsapi.com.au/content/v2/76b6a40aab69dd0b13b0e87c48cf404a'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-5501eaaa6459e20518c7c921d58bbcdb',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'd243240467556ac24f8222f26d52f590',
                                'link': 'http://cdn.newsapi.com.au/content/v2/d243240467556ac24f8222f26d52f590'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-7c3a44c4b47f8b7d64e65b797f436522',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'ad7308832fe2ee7065a079403997c7c0',
                                'link': 'http://cdn.newsapi.com.au/content/v2/ad7308832fe2ee7065a079403997c7c0'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-3b2ed5301ba7e87b545405a3636fe336',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '1907aeac1548f6538a971a770573bc87',
                                'link': 'http://cdn.newsapi.com.au/content/v2/1907aeac1548f6538a971a770573bc87'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-d967a7109e21967ab571cfd72da72a74',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'f46c447a00cdc84f86cecd1472d8bf31',
                                'link': 'http://cdn.newsapi.com.au/content/v2/f46c447a00cdc84f86cecd1472d8bf31'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [],
                    'seoHeadline': 'Lesbian twin and identical straight sister could reveal secret to human sexuality',
                    'userOriginUpdated': 'coyb',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'how-lesbian-twin-and-straight-sister-could-unlock-secrets-to-sexuality',
                    'revision': 2,
                    'body': 'Researchers hoping to identify genetic and environmental factors associated with sexuality hit the jackpot when they discovered identical twins Sarah Nunn, who is attracted to men, and Rosie Albewhite, who is attracted to women.\n\nThe 29-year-old sisters were investigated by scientists as part of a study aiming to learn more about how sexuality develops in childhood.\n\nThe sisters were among 55 other sets of twins studied by researchers at the University of Essex.\n\nTOMBOY TENDENCIES\nSarah recalled Rosie’s tomboy tendencies as they were growing up, telling The Times her boyfriends “instantly felt more at home” with her sister.\n\n“She liked football, talked about boy things, played video games,” she said.\n\n“They’d be like, ‘Sarah, you’re really boring. I’m going to go and play with Rosie.’”\n\n“I’d get jealous that they liked her better.”\n\nBut Sarah was quick to understand that her twin wasn’t interested in boys romantically.\n\n“When they tried to get romantic with Rosie she’d say, ‘That’s not me’. Then they came back,” she explained.\n\nThe new research will build on previous scientific studies that searched for signs of how sexuality, such as gender-atypical mannerisms of behaviour, manifests before puberty.\n\nAcademics have struggled to produce concrete results in the past due to difficulties determining whether reported behaviour patterns were remembered accurately.\n\nBut the new research using dozens of twins and photographs from their childhoods could shed light on the subject.\n\nCONTROVERSIAL STUDY \n\nUniversity of Essex psychology academic Gerulf Rieger and his colleague Tuesday Watts asked Sarah, Rosie and other twins with “discordant sexual orientations” to send them childhood snaps so they could been shown to strangers who were unaware of the purpose of the experiment.\n\nThe strangers were then asked to try and spot the signs of the twins’ behaviour, clothing and play diverged and pinpoint how and when it happened.\n\nThe study is somewhat controversial, as suggesting firm links exist between sexuality and gender could be seen as reinforcing stereotypes about male and female behaviour, which some say is harmful.\n\nBARBIE AND SUPERMAN \n\nBut pictures provided by the twins make this issue difficult to avoid and show Sarah styling herself as female characters like Barbie, while Rosie suited up as Superman.\n\nAs the years passed, Rosie said she remembered wondering why she was less interested in boys than her sister.\n\n“I questioned it for so long,” she said. “Sarah was really boy crazy.”\n\nRosie even rejected her own boyfriend’s advances at one point, realising she did not want to kiss him.\n\nBut Sarah stepped in and said: “I’m the same ... I will kiss you”.\n\nDr Rieger said the research into differences pre-puberty unlocked valuable insights about sexual identity.\n\nHe believes the most likely explanation for the divergence in behaviour is something that happens before birth.\n\n“Paternal hormones are the number one candidate,” he said.\n\n“Our theory is that even though twins are identical what happens in the womb is quite different.\n\n“They can have different nutrition, different levels of hormones.”\n\nThis article first appeared in The Sun and is republished with permission \n\nSame-sex marriage has passed through the Senate \n\n',
                    'standFirst': 'THESE identical twins — one straight and the other one gay — could unlock the secrets about human sexuality.\n\n',
                    'byline': 'Charlie Parker',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [],
                    'bylineNames': [
                        'Charlie Parker'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': 'f7706c5fed3c1ff5c0801bd9938b7593',
                        'link': 'http://cdn.newsapi.com.au/content/v2/f7706c5fed3c1ff5c0801bd9938b7593'
                    },
                    'originId': 'fb56b954-d7fc-11e7-a38d-10a36ef4cb34',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Trump’s bizarre campaign trail diet',
                    'subtitle': 'Ex-aides reveal the wild secrets behind Trump’s presidential campaign',
                    'description': 'LIFE aboard the Trump campaign plane was an unforgettable and bizarre experience, featuring scenes like press secretary Hope Hicks steaming the candidate’s pants while he was wearing them, a new book says.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/f7706c5fed3c1ff5c0801bd9938b7593?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'NY Post',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': 'fb56b954-d7fc-11e7-a38d-10a36ef4cb34',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T18:55:05.000Z',
                    'dateLive': '2017-12-03T08:20:00.000Z',
                    'customDate': '2017-12-03T18:55:00.000Z',
                    'dateCreated': '2017-12-03T07:38:40.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': 'b73d96e5b7b4e630de1c630416234018',
                            'link': 'http://cdn.newsapi.com.au/image/v1/b73d96e5b7b4e630de1c630416234018'
                        },
                        'originId': 'crop-a3a58ba7ee09c46658a9470ae407cd4e',
                        'origin': 'METHODE',
                        'title': "(FILES): This December 21, 2016 file photo shows US President-elect Donald Trump (L) with with Trump National Security Adviser designate Lt. General Michael Flynn (R) at Mar-a-Lago in Palm Beach, Florida. Michael Flynn, Donald Trump's former national security advisor, has been charged with lying to investigators over his Russian contacts, becoming the seniormost official indicted in the probe into possible collusion between the Trump campaign and Moscow. Flynn was charged November 30, 2017 with one count of lying about his private discussions with Sergey Kislyak, the Russian ambassador, regarding US sanctions being imposed on Moscow by the government of then president Barack Obama, a court document showed.  / AFP PHOTO / JIM WATSON / XGTY",
                        'subtitle': '6e9ce02c-d7fe-11e7-a38d-10a36ef4cb34',
                        'description': "(FILES): This December 21, 2016 file photo shows US President-elect Donald Trump (L) with with Trump National Security Adviser designate Lt. General Michael Flynn (R) at Mar-a-Lago in Palm Beach, Florida. Michael Flynn, Donald Trump's former national security advisor, has been charged with lying to investigators over his Russian contacts, becoming the seniormost official indicted in the probe into possible collusion between the Trump campaign and Moscow. Flynn was charged November 30, 2017 with one count of lying about his private discussions with Sergey Kislyak, the Russian ambassador, regarding US sanctions being imposed on Moscow by the government of then president Barack Obama, a court document showed.  / AFP PHOTO / JIM WATSON / XGTY",
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/b73d96e5b7b4e630de1c630416234018',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'AFP',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T09:37:18.000Z',
                        'dateLive': '2017-12-03T08:20:00.000Z',
                        'dateCreated': '2017-12-03T07:49:03.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'primaryCategory': {
                            'value': '/author/newscorpaustralia.com/JIM WATSON/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/JIM%20WATSON/'
                        },
                        'categories': [
                            {
                                'value': '/author/newscorpaustralia.com/JIM WATSON/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/JIM%20WATSON/'
                            },
                            {
                                'value': '/location/iptc.org/United States/Florida/Palm Beach/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/location/iptc.org/United%20States/Florida/Palm%20Beach/',
                                'selected': 'auto'
                            },
                            {
                                'value': '/countrycode/iptc.org/USA/Florida/Palm Beach/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/countrycode/iptc.org/USA/Florida/Palm%20Beach/',
                                'selected': 'auto'
                            }
                        ],
                        'keywords': [
                            'lying',
                            'national security advisor',
                            'Security Adviser',
                            'court document',
                            'seniormost official',
                            'former national security',
                            'private discussions',
                            'Russian contacts',
                            'possible collusion',
                            'Russian ambassador',
                            'then president',
                            'file photo shows',
                            'security',
                            'trump',
                            'file',
                            'government',
                            'photo',
                            'president-elect',
                            'Michael Flynn',
                            'Donald Trump',
                            'Sergey Kislyak',
                            'Barack Obama'
                        ],
                        'authors': [
                            'JIM WATSON'
                        ],
                        'domains': [
                            'newscorpaustralia.com',
                            'weeklytimesnow.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'adelaidenow.com.au',
                            'heraldsun.com.au',
                            'ntnews.com.au',
                            'cairnspost.com.au',
                            'news.com.au',
                            'perthnow.com.au',
                            'townsvillebulletin.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'clenchs',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '6e9ce02cd7fe11e7a38d10a36ef4cb34',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': '(FILES): This December 21, 2016 file photo shows U',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '6e9ce02c-d7fe-11e7-a38d-10a36ef4cb34',
                        'enterpriseAssetId': 'NEWSMMGLPICT000168930669',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'weeklytimesnow.com.au',
                            'link': 'http://www.weeklytimesnow.com.au/news/world/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        },
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/f7706c5fed3c1ff5c0801bd9938b7593?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/news/world/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/news/world/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/news/world/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/news/world/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/news/world/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/news/world/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/news/world/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/world/north-america/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/news/world/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/news/world/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/news/world/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/news/world/exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign/news-story/f7706c5fed3c1ff5c0801bd9938b7593'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/World/news.com.auNORTHAMERICA/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/World/news.com.auNORTHAMERICA/',
                        'id': '1226564883547',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/World/news.com.auNORTHAMERICA/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/World/news.com.auNORTHAMERICA/',
                            'id': '1226564883547',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226564883547/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226564883547/',
                            'id': '1226564883547',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/World/',
                            'id': '1226490532755',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226490532755/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226490532755/',
                            'id': '1226490532755',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/',
                            'id': '1226487036675',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226487036675/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226487036675/',
                            'id': '1226487036675',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Apple News/NewsComAu/Home/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Apple%20News/NewsComAu/Home/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227528026986/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227528026986/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Bronte Coy/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Bronte%20Coy/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/arts, culture and entertainment/television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/arts,%20culture%20and%20entertainment/television/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/arts, culture and entertainment/literature/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/arts,%20culture%20and%20entertainment/literature/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/arts, culture and entertainment/music/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/arts,%20culture%20and%20entertainment/music/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/01016000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/01016000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/01010000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/01010000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/01011000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/01011000/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/presidential campaign/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/presidential%20campaign/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/campaign plane/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/campaign%20plane/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/bizarre experience/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/bizarre%20experience/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/campaign boss/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/campaign%20boss/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/campaign staffer/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/campaign%20staffer/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/press secretary/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/press%20secretary/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/communications director/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/communications%20director/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/king word/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/king%20word/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/food groups/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/food%20groups/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Ex-aides reveal/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Ex-aides%20reveal/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/fast-food restaurants/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/fast-food%20restaurants/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/chocolate malted/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/chocolate%20malted/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/The Washington Post Company/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/The%20Washington%20Post%20Company/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Kentucky Fried Chicken Inc./otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Kentucky%20Fried%20Chicken%20Inc./otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Elton John/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Elton%20John/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Hope Hicks/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Hope%20Hicks/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Donald Trump/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Donald%20Trump/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Corey Lewandowski/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Corey%20Lewandowski/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/David Bossie/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/David%20Bossie/otca/'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/news.com.au/World News/north america/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/World%20News/north%20america/',
                            'id': '1226569889477',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Network%20News/World/',
                            'id': '1226628352350',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Network%20News/World/',
                            'id': '1226692643468',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Network%20News/World/',
                            'id': '1226696922805',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Network%20News/World/',
                            'id': '1226603199045',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Network%20News/World/',
                            'id': '1226696922808',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/weeklytimesnow.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/weeklytimesnow.com.au/Network%20News/World/',
                            'id': '1226696922806',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/World News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/World%20News/',
                            'id': '1226346011383',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Network%20News/World/',
                            'id': '1226646735401',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Network%20News/World/',
                            'id': '1226696922804',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Network%20News/World/',
                            'id': '1226696922807',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Network%20News/World/',
                            'id': '1226618422491',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Network%20News/World/',
                            'id': '1226618422489',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Network%20News/World/',
                            'id': '1226683748662',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Network%20News/',
                            'id': '1111112000022',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Network%20News/',
                            'id': '1226692466903',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Network%20News/',
                            'id': '1111112026929',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Network%20News/',
                            'id': '1226696899975',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Network%20News/',
                            'id': '1111112043252',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Network%20News/',
                            'id': '1111112081508',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Network%20News/',
                            'id': '1226696899976',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/weeklytimesnow.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/weeklytimesnow.com.au/Network%20News/',
                            'id': '1226696899972',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Network%20News/',
                            'id': '1111112018754',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Network%20News/',
                            'id': '1226683746263',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Network%20News/',
                            'id': '1226696899973',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Network%20News/',
                            'id': '1226696899974',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'presidential campaign',
                        'campaign plane',
                        'bizarre experience',
                        'campaign boss',
                        'campaign staffer',
                        'press secretary',
                        'communications director',
                        'king word',
                        'food groups',
                        'Ex-aides reveal',
                        'fast-food restaurants',
                        'chocolate malted',
                        'The Washington Post Company',
                        'Kentucky Fried Chicken Inc.',
                        'Elton John',
                        'Hope Hicks',
                        'Donald Trump',
                        'Corey Lewandowski',
                        'David Bossie'
                    ],
                    'authors': [
                        'Bronte Coy'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'weeklytimesnow.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'adelaidenow.com.au',
                        'heraldsun.com.au',
                        'ntnews.com.au',
                        'cairnspost.com.au',
                        'news.com.au',
                        'perthnow.com.au',
                        'townsvillebulletin.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': 'b73d96e5b7b4e630de1c630416234018',
                                'link': 'http://cdn.newsapi.com.au/content/v2/b73d96e5b7b4e630de1c630416234018'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-a3a58ba7ee09c46658a9470ae407cd4e',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'b8fe3531c99e287d2f3a44670622a5db',
                                'link': 'http://cdn.newsapi.com.au/content/v2/b8fe3531c99e287d2f3a44670622a5db'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-019a179d31debdd1213b9801e6d961c5',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'f2ed3ccc6442a8fb7820256585d59111',
                                'link': 'http://cdn.newsapi.com.au/content/v2/f2ed3ccc6442a8fb7820256585d59111'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-a06a1aaba61e108e23ddc70fda81fe85',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'c2f77e1994badedf44a907c22abfea57',
                                'link': 'http://cdn.newsapi.com.au/content/v2/c2f77e1994badedf44a907c22abfea57'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-43e017b6f3a3cf10a798d313b754b903',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '94848402230ca981455b583f7367a2bf',
                                'link': 'http://cdn.newsapi.com.au/content/v2/94848402230ca981455b583f7367a2bf'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-0c83a1ddcebc932602400bfa99b244b3',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '5007e140acf3a8a831c4f756a8f85770',
                                'link': 'http://cdn.newsapi.com.au/content/v2/5007e140acf3a8a831c4f756a8f85770'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-5befb9329884b412557bd26def52a9e6',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '0eea4f260e6ffa486830e821700a7932',
                                'link': 'http://cdn.newsapi.com.au/content/v2/0eea4f260e6ffa486830e821700a7932'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-5d1d592cc8544e4c62dcfd13a8e870ac',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '7266af716321da223424c81044b42aaf',
                                'link': 'http://cdn.newsapi.com.au/content/v2/7266af716321da223424c81044b42aaf'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [],
                    'socialTitle': 'Wild secrets behind Trump’s presidential campaign',
                    'seoHeadline': 'Donald Trump: Ex-aides reveal wild secrets behind presidential campaign',
                    'userOriginUpdated': 'clenchs',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'exaides-reveal-the-wild-secrets-behind-trumps-presidential-campaign',
                    'revision': 3,
                    'body': 'The Washington Post reports that new book Let Trump Be Trump, by former aides Corey Lewandowski and David Bossie, said Trump would “rip off the faces’’ of his targets with “expletive-filled tirades.’’\n\nThe authors said they “both had moments when they wanted to parachute off Trump Force One,’’ according to the Post. \n\nTrump liked music — very loud music. People “couldn’t hear themselves think’’ as Elton John blared from speakers.\n\nTrump also loved McDonalds, with one dinner featuring “two Big Macs, two Filet-O-Fish, and a chocolate malted.”\n\nLewandowski said a campaign staffer named Sam Nunberg was punished by being left behind at one of the fast-food restaurants. His offence: ordering a burger that was taking too long to prepare.\n\n“Leave him,’’ Trump ordered. And they did.\n\nTrump didn’t require a trained chef. “On Trump Force One there were four major food groups: McDonald’s, Kentucky Fried Chicken, pizza and diet coke,’’ according to the book.\n\nOne of the jobs assigned to Hicks, who is now Trump’s communications director, was to make certain his suits were pressed.\n\n“‘Get the machine!’ ” Trump would yell, according to the book.\n\n“And Hope would take out the steamer and start steaming Mr. Trump’s suit, while he was wearing it. She’d steam the jacket first and then sit in a chair in front of him and steam his pants.”\n\nThe authors recount an incident where Trump was in a helicopter when he learned that former campaign boss Paul Manafort said Trump “shouldn’t be on television anymore,” and that Manafort should replace him on TV.\n\nTrump was angrier than Lew­andowski had ever seen him, the book says. He ordered the pilot to fly at a lower altitude so he could make a call.\n\n“I’ll go on TV anytime I goddamn f**king want to and you won’t say another f**king word about me. Tone it down? I wanna turn it up,’’ he thundered. “You’re a political pro? Let me tell you something. I’m a pro at life. I’ve been around a time or two. I know guys like you, with your hair and skin …”\n\nLewandowski said it was “one of the greatest take-downs in the history of the world.’’\n\nThis story originally appeared in the NY Post and is republished here with permission. \n\n',
                    'standFirst': 'LIFE aboard the Trump campaign plane was an unforgettable and bizarre experience, and former aides are now lifting the lid on what was really going on behind the scenes.\n\n',
                    'kicker': 'Inside story',
                    'byline': 'Michael Hechtman',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [],
                    'bylineNames': [
                        'Michael Hechtman'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': 'f83ef09c80a4a035228e6ce16fad0e39',
                        'link': 'http://cdn.newsapi.com.au/content/v2/f83ef09c80a4a035228e6ce16fad0e39'
                    },
                    'originId': '4d542914-d7a1-11e7-b5a9-0fbc45dc1ac5',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'UFC monster’s devastatingly scary KO',
                    'subtitle': 'Francis Ngannou stars while Max Holloway dominates Jose Aldo at UFC 218',
                    'description': 'Live: UFC 218\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/f83ef09c80a4a035228e6ce16fad0e39?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'news.com.au',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': '4d542914-d7a1-11e7-b5a9-0fbc45dc1ac5',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T07:48:04.000Z',
                    'dateLive': '2017-12-02T22:11:00.000Z',
                    'customDate': '2017-12-03T07:48:00.000Z',
                    'dateCreated': '2017-12-02T20:42:24.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '7b5689df71420a736285a74a967db903',
                            'link': 'http://cdn.newsapi.com.au/image/v1/7b5689df71420a736285a74a967db903'
                        },
                        'originId': 'crop-757ea6cc5ac1446dfefe77b146a20b60',
                        'origin': 'METHODE',
                        'title': 'Francis Ngannou is a UFC beast.',
                        'subtitle': 'b8fd01bc-d7e8-11e7-a38d-10a36ef4cb34',
                        'description': 'Francis Ngannou is a UFC beast.',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/7b5689df71420a736285a74a967db903',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'Getty Images',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T06:05:18.000Z',
                        'dateLive': '2017-12-02T22:11:00.000Z',
                        'dateCreated': '2017-12-03T05:13:39.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'primaryCategory': {
                            'value': '/author/newscorpaustralia.com/Gregory Shamus/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Gregory%20Shamus/'
                        },
                        'categories': [
                            {
                                'value': '/author/newscorpaustralia.com/Gregory Shamus/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Gregory%20Shamus/'
                            }
                        ],
                        'keywords': [],
                        'authors': [
                            'Gregory Shamus'
                        ],
                        'domains': [
                            'newscorpaustralia.com',
                            'news.com.au',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'mattheyj',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': 'b8fd01bcd7e811e7a38d10a36ef4cb34',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'Ngannou 4.jpg',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': 'b8fd01bc-d7e8-11e7-a38d-10a36ef4cb34',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/f83ef09c80a4a035228e6ce16fad0e39?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/sport/live-ufc-218-in-detroit-usa/news-story/f83ef09c80a4a035228e6ce16fad0e39'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/sport/live-ufc-218-in-detroit-usa/news-story/f83ef09c80a4a035228e6ce16fad0e39'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/sport/live-ufc-218-in-detroit-usa/news-story/f83ef09c80a4a035228e6ce16fad0e39'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/sport/live-ufc-218-in-detroit-usa/news-story/f83ef09c80a4a035228e6ce16fad0e39'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/sport/live-ufc-218-in-detroit-usa/news-story/f83ef09c80a4a035228e6ce16fad0e39'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/sport/live-ufc-218-in-detroit-usa/news-story/f83ef09c80a4a035228e6ce16fad0e39'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/sport/live-ufc-218-in-detroit-usa/news-story/f83ef09c80a4a035228e6ce16fad0e39'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/sport/ufc/live-ufc-218-in-detroit-usa/news-story/f83ef09c80a4a035228e6ce16fad0e39'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/sport/live-ufc-218-in-detroit-usa/news-story/f83ef09c80a4a035228e6ce16fad0e39'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/sport/live-ufc-218-in-detroit-usa/news-story/f83ef09c80a4a035228e6ce16fad0e39'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/sport/live-ufc-218-in-detroit-usa/news-story/f83ef09c80a4a035228e6ce16fad0e39'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/sport/live-ufc-218-in-detroit-usa/news-story/f83ef09c80a4a035228e6ce16fad0e39'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/UFC/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/UFC/',
                        'id': '1226771092144',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/UFC/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/UFC/',
                            'id': '1226771092144',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226771092144/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226771092144/',
                            'id': '1226771092144',
                            'isDominant': true
                        },
                        {
                            'value': '/display/news.com.au/Web/NewsComAu/Live Event/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Web/NewsComAu/Live%20Event/',
                            'id': '1227727774454',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/news.com.au/1227727774454/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/news.com.au/1227727774454/',
                            'id': '1227727774454',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Apple News/NewsComAu/Home/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Apple%20News/NewsComAu/Home/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227528026986/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227528026986/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/',
                            'id': '1226487037076',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226487037076/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226487037076/',
                            'id': '1226487037076',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/All Sports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/All%20Sports/',
                            'id': '1226487051447',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226487051447/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226487051447/',
                            'id': '1226487051447',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Alexander Blair/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Alexander%20Blair/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/sport/boxing/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/sport/boxing/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/crime, law and justice/crime/theft/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/crime,%20law%20and%20justice/crime/theft/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/15014000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/15014000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/02001003/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/02001003/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/lightweight title/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/lightweight%20title/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/weigh-in event/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/weigh-in%20event/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/telephone interview/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/telephone%20interview/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/martial arts/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/martial%20arts/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Insider tips/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Insider%20tips/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/commentator Joe/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/commentator%20Joe/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/comeback fight/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/comeback%20fight/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/dream situation/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/dream%20situation/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/grudge match/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/grudge%20match/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/rumour mill/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/rumour%20mill/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/middleweight champion/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/middleweight%20champion/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Madison Square Garden LP/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Madison%20Square%20Garden%20LP/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Joe Rogan/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Joe%20Rogan/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Henry Cejudo/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Henry%20Cejudo/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Amanda Cooper/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Amanda%20Cooper/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Alex Blair/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Alex%20Blair/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Justin Willis/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Justin%20Willis/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Dana White/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Dana%20White/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Brendan Schaub/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Brendan%20Schaub/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Charles Oliveira/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Charles%20Oliveira/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Connor McGregor/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Connor%20McGregor/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Jose Aldo/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Jose%20Aldo/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Alex Oliveira/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Alex%20Oliveira/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Eddie Alvarez/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Eddie%20Alvarez/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Michelle Waterson/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Michelle%20Waterson/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Max Holloway/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Max%20Holloway/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Allen Crowder/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Allen%20Crowder/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Michael Bisping/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Michael%20Bisping/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Abdul Razak Alhassan/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Abdul%20Razak%20Alhassan/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Georges St Pierre/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Georges%20St%20Pierre/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Angela Magana/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Angela%20Magana/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Julio Cortez/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Julio%20Cortez/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Alistair Overeem/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Alistair%20Overeem/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Robert Whittaker/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Robert%20Whittaker/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Dominick Reyes/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Dominick%20Reyes/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/New York/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/New%20York/NOSUBURB/',
                            'otcaConfidence': 91.8898,
                            'otcaRelevancy': 48.7058,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/Michigan/Detroit/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/Michigan/Detroit/',
                            'otcaConfidence': 77.8657,
                            'otcaRelevancy': 76.0261,
                            'otcaFrequency': 3,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 42.331389,
                                'longitude': -83.045833
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 75,
                            'otcaRelevancy': 63.5072,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/New York/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/New%20York/NOSUBURB/',
                            'otcaConfidence': 91.8898,
                            'otcaRelevancy': 48.7058,
                            'otcaFrequency': 2,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/Michigan/Detroit/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/Michigan/Detroit/',
                            'otcaConfidence': 77.8657,
                            'otcaRelevancy': 76.0261,
                            'otcaFrequency': 3,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 42.331389,
                                'longitude': -83.045833
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 75,
                            'otcaRelevancy': 63.5072,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/neutral/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/neutral/'
                        },
                        {
                            'value': '/display/couriermail.com.au/Sport news and galleries/UFC/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Sport%20news%20and%20galleries/UFC/',
                            'id': '1226771092451',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Sport news and galleries/UFC/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Sport%20news%20and%20galleries/UFC/',
                            'id': '1226771094980',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Sport news and galleries/UFC/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Sport%20news%20and%20galleries/UFC/',
                            'id': '1226771094971',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Sport news and galleries/UFC/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Sport%20news%20and%20galleries/UFC/',
                            'id': '1226771092462',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Sport news and galleries/UFC/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Sport%20news%20and%20galleries/UFC/',
                            'id': '1226771094978',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Sport/UFC/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Sport/UFC/',
                            'id': '1226771226141',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Live Event/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Live%20Event/',
                            'id': '1227727791475',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Sport%20news%20and%20galleries/',
                            'id': '1226633804010',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Sport%20news%20and%20galleries/',
                            'id': '1227960774948',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Sport%20news%20and%20galleries/',
                            'id': '1226620933253',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Sport%20news%20and%20galleries/',
                            'id': '1227960774949',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Sport%20news%20and%20galleries/',
                            'id': '1226600307173',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Sport%20news%20and%20galleries/',
                            'id': '1226621617230',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Sport%20news%20and%20galleries/',
                            'id': '1227974998773',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Sport/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Sport/',
                            'id': '1226177573029',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Sport%20news%20and%20galleries/',
                            'id': '1226633804011',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Sport%20news%20and%20galleries/',
                            'id': '1227796732399',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Sport%20news%20and%20galleries/',
                            'id': '1227974998774',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Sport news and galleries/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Sport%20news%20and%20galleries/',
                            'id': '1227974993877',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Sport news and galleries/All Sports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Sport%20news%20and%20galleries/All%20Sports/',
                            'id': '1226647090407',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Sport news and galleries/All Sports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Sport%20news%20and%20galleries/All%20Sports/',
                            'id': '1226647090408',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Sport news and galleries/All Sports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Sport%20news%20and%20galleries/All%20Sports/',
                            'id': '1226643971853',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Sport news and galleries/All Sports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Sport%20news%20and%20galleries/All%20Sports/',
                            'id': '1226600325418',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Sport news and galleries/All Sports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Sport%20news%20and%20galleries/All%20Sports/',
                            'id': '1226643971852',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Sport/Sport/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Sport/Sport/',
                            'id': '1226396491529',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'lightweight title',
                        'weigh-in event',
                        'telephone interview',
                        'martial arts',
                        'Insider tips',
                        'commentator Joe',
                        'comeback fight',
                        'dream situation',
                        'grudge match',
                        'rumour mill',
                        'middleweight champion',
                        'New York',
                        'United States of America',
                        'Northern America',
                        'North America',
                        'America',
                        'Detroit',
                        'Michigan',
                        'Madison Square Garden LP',
                        'Joe Rogan',
                        'Henry Cejudo',
                        'Amanda Cooper',
                        'Alex Blair',
                        'Justin Willis',
                        'Dana White',
                        'Brendan Schaub',
                        'Charles Oliveira',
                        'Connor McGregor',
                        'Jose Aldo',
                        'Alex Oliveira',
                        'Eddie Alvarez',
                        'Michelle Waterson',
                        'Max Holloway',
                        'Allen Crowder',
                        'Michael Bisping',
                        'Abdul Razak Alhassan',
                        'Georges St Pierre',
                        'Angela Magana',
                        'Julio Cortez',
                        'Alistair Overeem',
                        'Robert Whittaker',
                        'Dominick Reyes'
                    ],
                    'authors': [
                        'Alexander Blair'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'news.com.au',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '7b5689df71420a736285a74a967db903',
                                'link': 'http://cdn.newsapi.com.au/content/v2/7b5689df71420a736285a74a967db903'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-757ea6cc5ac1446dfefe77b146a20b60',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'ee88798734f56198a2c26a17b0167a20',
                                'link': 'http://cdn.newsapi.com.au/content/v2/ee88798734f56198a2c26a17b0167a20'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-f483ada201b36e96e0318ffab05beb58',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'a7826320a01e71633cad5776cf0ee7a1',
                                'link': 'http://cdn.newsapi.com.au/content/v2/a7826320a01e71633cad5776cf0ee7a1'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-90907bc6ab3bc5460379d8bf390d7681',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'fff0ddebf9ca66b896533090177e4839',
                                'link': 'http://cdn.newsapi.com.au/content/v2/fff0ddebf9ca66b896533090177e4839'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-1d6e46a20f5c1e02122f9574c25f60e3',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '2195889fab5b867ec57d89a82491eae8',
                                'link': 'http://cdn.newsapi.com.au/content/v2/2195889fab5b867ec57d89a82491eae8'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-cbb2d60143b70a5ac215ac17a8b350f0',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '5ab9693eb37e0c4d40d8e313f7e7c72d',
                                'link': 'http://cdn.newsapi.com.au/content/v2/5ab9693eb37e0c4d40d8e313f7e7c72d'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-17283cc7f9f930d70783345ba29bf917',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '05ce35fd7a76fef93f41e1b173fb7d0f',
                                'link': 'http://cdn.newsapi.com.au/content/v2/05ce35fd7a76fef93f41e1b173fb7d0f'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-faad3e57bec47be51438346dbc02b21e',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'e66130e6b3d8dc52f88de0b7e852f73f',
                                'link': 'http://cdn.newsapi.com.au/content/v2/e66130e6b3d8dc52f88de0b7e852f73f'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-01fdcb2bde569818e60537bf4690e9a1',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'd22b568e563e07aef38d35eac46ad235',
                                'link': 'http://cdn.newsapi.com.au/content/v2/d22b568e563e07aef38d35eac46ad235'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'd22b568e563e07aef38d35eac46ad235',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '5c5d99f51d41f5d68f375212a31a5ee5',
                                'link': 'http://cdn.newsapi.com.au/content/v2/5c5d99f51d41f5d68f375212a31a5ee5'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '5c5d99f51d41f5d68f375212a31a5ee5',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '7f7803ac2a0473a70ab9fc34c2634c1f',
                                'link': 'http://cdn.newsapi.com.au/content/v2/7f7803ac2a0473a70ab9fc34c2634c1f'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '7f7803ac2a0473a70ab9fc34c2634c1f',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'e0b62b8e25962e85fe7ac7eb39bfd96b',
                                'link': 'http://cdn.newsapi.com.au/content/v2/e0b62b8e25962e85fe7ac7eb39bfd96b'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'e0b62b8e25962e85fe7ac7eb39bfd96b',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '9b5bd8af7770aa037be21d121824462d',
                                'link': 'http://cdn.newsapi.com.au/content/v2/9b5bd8af7770aa037be21d121824462d'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '9b5bd8af7770aa037be21d121824462d',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '39cd1a3ce59bc5eac4a7ed8099ba08bf',
                                'link': 'http://cdn.newsapi.com.au/content/v2/39cd1a3ce59bc5eac4a7ed8099ba08bf'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '39cd1a3ce59bc5eac4a7ed8099ba08bf',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '768f34e61d828d961671077067c0872c',
                                'link': 'http://cdn.newsapi.com.au/content/v2/768f34e61d828d961671077067c0872c'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '768f34e61d828d961671077067c0872c',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'fc6f6465f38b4002ea990c93309ef020',
                                'link': 'http://cdn.newsapi.com.au/content/v2/fc6f6465f38b4002ea990c93309ef020'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'fc6f6465f38b4002ea990c93309ef020',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'c2c9a492cb07a4eb44835dd2917e3788',
                                'link': 'http://cdn.newsapi.com.au/content/v2/c2c9a492cb07a4eb44835dd2917e3788'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'c2c9a492cb07a4eb44835dd2917e3788',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'af81f7ecc31c1a65f561a426454cf93c',
                                'link': 'http://cdn.newsapi.com.au/content/v2/af81f7ecc31c1a65f561a426454cf93c'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'af81f7ecc31c1a65f561a426454cf93c',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '575ba6def6494bbc6fc13de9d4f8dcb7',
                                'link': 'http://cdn.newsapi.com.au/content/v2/575ba6def6494bbc6fc13de9d4f8dcb7'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '575ba6def6494bbc6fc13de9d4f8dcb7',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '3db2612ff2934072dad3915bba92af69',
                                'link': 'http://cdn.newsapi.com.au/content/v2/3db2612ff2934072dad3915bba92af69'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '3db2612ff2934072dad3915bba92af69',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'fba03a46b8405812fb6f4e0dce95d224',
                                'link': 'http://cdn.newsapi.com.au/content/v2/fba03a46b8405812fb6f4e0dce95d224'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'fba03a46b8405812fb6f4e0dce95d224',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '8d1135934787b07c2b941c104842ceb3',
                                'link': 'http://cdn.newsapi.com.au/content/v2/8d1135934787b07c2b941c104842ceb3'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '8d1135934787b07c2b941c104842ceb3',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '044c3b194c67d67bca461c8af5e953fb',
                                'link': 'http://cdn.newsapi.com.au/content/v2/044c3b194c67d67bca461c8af5e953fb'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '044c3b194c67d67bca461c8af5e953fb',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'b4169783d23295494360e20ef71dedc2',
                                'link': 'http://cdn.newsapi.com.au/content/v2/b4169783d23295494360e20ef71dedc2'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'b4169783d23295494360e20ef71dedc2',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '4c7f65fe0dfce26cbd26613ff97984d0',
                                'link': 'http://cdn.newsapi.com.au/content/v2/4c7f65fe0dfce26cbd26613ff97984d0'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '4c7f65fe0dfce26cbd26613ff97984d0',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'd1cc225c04cc9886c7722f6de46d74b6',
                                'link': 'http://cdn.newsapi.com.au/content/v2/d1cc225c04cc9886c7722f6de46d74b6'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'd1cc225c04cc9886c7722f6de46d74b6',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'a7cc4048b3c68fb83961ef1ba078f223',
                                'link': 'http://cdn.newsapi.com.au/content/v2/a7cc4048b3c68fb83961ef1ba078f223'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'a7cc4048b3c68fb83961ef1ba078f223',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '2a607a97478181aa0695304989f7b422',
                                'link': 'http://cdn.newsapi.com.au/content/v2/2a607a97478181aa0695304989f7b422'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '2a607a97478181aa0695304989f7b422',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'a6c5913e57adc102cea10ad49a0d4cc8',
                                'link': 'http://cdn.newsapi.com.au/content/v2/a6c5913e57adc102cea10ad49a0d4cc8'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'a6c5913e57adc102cea10ad49a0d4cc8',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '77382943b5f916b64a7cbb7c5cf1198b',
                                'link': 'http://cdn.newsapi.com.au/content/v2/77382943b5f916b64a7cbb7c5cf1198b'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '77382943b5f916b64a7cbb7c5cf1198b',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'b9315ececb6abbd3c11c63ccd9c89085',
                                'link': 'http://cdn.newsapi.com.au/content/v2/b9315ececb6abbd3c11c63ccd9c89085'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'b9315ececb6abbd3c11c63ccd9c89085',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '4a597c80f312730a3d6c12a571433f1c',
                                'link': 'http://cdn.newsapi.com.au/content/v2/4a597c80f312730a3d6c12a571433f1c'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '4a597c80f312730a3d6c12a571433f1c',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'd2e8b44b8d290a406fce0095a3bf11fa',
                                'link': 'http://cdn.newsapi.com.au/content/v2/d2e8b44b8d290a406fce0095a3bf11fa'
                            },
                            'origin': 'CONTENT_API',
                            'originId': 'd2e8b44b8d290a406fce0095a3bf11fa',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '32a6beda374502295b313feb53d603b7',
                                'link': 'http://cdn.newsapi.com.au/content/v2/32a6beda374502295b313feb53d603b7'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '32a6beda374502295b313feb53d603b7',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '8f8ec029b49bf256b402c763b4dfd154',
                                'link': 'http://cdn.newsapi.com.au/content/v2/8f8ec029b49bf256b402c763b4dfd154'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '8f8ec029b49bf256b402c763b4dfd154',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '25f9634e872135d9f38e9d3b17137708',
                                'link': 'http://cdn.newsapi.com.au/content/v2/25f9634e872135d9f38e9d3b17137708'
                            },
                            'origin': 'CONTENT_API',
                            'originId': '25f9634e872135d9f38e9d3b17137708',
                            'contentType': 'IFRAME',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'e03cf9b9a71ec4cd3b6d895faed5c40c',
                                'link': 'http://cdn.newsapi.com.au/content/v2/e03cf9b9a71ec4cd3b6d895faed5c40c'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': 42.331389,
                            'longitude': -83.045833
                        }
                    ],
                    'seoHeadline': 'UFC 218 live updates, results: Jose Aldo vs. Max Holloway 2',
                    'userOriginUpdated': 'mattheyj',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'live-ufc-218-in-detroit-usa',
                    'revision': 54,
                    'body': "\n\nMAX Holloway got the better of Jose Aldo for the second time this year, retaining his featherweight crown with a TKO victory at UFC 218 in Detroit.\n\nHolloway silenced Aldo in June and he repeated the dose on Sunday, annihilating the Brazilian in a performance that puts him in the conversation as being the best pound-for-pound fighter in the promotion. \n\n4.45pm \n\nMain Card \n\nFeatherweight \n\nMax Holloway defeated Jose Aldo via TKO (R3, 4:51) \n\nMax Holloway was too strong for Jose Aldo for the second time this year, reducing the Brazilian to a bloody pulp as he defended his featherweight title with a 12th straight win.\n\nAfter the violent KOs that preceded their fight, the pair started in relatively tame fashion as they felt each other out.\n\nAldo clearly had a plan to pepper Holloway with leg kicks but Holloway picked up the pace towards the end of the second round, landing a flurry of punches.\n\nThe American taunted a tired-looking Aldo at the start of the third as both men let their hands go in a violent slugfest. Holloway struck with a nice combination followed by an overhand right midway through the round as he quickly gained the ascendancy.\n\n“Aldo is a shell of himself now,” Joe Rogan said in commentary.\n\nAldo’s face was covered in blood as he failed to protect himself from eating a barrage of punches, Holloway looking to end the fight. He then secured top position and let rip with some savage ground and pound.\n\nAldo — whose position as the UFC’s greatest ever featherweight is now under threat from Holloway — was unable to fight back and referee Herb Dean stopped the fight.\n\n“I knew he was tired already. My trainer said let’s take him to deep water, we know he can’t swim there, so let’s drown him,” Holloway said after the fight.\n\nHeavyweight \n\nFrancis Ngannou defeated Alistair Overeem via KO (R1) \n\nFrancis Ngannou took less than two minutes to knock Alistair Overeem out with a scary left hook that put the UFC’s No. 1 heavyweight contender to sleep.\n\nIt was a shocking blow that sent the Detroit crowd wild.\n\n“He’s still out cold, his toes are locked up like he’s just been electrocuted,” commentator Joe Rogan said. “He's still stiff as a board.\n\n“That’s how scary Francis Ngannou is — it was like a scene from a movie.”\n\nNgannou’s brutal victory will now likely earn him a title shot against heavyweight champion Stipe Miocic.\n\nFlyweight \n\nHenry Cejudo defeated Sergio Pettis via unanimous decision (30-37 x 3) \n\nHenry Cejudo’s superior wrestling meant he emerged the victor in his flyweight bout with Sergio Pettis.\n\nHe started slow but found his groove as he took control after landing a takedown early in the first round. Cejudo struck with a nice uppercut in the second and in the final round it was back to the clinch as he pinned Pettis against the cage and worked him over.\n\nLightweight \n\nEddie Alvarez defeated Justin Gaethje via TKO (R3, 3:59) \n\nUnderdog Eddie Alvarez stunned an appreciative Detroit crowd when he rocked Justin Gaethje with a knee to the head in what one Fox commentator called “a fight for the ages”.\n\nWe thought Yancy Medeiros’ win over Alex Oliveira had fight of the night honours wrapped up but this bout will give it some stiff competition. Alvarez looked like an absolute mess as he ate some heavy blows, but so too did Gaethje.\n\nThe pair were like lions who had finally been let out of their cage, engaging in a violent war. Gaethje peppered Alvarez with leg kicks and they both landed their fair share of brutal uppercuts late in the third before The Underground King finished the job with a vicious knee. \n\n“Unbelievable,” commentator Joe Rogan said. “What a fight, Gaethje does not know what happened.\n\n“Wow, just wow.”\n\nStrawweight \n\nTecia Torres defeated Michelle Waterson via unanimous decision (30-27, 29-28 x 2) \n\nTecia Torres dominated her strawweight bout against Michelle Waterson to claim a unanimous decision victory.\n\nWaterson — nicknamed “The Karate Hottie” — held her own in the opening two rounds as the pair trades knees in the first before Torres bullied her against the cage.\n\nShe fought her way back into contention in the second but Torres’ savage ground and pound flattened Waterson in the third.\n\n12pm \n\nUndercard \n\nLightweight \n\nPaul Felder defeated Charles Oliveira via KO (R2, 4:06) \n\nPaul Felder capped off the undercard with his third consecutive finish, defeating Charles Oliveira by KO.\n\nHe secured top position on the ground in the second round and pummelled Oliveira with a barrage of elbows to the face, giving the referee no option but to step in and call it off.\n\nThe Irish Dragon went up a gear in the second after Oliveira looked to have edged him on the judges’ scorecards in the opening round, trapping Felder in a standing rear naked choke and hitting him with a damaging upkick.\n\nWelterweight \n\nYancy Medeiros defeated Alex Oliveira via TKO (R3, 2:02) \n\nThis fight was a bloody war from the beginning as commentator Joe Rogan described the first round as “one of the greatest rounds in the history in the sport”.\n\nBoth Oliveira and Medeiros let their hands go and showed a complete disregard for their own safety. They ate punches and dished them out at will as the UFC world watched on in awe of the violent spectacle.\n\nBlood was pouring from Oliveira’s clearly broken nose but he kept throwing punches, dropping Medeiros twice before “Cowboy” landed two huge knees of his own.\n\n“This is crazy,” Joe Rogan said as the pair traded hits.\n\nThe second round was just as bloody, Medeiros laying into Oliveira with some savage ground and pound as his elbows pulverised the Brazilian’s head. Once again Rogan was in awe, saying: “This is one of the greatest fights we’ve ever seen.”\n\nThe carnage continued in the third as Medeiros pinned Oliveira against the cage and kept swinging, dropping the 29-year-old and forcing the referee to jump in and stop the fight.\n\n“Phenomenal, absolutely phenomenal,” Rogan said. “That was one of the greatest fights I’ve ever seen in my life.”\n\nLightweight \n\nDavid Teymur defeated Drakkar Klose via unanimous decision (30-27 x 2, 29-28) \n\nThe fight started in controversial fashion when referee Herb Dean wasted no time giving David Teymur a warning for timidity. He was circling rather than coming forward as Drakkar Klose stood shaking his head with his hands by his side.\n\nThe warning was met with condemnation by the UFC community who couldn’t believe Dean was so hasty in issuing a warning for something that would never normally warrant any attention.\n\n“This is blowing me away — that was ridiculous,” commentator Joe Rogan said during the broadcast. “That’s ridiculous.\n\n“We’ve seen way more stalling in fights without receiving a warning.\n\n“I don’t know what’s going on. Maybe Herb’s trying to make up for a bad call earlier in the night.”\n\nDean was criticised for calling what many believed to be an early stoppage in Abdul Razak Alhassan’s win over Sabah Homasi when Homasi hit the canvas after five minutes.\n\nKlose landed a body kick then a takedown in the first round but Teymur responded with an uppercut before finding his way back to his feet. Teymur was more aggressive in the second as he dished out leg, head and body kicks and he maintained the rage in the third to run over the top of Klose in a unanimous points victory.\n\nStrawweight \n\nFelice Herrig defeated Cortney Casey via split decision (29-28 x 2, 28-29) \n\nThere was no love lost as both fighters took a break from fighting to flip each other the bird but Felice Herrig laughed last with a split decision victory. \n\nHerrig edged Casey in a tight first round, her hands just a little faster than her opponent’s as her left hook did some damage. They traded shots at the start of the second where Casey packed a bit more power, but Herrig had the higher work rate as the bout wore on to win the favour of two of the three judges.\n\n10am \n\nPreliminary card: Wardrobe malfunction stalls UFC \n\nAmanda Cooper defeated Angela Magana via TKO (punches) R2, 4:34 \n\nThe final fight on the preliminary card was stalled momentarily after a ground war between Amanda Cooper and Magana saw the latter’s top slip off slightly and leave a little too much exposed to the cameras.\n\nThe referee halted the fight to allow Magana the opportunity to reset herself before continuing the fight.\n\nMagana saw out the first round after the unfortunate slip but was TKO’d by Cooper late in the second round.\n\nAbdul Razak Alhassan defeated Sabah Homasi via TKO (referee stoppage) R1, 4:21 \n\nAbdul Razak Alhassan claimed a controversial win over Sabah Homasi in the first round of their welterweight bout as referee Herb Dean stopped the fight after Homasi dropped to the deck.\n\nThe pair duked it out after wrestling in a clinch before Homasi fell to the canvas as the fight approached the five minute mark. Commentator Joe Rogan was convinced Homasi’s fall was a personal mistake and not from a blow from Homasi.\n\n“That’s not enough to stop a fight, the crowd is going bananas here,” Rogan said. “I think that’s a big mistake ... I was stunned.”\n\nDominick Reyes defeated Jeremy Kimball via submission (rear-naked choke) R1, 3:39 \n\nDominick Reyes took inspiration from Justin Willis’ opening bout and defeated light heavyweight opponent Jeremy Kimball in the first round.\n\nReyes dominated his contender early in the piece and jumped on the back of the 26-year-old before choking him out.\n\nJustin Willis defeated Allen Crowder, KO (punch) R1, 2:33 \n\nHeavyweight brawler Justin “Pretty” Willis silenced Allen Crowder with a savage KO in the first round to kick off UFC 218.\n\nThe 30-year-old sealed his sixth win in a row with a brutal left hook to Crowder’s face, sending his challenger to the deck inside of three minutes.\n\n“Too fast, too strong, too athletic,” Willis said after the fight. “And most of all, too damn pretty.”\n\n9am \n\nSchaub backs McGregor ‘superfight’ \n\nAussie UFC gun Robert Whittaker will not be challenging middleweight champion Georges St-Pierre any time soon, according to MMA expert Brendan Schaub. \n\nSt-Pierre shut out UFC veteran Michael Bisping in a brutal TKO at UFC 217 last month, claiming the middleweight belt in his comeback fight after a four-year hiatus. Whittaker, who is the division’s interim champion, said a fight with St-Pierre would be a “dream come true” — but Schaub says the MMA legend has a bigger fish to fry before taking on the Aussie.\n\n“GSP is not fighting Whittaker,” Schaub, a former heavyweight competitor, told UFC commentator Joe Rogan on The Joe Rogan Experience.\n\n“The rumour mill, from what I hear is he might want to see if he can cut to 170 (pounds) and do a super fight with Conor (McGregor) there.\n\n“In a dream situation that’s what all sides would want to have happen and GSP, he’s taking time off now but I know he’s going to see if he can cut to 70 (170 pounds) to possibly make that happen. He is thicker than the three musketeers right now, and he’s a muscular dude, he’s getting older too so the weight comes on.\n\n“(But) I bet he could do it at 70 (170 pounds) if he realises the possibilities of a superfight with Conor.”\n\nUFC president Dana White said talks of St-Pierre’s next fight have been put on hold as the champion battles with illness.\n\n“They didn’t talk Monday, they actually called me yesterday and I think it’s out that he has colitis,” White said. “So he’s out for a minute.”\n\n",
                    'standFirst': 'FRANCIS Ngannou almost decapitated No. 1 heavyweight contender Alistair Overeem with a savage left hook at UFC 218.\n\n',
                    'kicker': 'UFC 218',
                    'byline': 'Alex Blair and James Matthey',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [
                        'ae507da8ea98c7cc2a7aef0e8ae3dad7',
                        'dd423ba46d49b59b6471332a730d68dc'
                    ],
                    'bylineNames': [
                        'Alex Blair and James Matthey'
                    ],
                    'bylineTitles': [],
                    'bulletList': [
                        '<a href="#U632148139409HXC">Holloway owns Aldo</a>',
                        '<a href="#U63214813940925G">Monster’s devastating KO</a>',
                        '<a href="#U632148139409NXH">Karate Hottie humbled</a>',
                        '<a href="#U632148139409NpF">‘One of the greatest fights ever’</a>'
                    ]
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': '8b2f2ddd5b4bbd8e4e429faad55fd7c7',
                        'link': 'http://cdn.newsapi.com.au/content/v2/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                    },
                    'originId': 'a756e446-d7d4-11e7-b5a9-0fbc45dc1ac5',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Could DNA unlock Zodiac killer’s ID?',
                    'subtitle': 'More than 50 years on, could DNA unlock Zodiac serial killer’s ID?',
                    'description': 'HIS grisly slayings made him one of history’s most famous unidentified serial killers.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/8b2f2ddd5b4bbd8e4e429faad55fd7c7?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'news.com.au',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': 'a756e446-d7d4-11e7-b5a9-0fbc45dc1ac5',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T11:18:59.000Z',
                    'dateLive': '2017-12-03T11:03:00.000Z',
                    'customDate': '2017-12-03T11:18:00.000Z',
                    'dateCreated': '2017-12-03T02:49:59.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': 'c0c31aa11c059f586db8f64d58acc00a',
                            'link': 'http://cdn.newsapi.com.au/image/v1/c0c31aa11c059f586db8f64d58acc00a'
                        },
                        'originId': 'crop-c5a612e372385b17dd4b835c65f87fc7',
                        'origin': 'METHODE',
                        'title': 'ZODIAC-C-14DEC99-SC-HO--Police sketch of the man suspected of being the "Zodiak Killer," 1969.',
                        'subtitle': 'f770c2a4-d7d3-11e7-b5a9-0fbc45dc1ac5',
                        'description': 'ZODIAC-C-14DEC99-SC-HO--Police sketch of the man suspected of being the "Zodiak Killer," 1969.',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/c0c31aa11c059f586db8f64d58acc00a',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'Supplied',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T11:03:42.000Z',
                        'dateLive': '2017-12-03T11:03:00.000Z',
                        'dateCreated': '2017-12-03T02:45:04.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'categories': [],
                        'keywords': [
                            'zodiac killer'
                        ],
                        'authors': [],
                        'domains': [
                            'newscorpaustralia.com',
                            'weeklytimesnow.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'adelaidenow.com.au',
                            'heraldsun.com.au',
                            'ntnews.com.au',
                            'cairnspost.com.au',
                            'news.com.au',
                            'perthnow.com.au',
                            'townsvillebulletin.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'banksa',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': 'f770c2a4d7d311e7b5a90fbc45dc1ac5',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'ZODIAC-C-14DEC99-SC-HO--Police sketch of the man s',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': 'f770c2a4-d7d3-11e7-b5a9-0fbc45dc1ac5',
                        'enterpriseAssetId': 'NEWSMMGLPICT000069656752',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'weeklytimesnow.com.au',
                            'link': 'http://www.weeklytimesnow.com.au/news/world/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        },
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/8b2f2ddd5b4bbd8e4e429faad55fd7c7?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/news/world/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/news/world/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/news/world/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/news/world/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/news/world/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/news/world/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/news/world/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/world/north-america/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/news/world/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/news/world/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/news/world/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/news/world/more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id/news-story/8b2f2ddd5b4bbd8e4e429faad55fd7c7'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/World/news.com.auNORTHAMERICA/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/World/news.com.auNORTHAMERICA/',
                        'id': '1226564883547',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/World/news.com.auNORTHAMERICA/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/World/news.com.auNORTHAMERICA/',
                            'id': '1226564883547',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226564883547/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226564883547/',
                            'id': '1226564883547',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/World/',
                            'id': '1226490532755',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226490532755/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226490532755/',
                            'id': '1226490532755',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/',
                            'id': '1226487036675',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226487036675/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226487036675/',
                            'id': '1226487036675',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Apple News/NewsComAu/Home/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Apple%20News/NewsComAu/Home/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227528026986/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227528026986/',
                            'id': '1227528026986',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Apple News/NewsComAu/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Apple%20News/NewsComAu/',
                            'id': '1227528023188',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227528023188/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227528023188/',
                            'id': '1227528023188',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Debbie Schipp/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Debbie%20Schipp/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/politics/defence/armed Forces/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/politics/defence/armed%20Forces/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/crime, law and justice/crime/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/crime,%20law%20and%20justice/crime/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/crime, law and justice/police/arrest/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/crime,%20law%20and%20justice/police/arrest/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/11001004/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/11001004/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/02001000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/02001000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/02003003/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/02003003/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/cryptic messages/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/cryptic%20messages/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/police sketch/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/police%20sketch/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/coded messages/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/coded%20messages/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/unidentified serial killers/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/unidentified%20serial%20killers/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/notorious serial assassin/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/notorious%20serial%20assassin/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/killer message/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/killer%20message/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/cold case expert/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/cold%20case%20expert/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/murder scene/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/murder%20scene/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/murder victim/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/murder%20victim/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/homicide detective/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/homicide%20detective/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/person responsible/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/person%20responsible/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/army clothing/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/army%20clothing/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/army boots/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/army%20boots/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/documentary series/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/documentary%20series/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/dangeroue anamal/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/dangeroue%20anamal/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/documentary team/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/documentary%20team/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Fox News Channel/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Fox%20News%20Channel/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Riverside Community College/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Riverside%20Community%20College/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/San Francisco Chronicle/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/San%20Francisco%20Chronicle/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/History Channel/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/History%20Channel/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Betty Lou Jensen/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Betty%20Lou%20Jensen/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Lawrence Kane/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Lawrence%20Kane/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/David Arthur Faraday/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/David%20Arthur%20Faraday/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/California/Santa Barbara/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/California/Santa%20Barbara/',
                            'otcaConfidence': 93.1764,
                            'otcaRelevancy': 45.0025,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 34.420833,
                                'longitude': -119.698056
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/California/Santa Barbara/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/California/Santa%20Barbara/',
                            'otcaConfidence': 93.1764,
                            'otcaRelevancy': 45.0025,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 34.420833,
                                'longitude': -119.698056
                            }
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/news.com.au/World News/north america/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/World%20News/north%20america/',
                            'id': '1226569889477',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Network%20News/World/',
                            'id': '1226628352350',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Network%20News/World/',
                            'id': '1226692643468',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Network%20News/World/',
                            'id': '1226696922805',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Network%20News/World/',
                            'id': '1226603199045',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Network%20News/World/',
                            'id': '1226696922808',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/weeklytimesnow.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/weeklytimesnow.com.au/Network%20News/World/',
                            'id': '1226696922806',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/World News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/World%20News/',
                            'id': '1226346011383',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Network%20News/World/',
                            'id': '1226646735401',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Network%20News/World/',
                            'id': '1226696922804',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Network%20News/World/',
                            'id': '1226696922807',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Network%20News/World/',
                            'id': '1226618422491',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Network%20News/World/',
                            'id': '1226618422489',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Network News/World/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Network%20News/World/',
                            'id': '1226683748662',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Network%20News/',
                            'id': '1111112000022',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Network%20News/',
                            'id': '1226692466903',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Network%20News/',
                            'id': '1111112026929',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Network%20News/',
                            'id': '1226696899975',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Network%20News/',
                            'id': '1111112043252',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Network%20News/',
                            'id': '1111112081508',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Network%20News/',
                            'id': '1226696899976',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/weeklytimesnow.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/weeklytimesnow.com.au/Network%20News/',
                            'id': '1226696899972',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Network%20News/',
                            'id': '1111112018754',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Network%20News/',
                            'id': '1226683746263',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Network%20News/',
                            'id': '1226696899973',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Network News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Network%20News/',
                            'id': '1226696899974',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'cryptic messages',
                        'police sketch',
                        'coded messages',
                        'unidentified serial killers',
                        'notorious serial assassin',
                        'killer message',
                        'cold case expert',
                        'murder scene',
                        'murder victim',
                        'homicide detective',
                        'person responsible',
                        'army clothing',
                        'army boots',
                        'documentary series',
                        'dangeroue anamal',
                        'documentary team',
                        'Santa Barbara',
                        'California',
                        'United States of America',
                        'Northern America',
                        'North America',
                        'America',
                        'Fox News Channel',
                        'Riverside Community College',
                        'San Francisco Chronicle',
                        'History Channel',
                        'Betty Lou Jensen',
                        'Lawrence Kane',
                        'David Arthur Faraday'
                    ],
                    'authors': [
                        'Debbie Schipp'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'weeklytimesnow.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'adelaidenow.com.au',
                        'heraldsun.com.au',
                        'ntnews.com.au',
                        'cairnspost.com.au',
                        'news.com.au',
                        'perthnow.com.au',
                        'townsvillebulletin.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': 'c0c31aa11c059f586db8f64d58acc00a',
                                'link': 'http://cdn.newsapi.com.au/content/v2/c0c31aa11c059f586db8f64d58acc00a'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-c5a612e372385b17dd4b835c65f87fc7',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '44d6d2eda123d39be4ec5f0b7cec37d7',
                                'link': 'http://cdn.newsapi.com.au/content/v2/44d6d2eda123d39be4ec5f0b7cec37d7'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-d698734dfc3ec2f27b0dfb15b1328c26',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'bed6dbf89e474a26b716af75157604db',
                                'link': 'http://cdn.newsapi.com.au/content/v2/bed6dbf89e474a26b716af75157604db'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-5121d469ecbea02ef2618aa399eed30c',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'ae5d33998ca3b6907c83f279c3b96317',
                                'link': 'http://cdn.newsapi.com.au/content/v2/ae5d33998ca3b6907c83f279c3b96317'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-0570de8d80f8b5b8a2a2eb7da19a4ff7',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '20ecc8189523a08a456d32d858a88875',
                                'link': 'http://cdn.newsapi.com.au/content/v2/20ecc8189523a08a456d32d858a88875'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-f7a5114398ee02ccd78b86c69773e6ba',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '9b838610561112955d3403e7c572bd9c',
                                'link': 'http://cdn.newsapi.com.au/content/v2/9b838610561112955d3403e7c572bd9c'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-59f3123e73110b1eeab4808c8c402182',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '95862a75333d6f4133269a8e50b6fef8',
                                'link': 'http://cdn.newsapi.com.au/content/v2/95862a75333d6f4133269a8e50b6fef8'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-8abe75b0fcead3ef24ac3dd4f0fb2789',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'a9d69662d782495a52cc24f101aa4fab',
                                'link': 'http://cdn.newsapi.com.au/content/v2/a9d69662d782495a52cc24f101aa4fab'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-39ef6779d6b4e67a3abab54f7c0ecb8b',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'a9d69662d782495a52cc24f101aa4fab',
                                'link': 'http://cdn.newsapi.com.au/content/v2/a9d69662d782495a52cc24f101aa4fab'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-39ef6779d6b4e67a3abab54f7c0ecb8b',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'c0c2de413e3df5846f2eeb3d95f19897',
                                'link': 'http://cdn.newsapi.com.au/content/v2/c0c2de413e3df5846f2eeb3d95f19897'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': 34.420833,
                            'longitude': -119.698056
                        }
                    ],
                    'seoHeadline': 'Zodiac Killer: DNA may crack code to identify American serial killer',
                    'userOriginUpdated': 'banksa',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'more-than-50-years-on-could-dna-unlock-zodiac-serial-killers-id',
                    'revision': 2,
                    'body': 'The mysterious, coded messages he sent to the media and taunted police with gave a hint to his twisted mind, but not his identity.\n\nBut now, experts finally believe they are close to cracking the code they wanted most: that of the DNA of the Zodiac killer”.\n\nThe murderer was responsible for shooting and stabbing five people to death in Northern California in the 1960s, claimed he hid his name in a series of cryptic messages. In some of those ciphers and bizarre letters he also claimed up to 37 victims.\n\nA former LAPD homicide detective and a cold case expert believe they’ve made a breakthrough that could finally bring someone to justice. \n\nSal LaBarbera and Ken Mains think the person responsible could be Ross Sullivan, who was the original suspect in one of the murders.\n\nThe team has extracted DNA from the clothing of one murder victim — Cheri Jo Bates — that may expose the killer.\n\nThe pair’s search features in a new History Channel documentary series, The Hunt For The Zodiac Killer.\n\nThe series also features a “supercomputer” named CARMEL, which was fed Zodiac’s writings so it could learn to “think” like the killer himself. It has also started doing some weird stuff of its own: writing poetry.\n\nThe Zodiac killer was declared “inactive” in 2004, but the search to establish his identity has continued.\n\nCheri Jo Bates was stabbed in October, 1966 after leaving the library at Riverside Community College. It was a killing the Zodiac Killer claimed, but authorities never officially linked him to the crime.\n\n“During the examination of Bates’ clothing, I discovered, without a doubt, two bloody handprints at the bottom of her pants,” Mains told Fox News.\n\n“We have touch DNA from those handprints. We have the potential to obtain Zodiac’s DNA.”\n\nThe documentary team has so far focused on two suspects: Sullivan and Lawrence Kane.\n\nSullivan, would be in his 70s by now if still alive. \n\nHe was arrested in Santa Barbara in 1968 after displaying bizarre behaviour and he worked at a library close to where Bates was last seen alive.\n\nLibrary staff noted he always wore army clothing including military boots. A footprint of army boots was found at the murder scene.\n\nSullivan also bears a resemblance to a police sketch of the Zodiac Killer released at the time.\n\nSullivan was questioned by police but Bates was never officially declared a Zodiac victim. But Mains says Bates’ murderer sent a letter to police and newspapers confessing to the crime: a letter “very similar to ones the Zodiac sent — so much so that he misused and misspelled the same letters”.\n\nMeanwhile Kane, who died in 2010, has “red flags in his background that jump out to me that make him a viable suspect”, Mains said.\n\nThe first Zodiac killer message was a three-part cipher sent to the Vallejo Times-Herald, the San Francisco Chronicle and The San Francisco Examiner on July 31, 1969.\n\nIt was cracked to reveal the words: “I like killing people because it is so much fun it is more fun than killing wild game in the forrest [sic] because man is the most dangeroue anamal. [sic]”\n\nAmong the Zodiac killers confirmed victims were teenagers David Arthur Faraday and Betty Lou Jensen. They were on their first date in December, 2968, when they were gunned down.\n\n',
                    'standFirst': 'THE notorious serial assassin killed from 1968 to the early 1970s, sending coded messages. Now DNA may crack the code of just who the Zodiac killer was.\n\n',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [
                        'b64b378cd32323c928a4caf03be83ec9'
                    ],
                    'bylineNames': [],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': 'e8835274e10a8ef2ee922f3d0e58ae03',
                        'link': 'http://cdn.newsapi.com.au/content/v2/e8835274e10a8ef2ee922f3d0e58ae03'
                    },
                    'originId': '35b19bea-d7b8-11e7-b5a9-0fbc45dc1ac5',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Lauer’s wife has ‘fled the country’',
                    'subtitle': 'Lauer’s wife reportedly fled to Netherlands with their children',
                    'description': 'MATT Lauer’s long-suffering wife Annette Roque has fled their home and is rumoured to have headed back to her native Netherlands amid his sex harassment scandal.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/e8835274e10a8ef2ee922f3d0e58ae03?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'NY Post',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': '35b19bea-d7b8-11e7-b5a9-0fbc45dc1ac5',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T18:56:23.000Z',
                    'dateLive': '2017-12-03T00:01:00.000Z',
                    'customDate': '2017-12-03T18:56:00.000Z',
                    'dateCreated': '2017-12-02T23:26:23.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '0b5c908001827d7fa4d2296bea10bd96',
                            'link': 'http://cdn.newsapi.com.au/image/v1/0b5c908001827d7fa4d2296bea10bd96'
                        },
                        'originId': 'crop-bcbf3e438854507ba5e63b73e6926fd0',
                        'origin': 'METHODE',
                        'title': 'Lauer and Roque',
                        'subtitle': '93780dc8-d7bc-11e7-b5a9-0fbc45dc1ac5',
                        'description': "Lauer and Roque at TIME'S 100 Most Influential People In The World at the Jazz at Lincoln Center in NYC. Picture by: Demis Maryannakis / Splash News.",
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/0b5c908001827d7fa4d2296bea10bd96',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'Splash News Australia',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T00:32:58.000Z',
                        'dateLive': '2017-12-03T00:01:00.000Z',
                        'dateCreated': '2017-12-02T23:57:38.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'primaryCategory': {
                            'value': '/author/newscorpaustralia.com/Demis Maryannakis / Splash News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Demis%20Maryannakis%20/%20Splash%20News/'
                        },
                        'categories': [
                            {
                                'value': '/author/newscorpaustralia.com/Demis Maryannakis / Splash News/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Demis%20Maryannakis%20/%20Splash%20News/'
                            }
                        ],
                        'keywords': [],
                        'authors': [
                            'Demis Maryannakis / Splash News'
                        ],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'coyb',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '93780dc8d7bc11e7b5a90fbc45dc1ac5',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'spl385611_001.jpg',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '93780dc8-d7bc-11e7-b5a9-0fbc45dc1ac5',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/e8835274e10a8ef2ee922f3d0e58ae03?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/entertainment/celebrity/lasers-wife-reportedly-fled-to-netherlands-with-their-children/news-story/e8835274e10a8ef2ee922f3d0e58ae03'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/entertainment/lasers-wife-reportedly-fled-to-netherlands-with-their-children/news-story/e8835274e10a8ef2ee922f3d0e58ae03'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/entertainment/celebrity/lasers-wife-reportedly-fled-to-netherlands-with-their-children/news-story/e8835274e10a8ef2ee922f3d0e58ae03'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/entertainment/celebrity/lasers-wife-reportedly-fled-to-netherlands-with-their-children/news-story/e8835274e10a8ef2ee922f3d0e58ae03'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/entertainment/lasers-wife-reportedly-fled-to-netherlands-with-their-children/news-story/e8835274e10a8ef2ee922f3d0e58ae03'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/entertainment/lasers-wife-reportedly-fled-to-netherlands-with-their-children/news-story/e8835274e10a8ef2ee922f3d0e58ae03'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/entertainment/lasers-wife-reportedly-fled-to-netherlands-with-their-children/news-story/e8835274e10a8ef2ee922f3d0e58ae03'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/entertainment/celebrity-life/hook-ups-break-ups/lasers-wife-reportedly-fled-to-netherlands-with-their-children/news-story/e8835274e10a8ef2ee922f3d0e58ae03'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/entertainment/celebrity/lasers-wife-reportedly-fled-to-netherlands-with-their-children/news-story/e8835274e10a8ef2ee922f3d0e58ae03'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/entertainment/lasers-wife-reportedly-fled-to-netherlands-with-their-children/news-story/e8835274e10a8ef2ee922f3d0e58ae03'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/entertainment/celebrity/lasers-wife-reportedly-fled-to-netherlands-with-their-children/news-story/e8835274e10a8ef2ee922f3d0e58ae03'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/entertainment/lasers-wife-reportedly-fled-to-netherlands-with-their-children/news-story/e8835274e10a8ef2ee922f3d0e58ae03'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Life/hooks up and break ups/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Life/hooks%20up%20and%20break%20ups/',
                        'id': '1226751326542',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Life/hooks up and break ups/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Life/hooks%20up%20and%20break%20ups/',
                            'id': '1226751326542',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226751326542/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226751326542/',
                            'id': '1226751326542',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Life/',
                            'id': '1226496181309',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226496181309/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226496181309/',
                            'id': '1226496181309',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/',
                            'id': '1226494497264',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226494497264/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226494497264/',
                            'id': '1226494497264',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Bailee Dean/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Bailee%20Dean/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/crime, law and justice/judiciary (system of justice)/lawyer/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/crime,%20law%20and%20justice/judiciary%20(system%20of%20justice)/lawyer/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/human interest/people/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/human%20interest/people/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/social issue/family/marriage/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/social%20issue/family/marriage/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/social issue/family/divorce/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/social%20issue/family/divorce/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/social issue/abusive behaviour/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/social%20issue/abusive%20behaviour/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/02002001/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/02002001/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/08003000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/08003000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/14006003/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/14006003/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/14006004/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/14006004/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/14022000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/14022000/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Splash News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Splash%20News/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/date night/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/date%20night/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/divorce attorney/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/divorce%20attorney/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/sex harassment scandal/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/sex%20harassment%20scandal/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/mother lives/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/mother%20lives/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/divorce filing/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/divorce%20filing/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/extreme anger/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/extreme%20anger/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/long-suffering wife/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/long-suffering%20wife/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/native country/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/native%20country/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/prep school/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/prep%20school/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/New York Post Company/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/New%20York%20Post%20Company/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Lincoln Center/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Lincoln%20Center/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/William D. Zabel/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/William%20D.%20Zabel/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Jack/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Jack/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Emily Smith/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Emily%20Smith/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Annette Roque/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Annette%20Roque/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Romy/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Romy/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Matthew Todd Lauer/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Matthew%20Todd%20Lauer/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Thijs/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Thijs/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Nancy Chemtob/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Nancy%20Chemtob/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/New York/New York/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/New%20York/New%20York/',
                            'otcaConfidence': 85.3394,
                            'otcaRelevancy': 49.3221,
                            'otcaFrequency': 2,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 40.714167,
                                'longitude': -74.006111
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/New York/Manhattan/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/New%20York/Manhattan/',
                            'otcaConfidence': 83.2156,
                            'otcaRelevancy': 71,
                            'otcaFrequency': 3,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 40.783333,
                                'longitude': -73.966111
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Kingdom of the Netherlands/North Holland/Amsterdam/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Kingdom%20of%20the%20Netherlands/North%20Holland/Amsterdam/',
                            'otcaConfidence': 80.3547,
                            'otcaRelevancy': 55.4821,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 52.373056,
                                'longitude': 4.9
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Netherlands/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Netherlands/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 79.6519,
                            'otcaRelevancy': 86.6929,
                            'otcaFrequency': 6,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 75,
                            'otcaRelevancy': 56.178,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/New York/New York/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/New%20York/New%20York/',
                            'otcaConfidence': 85.3394,
                            'otcaRelevancy': 49.3221,
                            'otcaFrequency': 2,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 40.714167,
                                'longitude': -74.006111
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/New York/Manhattan/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/New%20York/Manhattan/',
                            'otcaConfidence': 83.2156,
                            'otcaRelevancy': 71,
                            'otcaFrequency': 3,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 40.783333,
                                'longitude': -73.966111
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Western Europe/Kingdom of the Netherlands/North Holland/Amsterdam/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Western%20Europe/Kingdom%20of%20the%20Netherlands/North%20Holland/Amsterdam/',
                            'otcaConfidence': 80.3547,
                            'otcaRelevancy': 55.4821,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 52.373056,
                                'longitude': 4.9
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Western Europe/Netherlands/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Europe/NOSUBCONTINENT/Western%20Europe/Netherlands/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 79.6519,
                            'otcaRelevancy': 86.6929,
                            'otcaFrequency': 6,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 75,
                            'otcaRelevancy': 56.178,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/couriermail.com.au/Entertainment - syndicated/Life/hooks up and break ups/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Entertainment%20-%20syndicated/Life/hooks%20up%20and%20break%20ups/',
                            'id': '1226751327034',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Entertainment - syndicated/Life/hooks up and break ups/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Entertainment%20-%20syndicated/Life/hooks%20up%20and%20break%20ups/',
                            'id': '1226751327037',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Entertainment - syndicated/Life/hooks up and break ups/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Entertainment%20-%20syndicated/Life/hooks%20up%20and%20break%20ups/',
                            'id': '1226751327427',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Entertainment - syndicated/Life/hooks up and break ups/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Entertainment%20-%20syndicated/Life/hooks%20up%20and%20break%20ups/',
                            'id': '1226751327036',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Entertainment - syndicated/Life/hooks up and break ups/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Entertainment%20-%20syndicated/Life/hooks%20up%20and%20break%20ups/',
                            'id': '1226751327038',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/Celebrity Life/hook ups and break ups/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/Celebrity%20Life/hook%20ups%20and%20break%20ups/',
                            'id': '1226751315778',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226646434873',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226617389624',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226617389621',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226597362952',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226617389623',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/Celebrity Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/Celebrity%20Life/',
                            'id': '1226072982788',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369329',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935502',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369324',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935504',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226588210335',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369322',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935507',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/',
                            'id': '1111112062929',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226637326589',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935503',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935505',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935506',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'Splash News',
                        'date night',
                        'divorce attorney',
                        'sex harassment scandal',
                        'mother lives',
                        'divorce filing',
                        'extreme anger',
                        'long-suffering wife',
                        'native country',
                        'prep school',
                        'New York',
                        'United States of America',
                        'Northern America',
                        'North America',
                        'America',
                        'Manhattan',
                        'Amsterdam',
                        'North Holland',
                        'Kingdom of the Netherlands',
                        'Western Europe',
                        'Europe',
                        'Netherlands',
                        'New York Post Company',
                        'Lincoln Center',
                        'William D. Zabel',
                        'Jack',
                        'Emily Smith',
                        'Annette Roque',
                        'Romy',
                        'Matthew Todd Lauer',
                        'Thijs',
                        'Nancy Chemtob'
                    ],
                    'authors': [
                        'Bailee Dean'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '0b5c908001827d7fa4d2296bea10bd96',
                                'link': 'http://cdn.newsapi.com.au/content/v2/0b5c908001827d7fa4d2296bea10bd96'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-bcbf3e438854507ba5e63b73e6926fd0',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '42927cc067d56c6b210dfb6800dfde55',
                                'link': 'http://cdn.newsapi.com.au/content/v2/42927cc067d56c6b210dfb6800dfde55'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-3aa1a3e70a2f2719b9daed14b180c676',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'e7e371e19425d7f827247f27500f0770',
                                'link': 'http://cdn.newsapi.com.au/content/v2/e7e371e19425d7f827247f27500f0770'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-c55845b057e1776d839c8a408821ab8c',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '32b2c1fd01cdd4d55b0e81fe7b55934c',
                                'link': 'http://cdn.newsapi.com.au/content/v2/32b2c1fd01cdd4d55b0e81fe7b55934c'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-84800d3c482be63dc13a22e3959a9b0b',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '2a9329aa03953d6c9ba5e8a461be2234',
                                'link': 'http://cdn.newsapi.com.au/content/v2/2a9329aa03953d6c9ba5e8a461be2234'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-53eea81188828a4ad25afddcf1bfe066',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '213b25e0da15ae7b07a05b079730d699',
                                'link': 'http://cdn.newsapi.com.au/content/v2/213b25e0da15ae7b07a05b079730d699'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-a137ac58a919005a9956452fa6668574',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '3b1aae90244be3a5e3cfc139a2909bac',
                                'link': 'http://cdn.newsapi.com.au/content/v2/3b1aae90244be3a5e3cfc139a2909bac'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-2115feefc04752f959622fc154604d4c',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'f6a0177c4741ff63974be1ae5affb838',
                                'link': 'http://cdn.newsapi.com.au/content/v2/f6a0177c4741ff63974be1ae5affb838'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-ca9f4cc65298682cd2add2636ae16a31',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '66128918f5e5d0e9a68e9800ef35f96f',
                                'link': 'http://cdn.newsapi.com.au/content/v2/66128918f5e5d0e9a68e9800ef35f96f'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-f0de87a91fb3572b74ec3413167000f5',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'd3cb38a3a152dfa3d7c5aa1e65271e49',
                                'link': 'http://cdn.newsapi.com.au/content/v2/d3cb38a3a152dfa3d7c5aa1e65271e49'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': 40.714167,
                            'longitude': -74.006111
                        },
                        {
                            'latitude': 40.783333,
                            'longitude': -73.966111
                        },
                        {
                            'latitude': 52.373056,
                            'longitude': 4.9
                        }
                    ],
                    'socialTitle': 'Lauer’s wife’s has reportedly fled the country',
                    'seoHeadline': 'Matt Lauer allegations: Wife flees to Netherlands with children',
                    'userOriginUpdated': 'coyb',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'lasers-wife-reportedly-fled-to-netherlands-with-their-children',
                    'revision': 3,
                    'body': 'According to the New York Post, sources have said the Dutch-born former model Annette — Lauer’s wife of 20 years — was last seen at their Hamptons home on Wednesday, the day Lauer’s firing was announced.\n\nOne Hamptons source told Page Six, “Annette has taken their two younger kids out of school and is believed to have left the US and gone to her family in her native country.” It is believed her mother lives near Amsterdam.\n\nAmid the scandal, Annette has remained silent. She and Lauer have three children, Romy, 14, son Thijs, 11, and their oldest son Jack, who is at a prep school outside Manhattan. \n\nIt is not known if the kids are with Annette or remained at home with Lauer.\n\nReps for Lauer have repeatedly declined to comment on the state of his marriage or the whereabouts of his wife.\n\nAnnette briefly filed for divorce in 2006, claiming she suffered “cruel and inhumane” treatment from Lauer, who she said in legal documents was controlling and demonstrated “extreme anger and hostility.” \n\nShe withdrew the divorce filing a month later.\n\nAnother source insisted the reason Annette withdrew her divorce filing is that Lauer offered her a postnuptial agreement at the time of the filing, offering her up to a rumoured $6.57 million deal to remain in the marriage.\n\nThe source said, “Matt needed to stay in the marriage to keep his reputation as America’s nicest dad. \n\n“He is in fact a great, and very doting dad to his kids, but he is also a terrible husband.”\n\nA rep for Lauer declined to comment about his wife, and the postnuptial, as did his high-powered lawyer William D. Zabel. \n\nRoque’s divorce lawyer Nancy Chemtob declined to comment.\n\nThis article was originally published on the New York Post and was republished here with permission. \n\n',
                    'standFirst': 'THE disgraced host’s wife has reportedly packed up and left to her native Netherlands with all three of their children. \n\n',
                    'kicker': 'She’s done',
                    'byline': 'Emily Smith',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [],
                    'bylineNames': [
                        'Emily Smith'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': 'e1e8f0319ce017d03a00661b2eac09b0',
                        'link': 'http://cdn.newsapi.com.au/content/v2/e1e8f0319ce017d03a00661b2eac09b0'
                    },
                    'originId': 'a4c57166-d81a-11e7-a38d-10a36ef4cb34',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Coalition gains ground on Labor',
                    'subtitle': 'Newspoll: Coalition gains ground on Labor with Turnbull still preferred prime minister',
                    'description': 'MALCOLM Turnbull has received a significant boost from Australian voters in the latest Newspoll with the Coalition regaining some of the ground it had lost.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/e1e8f0319ce017d03a00661b2eac09b0?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'News Corp Australia Network',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': 'a4c57166-d81a-11e7-a38d-10a36ef4cb34',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T19:58:57.000Z',
                    'dateLive': '2017-12-03T11:43:00.000Z',
                    'customDate': '2017-12-03T19:58:00.000Z',
                    'dateCreated': '2017-12-03T11:11:00.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '3e89ac907650d0b12918833ed3034ba2',
                            'link': 'http://cdn.newsapi.com.au/image/v1/3e89ac907650d0b12918833ed3034ba2'
                        },
                        'originId': 'crop-100ec756deb73b2ca3b10cbdadf4c4c2',
                        'origin': 'METHODE',
                        'title': 'Turnbull and Morrison',
                        'subtitle': 'b12102bc-d81b-11e7-a38d-10a36ef4cb34',
                        'description': 'PM Malcolm Turnbull speaking at a press conference in the PM Courtyard at Parliament House in Canberra. Picture Kym Smith',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/3e89ac907650d0b12918833ed3034ba2',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'News Corp Australia',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T12:24:46.000Z',
                        'dateLive': '2017-12-03T11:43:00.000Z',
                        'dateCreated': '2017-12-03T11:18:30.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'primaryCategory': {
                            'value': '/author/newscorpaustralia.com/Kym Smith/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Kym%20Smith/'
                        },
                        'categories': [
                            {
                                'value': '/author/newscorpaustralia.com/Kym Smith/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Kym%20Smith/'
                            },
                            {
                                'value': '/location/iptc.org/Australia/ACT/////',
                                'link': 'http://cdn.newsapi.com.au/category/v2/location/iptc.org/Australia/ACT/',
                                'selected': 'auto'
                            },
                            {
                                'value': '/countrycode/iptc.org/AUS/ACT/////',
                                'link': 'http://cdn.newsapi.com.au/category/v2/countrycode/iptc.org/AUS/ACT/',
                                'selected': 'auto'
                            }
                        ],
                        'keywords': [
                            'press conference',
                            'morrison',
                            'turnbull',
                            'Malcolm Bligh Turnbull',
                            'Kym Smith'
                        ],
                        'authors': [
                            'Kym Smith'
                        ],
                        'domains': [
                            'newscorpaustralia.com',
                            'weeklytimesnow.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'adelaidenow.com.au',
                            'heraldsun.com.au',
                            'ntnews.com.au',
                            'cairnspost.com.au',
                            'news.com.au',
                            'perthnow.com.au',
                            'townsvillebulletin.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'bakkert',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': 'b12102bcd81b11e7a38d10a36ef4cb34',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'Turnbull and Morrison',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': 'b12102bc-d81b-11e7-a38d-10a36ef4cb34',
                        'enterpriseAssetId': 'NEWSMMGLPICT000168840387',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'weeklytimesnow.com.au',
                            'link': 'http://www.weeklytimesnow.com.au/news/national/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        },
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/e1e8f0319ce017d03a00661b2eac09b0?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/news/national/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/news/national/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/news/national/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/news/national/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/news/national/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/news/national/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/news/national/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/national/politics/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/news/national/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/news/national/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/news/national/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/news/national/newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister/news-story/e1e8f0319ce017d03a00661b2eac09b0'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/National/Politics/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/National/Politics/',
                        'id': '1227222420849',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/National/Politics/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/National/Politics/',
                            'id': '1227222420849',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227222420849/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227222420849/',
                            'id': '1227222420849',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/National/',
                            'id': '1226490441611',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226490441611/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226490441611/',
                            'id': '1226490441611',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Tiffany Bakker/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Tiffany%20Bakker/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/politics/parties and movements/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/politics/parties%20and%20movements/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/politics/government/ministers (government)/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/politics/government/ministers%20(government)/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/politics/parliament/lower house/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/politics/parliament/lower%20house/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/politics/election/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/politics/election/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/11010000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/11010000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/11006009/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/11006009/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/11009002/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/11009002/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/11003000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/11003000/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/prime minister/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/prime%20minister/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/preferred prime minister/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/preferred%20prime%20minister/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/gains ground/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/gains%20ground/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/gain ground/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/gain%20ground/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/election promises/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/election%20promises/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Staff writers/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Staff%20writers/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/percentage points/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/percentage%20points/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/election victory/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/election%20victory/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/citizenship questions/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/citizenship%20questions/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/sex marriage/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/sex%20marriage/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Australian voters/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Australian%20voters/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Australian people/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Australian%20people/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/real investment/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/real%20investment/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Malcolm Bligh Turnbull/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Malcolm%20Bligh%20Turnbull/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Kym Smith/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Kym%20Smith/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Pauline Hanson/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Pauline%20Hanson/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Barnaby Joyce/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Barnaby%20Joyce/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Bill Shorten/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Bill%20Shorten/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Mick Tsikas/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Mick%20Tsikas/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Australia/Queensland/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Australia/Queensland/NOSUBURB/',
                            'otcaConfidence': 71.1564,
                            'otcaRelevancy': 44.1941,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia and New Zealand/Australia/Queensland/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/Oceania/NOSUBCONTINENT/Australia%20and%20New%20Zealand/Australia/Queensland/NOSUBURB/',
                            'otcaConfidence': 71.1564,
                            'otcaRelevancy': 44.1941,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/positive/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/positive/'
                        },
                        {
                            'value': '/display/news.com.au/National News/Politics/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/National%20News/Politics/',
                            'id': '1227222440425',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Network%20News/National/',
                            'id': '1226628352059',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Network%20News/National/',
                            'id': '1226692643376',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Network%20News/National/',
                            'id': '1226696905240',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Network%20News/National/',
                            'id': '1226596458827',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Network%20News/National/',
                            'id': '1226696905243',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/weeklytimesnow.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/weeklytimesnow.com.au/Network%20News/National/',
                            'id': '1226696905239',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/National News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/National%20News/',
                            'id': '1226312254910',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Network%20News/National/',
                            'id': '1226646734598',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Network%20News/National/',
                            'id': '1226696905241',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Network%20News/National/',
                            'id': '1226696905242',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Network%20News/National/',
                            'id': '1226618420664',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Network%20News/National/',
                            'id': '1226618420663',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Network%20News/National/',
                            'id': '1226683748532',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'prime minister',
                        'preferred prime minister',
                        'gains ground',
                        'gain ground',
                        'election promises',
                        'Staff writers',
                        'percentage points',
                        'election victory',
                        'citizenship questions',
                        'sex marriage',
                        'Australian voters',
                        'Australian people',
                        'real investment',
                        'Queensland',
                        'Australia',
                        'Australia and New Zealand',
                        'Oceania',
                        'Malcolm Bligh Turnbull',
                        'Kym Smith',
                        'Pauline Hanson',
                        'Barnaby Joyce',
                        'Bill Shorten',
                        'Mick Tsikas'
                    ],
                    'authors': [
                        'Tiffany Bakker'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'weeklytimesnow.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'adelaidenow.com.au',
                        'heraldsun.com.au',
                        'ntnews.com.au',
                        'cairnspost.com.au',
                        'news.com.au',
                        'perthnow.com.au',
                        'townsvillebulletin.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '3e89ac907650d0b12918833ed3034ba2',
                                'link': 'http://cdn.newsapi.com.au/content/v2/3e89ac907650d0b12918833ed3034ba2'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-100ec756deb73b2ca3b10cbdadf4c4c2',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '190119924c008891096347545372c0fd',
                                'link': 'http://cdn.newsapi.com.au/content/v2/190119924c008891096347545372c0fd'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-404def96d809e0526711e9121cf3a779',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '84a641ed5522968139daed2d4c4a3759',
                                'link': 'http://cdn.newsapi.com.au/content/v2/84a641ed5522968139daed2d4c4a3759'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-34f2b05f5d88702d14a311515617c5ec',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '17d142bda6e6b36cf113cb1d2bfac9e6',
                                'link': 'http://cdn.newsapi.com.au/content/v2/17d142bda6e6b36cf113cb1d2bfac9e6'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-673d1f5c5ebc4ebd221e51312148a5c8',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '1afb8b38eaf9717590380debb3a7e6d7',
                                'link': 'http://cdn.newsapi.com.au/content/v2/1afb8b38eaf9717590380debb3a7e6d7'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-b6d1f66a36f563d3d0da26d5ecbed653',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'da6c70f9cd7e4ea99ae498b8140fccc3',
                                'link': 'http://cdn.newsapi.com.au/content/v2/da6c70f9cd7e4ea99ae498b8140fccc3'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-4116fed545f15cc50b25e7d48b8aee66',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '1f9bf664370afc30ea6bdd5aadbdc5d7',
                                'link': 'http://cdn.newsapi.com.au/content/v2/1f9bf664370afc30ea6bdd5aadbdc5d7'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-7af7b0205d893b9611cc13e2340bc31d',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'b0ba435ba68edb02ed0ebdc64f449113',
                                'link': 'http://cdn.newsapi.com.au/content/v2/b0ba435ba68edb02ed0ebdc64f449113'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-c9f8a6b564ff5661572b116a8b9e517a',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '5210b82d78dc21d22b9cc30ba5e51107',
                                'link': 'http://cdn.newsapi.com.au/content/v2/5210b82d78dc21d22b9cc30ba5e51107'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-9a6e88698d43c24c7688b18a6754eb43',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '5df11cdc178945cd35d44699274fdb86',
                                'link': 'http://cdn.newsapi.com.au/content/v2/5df11cdc178945cd35d44699274fdb86'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '6c5d350a5535edd72276f87667094473',
                                'link': 'http://cdn.newsapi.com.au/content/v2/6c5d350a5535edd72276f87667094473'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [],
                    'socialTitle': 'Coalition gains ground on Labor',
                    'seoHeadline': 'Newspoll: Coalition gains ground on Labor with Turnbull still preferred prime minister',
                    'userOriginUpdated': 'bakkert',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'newspoll-coalition-gains-ground-on-labor-with-turnbull-still-preferred-prime-minister',
                    'revision': 3,
                    'body': 'The last Newspoll, conducted by The Australian, showed Labor in front by 55 to 45 per cent. The numbers are now 53 to 47 per cent.\n\nIn other good news for Mr Turnbull, he has increased his lead over Bill Shorten as the country’s preferred prime minister with the gap now at 39 to 33 per cent. \n\nIt halts a rocky few months for the government as parliament begins again on Monday with same sex marriage and citizenship questions facing many MPs on the agenda.\n\nThe Coalition’s primary vote has improved from 34 to 36 per cent over three weeks. \n\nMr Turnbull yesterday spoke to The Australian about the “tough issues” facing the government. \n\nPM vows to lead Coalition to election victory \n\n“When you mark down what we have achieved, you can see that step by step, we’re getting barnacles off the boat, we’re making real changes resulting in real jobs and real investment,” the Prime Minister said.\n\nHe said he didn’t “run the government based on the Newspoll” and said nobody could claim he had broken any election promises.\n\n“I have every confidence, every confidence, that I will lead the Coalition to the next election in 2019 and we will win it, because we are putting in place the policies that will deliver for the Australian people,” he said.\n\nLabor retains a strong lead over the Coalition and would take power with an advantage of more than a dozen seats if the latest Newspoll was repeated at an election, but the new figures show an improvement for Mr Turnbull and his government after weeks of terrible results.\n\nBut it’s more bad news for Pauline Hanson’s One Nation party after it captured a single seat in the Queensland election, it has seen its federal primary vote fall from 10 to 8 per cent as some voters swung back to the Coalition.\n\nLabor has fallen to a primary vote of 37 per cent, down one percentage points over three weeks, while the Greens have increased their support by the same amount to 10 per cent.\n\nThe latest result is a rare lift in the Coalition’s primary vote this year, on par with a two-point gain at the end of August but smaller than its three-point gain in late February.\n\nThis story was originally published in The Australian and is reprinted with permission.\n\n',
                    'standFirst': 'MALCOLM Turnbull received an unexpected lift from Aussie voters as the Coalition closed the gap on Labor in the latest Newspoll.\n\n',
                    'kicker': 'Newspoll',
                    'byline': 'Staff writers',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [],
                    'bylineNames': [
                        'Staff writers'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': '31e0e5512eef4f0e422567f503189685',
                        'link': 'http://cdn.newsapi.com.au/content/v2/31e0e5512eef4f0e422567f503189685'
                    },
                    'originId': 'ad431a84-d7c3-11e7-b5a9-0fbc45dc1ac5',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Salim’s race to find $1 million',
                    'subtitle': 'Is bankruptcy next step for Salim? Marble staircase stoush headed for court, reports',
                    'description': 'LIFE’S never dull for controversial businessman and former Auburn deputy mayor Salim Mehajer.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/31e0e5512eef4f0e422567f503189685?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'news.com.au',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': 'ad431a84-d7c3-11e7-b5a9-0fbc45dc1ac5',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T01:45:48.000Z',
                    'dateLive': '2017-12-03T01:45:00.000Z',
                    'customDate': '2017-12-03T01:45:00.000Z',
                    'dateCreated': '2017-12-03T00:48:28.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '3721989db904a839f16efcb524cb78b1',
                            'link': 'http://cdn.newsapi.com.au/image/v1/3721989db904a839f16efcb524cb78b1'
                        },
                        'originId': 'crop-bc6fc532805499fddb676005f6749ea8',
                        'origin': 'METHODE',
                        'title': 'Former Auburn Deputy Mayor Salim Mehajer leaves Burwood Local Court after being granted bail in Sydney, Monday, November 20, 2017. Mehajer was arrested over night after breaching an AVO but was granted bail this afternoon. (AAP Image/Dean Lewins) NO ARCHIVING',
                        'subtitle': 'db72c4fa-d7c2-11e7-b5a9-0fbc45dc1ac5',
                        'description': 'Former Auburn Deputy Mayor Salim Mehajer leaves Burwood Local Court after being granted bail in Sydney, Monday, November 20, 2017. Mehajer was arrested over night after breaching an AVO but was granted bail this afternoon. (AAP Image/Dean Lewins) NO ARCHIVING',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/3721989db904a839f16efcb524cb78b1',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'AAP',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T00:42:38.000Z',
                        'dateLive': '2017-12-03T01:45:00.000Z',
                        'dateCreated': '2017-12-03T00:42:36.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'primaryCategory': {
                            'value': '/author/newscorpaustralia.com/DEAN LEWINS/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/DEAN%20LEWINS/'
                        },
                        'categories': [
                            {
                                'value': '/author/newscorpaustralia.com/DEAN LEWINS/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/DEAN%20LEWINS/'
                            },
                            {
                                'value': '/location/iptc.org/AUSTRALIA/NSW/Sydney/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/location/iptc.org/AUSTRALIA/NSW/Sydney/',
                                'selected': 'auto'
                            },
                            {
                                'value': '/countrycode/iptc.org/AUS/NSW/Sydney/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/countrycode/iptc.org/AUS/NSW/Sydney/',
                                'selected': 'auto'
                            }
                        ],
                        'keywords': [
                            'granted bail',
                            'Auburn Deputy Mayor',
                            'granted',
                            'bail',
                            'Local Court',
                            'Salim Mehajer',
                            'Dean Lewins'
                        ],
                        'authors': [
                            'DEAN LEWINS'
                        ],
                        'domains': [
                            'newscorpaustralia.com',
                            'weeklytimesnow.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'adelaidenow.com.au',
                            'heraldsun.com.au',
                            'ntnews.com.au',
                            'cairnspost.com.au',
                            'news.com.au',
                            'perthnow.com.au',
                            'townsvillebulletin.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'murrayo',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': 'db72c4fad7c211e7b5a90fbc45dc1ac5',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'SALIM MEHAJER ARREST',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': 'db72c4fa-d7c2-11e7-b5a9-0fbc45dc1ac5',
                        'enterpriseAssetId': 'NEWSMMGLPICT000168358545',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'weeklytimesnow.com.au',
                            'link': 'http://www.weeklytimesnow.com.au/news/national/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        },
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/31e0e5512eef4f0e422567f503189685?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/news/national/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/news/national/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/news/national/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/news/national/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/news/national/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/news/national/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/news/national/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/national/courts-law/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/news/national/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/news/national/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/news/national/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/news/national/is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports/news-story/31e0e5512eef4f0e422567f503189685'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/National/Courts & Law/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/National/Courts%20&%20Law/',
                        'id': '1227222433209',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/National/Courts & Law/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/National/Courts%20&%20Law/',
                            'id': '1227222433209',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227222433209/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227222433209/',
                            'id': '1227222433209',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/National/',
                            'id': '1226490441611',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226490441611/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226490441611/',
                            'id': '1226490441611',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Network News/National/news.com.auNSW/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Network%20News/National/news.com.auNSW/',
                            'id': '1226683638751',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226683638751/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226683638751/',
                            'id': '1226683638751',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Debbie Schipp/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Debbie%20Schipp/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/economy, business and finance/company information/bankruptcy/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/economy,%20business%20and%20finance/company%20information/bankruptcy/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/social issue/family/marriage/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/social%20issue/family/marriage/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/04016007/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/04016007/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/14006003/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/14006003/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/marble staircase/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/marble%20staircase/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/lavish wedding/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/lavish%20wedding/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/granted bail/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/granted%20bail/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/lavish marble staircase/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/lavish%20marble%20staircase/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Marble staircase stoush/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Marble%20staircase%20stoush/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/house arrest/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/house%20arrest/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/music video clip/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/music%20video%20clip/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/property developments/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/property%20developments/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/notice set/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/notice%20set/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/unpaid tax debts/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/unpaid%20tax%20debts/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/court battles/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/court%20battles/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/bankruptcy proceedings/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/bankruptcy%20proceedings/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/newspaper reports/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/newspaper%20reports/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/bankruptcy notice/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/bankruptcy%20notice/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/deputy mayor/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/deputy%20mayor/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/business empire/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/business%20empire/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/luxury cars/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/luxury%20cars/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Prime Marble & Granite/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Prime%20Marble%20&%20Granite/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Judge Judith Gibson/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Judge%20Judith%20Gibson/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 75,
                            'otcaRelevancy': 53.6212,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/NOPROVINCESTATE/NOSUBURB/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/NOPROVINCESTATE/NOSUBURB/',
                            'otcaConfidence': 75,
                            'otcaRelevancy': 53.6212,
                            'otcaFrequency': 1,
                            'selected': 'auto'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/news.com.au/National News/Courts & Law/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/National%20News/Courts%20&%20Law/',
                            'id': '1227222455615',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Network%20News/National/',
                            'id': '1226628352059',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Network%20News/National/',
                            'id': '1226692643376',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Network%20News/National/',
                            'id': '1226696905240',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Network%20News/National/',
                            'id': '1226596458827',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Network%20News/National/',
                            'id': '1226696905243',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/weeklytimesnow.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/weeklytimesnow.com.au/Network%20News/National/',
                            'id': '1226696905239',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/National News/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/National%20News/',
                            'id': '1226312254910',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Network%20News/National/',
                            'id': '1226646734598',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Network%20News/National/',
                            'id': '1226696905241',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Network%20News/National/',
                            'id': '1226696905242',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Network%20News/National/',
                            'id': '1226618420664',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Network%20News/National/',
                            'id': '1226618420663',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Network News/National/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Network%20News/National/',
                            'id': '1226683748532',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/National News/NSW/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/National%20News/NSW/',
                            'id': '1226683644802',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'marble staircase',
                        'lavish wedding',
                        'granted bail',
                        'lavish marble staircase',
                        'Marble staircase stoush',
                        'house arrest',
                        'music video clip',
                        'property developments',
                        'notice set',
                        'unpaid tax debts',
                        'court battles',
                        'bankruptcy proceedings',
                        'newspaper reports',
                        'bankruptcy notice',
                        'deputy mayor',
                        'business empire',
                        'luxury cars',
                        'United States of America',
                        'Northern America',
                        'North America',
                        'America',
                        'Prime Marble & Granite',
                        'Judge Judith Gibson'
                    ],
                    'authors': [
                        'Debbie Schipp'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'weeklytimesnow.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'adelaidenow.com.au',
                        'heraldsun.com.au',
                        'ntnews.com.au',
                        'cairnspost.com.au',
                        'news.com.au',
                        'perthnow.com.au',
                        'townsvillebulletin.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '3721989db904a839f16efcb524cb78b1',
                                'link': 'http://cdn.newsapi.com.au/content/v2/3721989db904a839f16efcb524cb78b1'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-bc6fc532805499fddb676005f6749ea8',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '33ca21e3ec46af886c1225d9e4d89f6d',
                                'link': 'http://cdn.newsapi.com.au/content/v2/33ca21e3ec46af886c1225d9e4d89f6d'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-b21c2f5e3ca1de1f423109d4fea1bb3a',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'df54f2ee58443274fc5aa4bb8fc92c96',
                                'link': 'http://cdn.newsapi.com.au/content/v2/df54f2ee58443274fc5aa4bb8fc92c96'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-fe4bf720281c22e81e957ba75168ad3d',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '0f55bd929ae78049abdca355b8dc7736',
                                'link': 'http://cdn.newsapi.com.au/content/v2/0f55bd929ae78049abdca355b8dc7736'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-04a33b8a8a01b791e1d980b7728aec86',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '44f6c73e7862893ddb46e587e7fd0ea8',
                                'link': 'http://cdn.newsapi.com.au/content/v2/44f6c73e7862893ddb46e587e7fd0ea8'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-3fe5fbcf19df285af7e31ff8d9af04e1',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'ba33ad68369586f310b027ddff91f5aa',
                                'link': 'http://cdn.newsapi.com.au/content/v2/ba33ad68369586f310b027ddff91f5aa'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-38de592adcc698c1428ea87bc3a11fed',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '921d41c0c8444ff31573673163d6dafa',
                                'link': 'http://cdn.newsapi.com.au/content/v2/921d41c0c8444ff31573673163d6dafa'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-2b0efaee0407462f081fe7fe69932c1a',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'd2065b5eadae430c38d6390bd09ae407',
                                'link': 'http://cdn.newsapi.com.au/content/v2/d2065b5eadae430c38d6390bd09ae407'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-d7149f29426b40a3f306e7e7c7f349dd',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '724114a0905762deb0d0055b58514f68',
                                'link': 'http://cdn.newsapi.com.au/content/v2/724114a0905762deb0d0055b58514f68'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-c14447d53a598f6f8805457b4b7dcf0d',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'ff1ef4667ba0dcae93a6cc26ffe8eee6',
                                'link': 'http://cdn.newsapi.com.au/content/v2/ff1ef4667ba0dcae93a6cc26ffe8eee6'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [],
                    'seoHeadline': 'Salim Mehajer bankruptcy threat in battle over marble staircase',
                    'userOriginUpdated': 'murrayo',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'is-bankruptcy-next-step-for-salim-marble-staircase-stoush-headed-for-court-reports',
                    'revision': 1,
                    'body': 'On top of facing a series of court battles over everything from his former relationship to his crumbling business empire, now he can reportedly add the threat of bankruptcy to the list.\n\nThe 31-year-old is currently under “virtual house arrest” and facing charges of breaching an AVO taken out by ex-wife Aysha, committing electoral fraud and civil cases about his property developments.\n\nNow, he has been threatened with bankruptcy unless he coughs up $1 million in the next fortnight to pay for a lavish marble staircase in his ostentatious Lidcombe home, according to The Sunday Telegraph.\n\nThe floating staircase inside his $3 million home featured in a music video clip for US rapper Bow Wow.\n\nThe marble marvel was made by Prime Marble & Granite, but Mehajer did not pay the invoice of $596,178, the newspaper reports.\n\nThe Greenacre company sued him and won, with NSW District Court Judge Judith Gibson in October ordering Mehajer to pay up to almost $1 million — the cost of the staircase and about $400,000 to cover Prime Marble’s court costs.\n\nMehajer was served a bankruptcy notice on November 3 after failing to pay, and has until December 12 to pay up, according to The Sunday Telegraph.\n\nHe’s been given until December 12 to pay the $1 million or be made the subject of bankruptcy proceedings in time for Christmas. But Mehajer is understood to be fighting the move, with a Federal Circuit Court date for a hearing to have the notice set aside.\n\nMehajer’s parents declared themselves bankrupt in December 2016 after allegedly clocking up $10 million in unpaid tax debts.\n\nMehajer’s lavish house was the backdrop for his extravagant wedding to his now-estranged wife Aysha Learmonth in August 2015. It was the so-called ‘wedding of the century’, which shut down a suburb and involved four helicopters, a jet, a private sea plane and a motorcade of luxury cars and motorbikes.\n\n',
                    'standFirst': 'SALIM Mehajer has 14 days to find $1 million to pay for a marble staircase in his home in another legal drama for the property developer.\n\n',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [
                        'b64b378cd32323c928a4caf03be83ec9'
                    ],
                    'bylineNames': [],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': '2a2e44f617666455692e2d9fff66fb7a',
                        'link': 'http://cdn.newsapi.com.au/content/v2/2a2e44f617666455692e2d9fff66fb7a'
                    },
                    'originId': '712f32fa-d7a8-11e7-b5a9-0fbc45dc1ac5',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Top Gear star defends gay joke',
                    'subtitle': 'Richard Hammond defends his controversial joke',
                    'description': 'RICHARD Hammond has spoken out after a controversial joke he made last year about ice cream being “gay”.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/2a2e44f617666455692e2d9fff66fb7a?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'The Sun',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': '712f32fa-d7a8-11e7-b5a9-0fbc45dc1ac5',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T20:29:15.000Z',
                    'dateLive': '2017-12-02T21:48:00.000Z',
                    'customDate': '2017-12-03T20:29:00.000Z',
                    'dateCreated': '2017-12-02T21:33:31.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '6b47a1070f8d20ad702ff60a7512ddc8',
                            'link': 'http://cdn.newsapi.com.au/image/v1/6b47a1070f8d20ad702ff60a7512ddc8'
                        },
                        'originId': 'crop-7effbe2e378ce718a0dbaf0bc733bf84',
                        'origin': 'METHODE',
                        'title': 'Richard Hammond\nTop Gear Top Fails\nDec 29, 6.30pm, BBC Knowledge\n Picture: Bbc',
                        'subtitle': '67ba9d36-d7a8-11e7-b5a9-0fbc45dc1ac5',
                        'description': 'Richard Hammond\nTop Gear Top Fails\nDec 29, 6.30pm, BBC Knowledge\n Picture: Bbc',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/6b47a1070f8d20ad702ff60a7512ddc8',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'Supplied',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-03T20:14:10.000Z',
                        'dateLive': '2017-12-02T21:48:00.000Z',
                        'dateCreated': '2017-12-02T21:33:15.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'categories': [],
                        'keywords': [
                            'Gear Top Fails',
                            'Top Gear',
                            'Dec 29',
                            '6.30pm',
                            'Knowledge',
                            'Picture',
                            'bbc',
                            'fails',
                            'BBC Four',
                            'Richard Hammond'
                        ],
                        'authors': [],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'couriermail.com.au',
                            'goldcoastbulletin.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'coyb',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '67ba9d36d7a811e7b5a90fbc45dc1ac5',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'Richard Hammond\nTop Gear Top Fails\nDec 29, 6.30pm, BBC Knowledge\n Picture: Bbc',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '67ba9d36-d7a8-11e7-b5a9-0fbc45dc1ac5',
                        'enterpriseAssetId': 'NEWSMMGLPICT000043943323',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/2a2e44f617666455692e2d9fff66fb7a?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/entertainment/television/richard-hammond-defends-his-controversial-joke/news-story/2a2e44f617666455692e2d9fff66fb7a'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/entertainment/television/richard-hammond-defends-his-controversial-joke/news-story/2a2e44f617666455692e2d9fff66fb7a'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/entertainment/television/richard-hammond-defends-his-controversial-joke/news-story/2a2e44f617666455692e2d9fff66fb7a'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/entertainment/television/richard-hammond-defends-his-controversial-joke/news-story/2a2e44f617666455692e2d9fff66fb7a'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/entertainment/television/richard-hammond-defends-his-controversial-joke/news-story/2a2e44f617666455692e2d9fff66fb7a'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/entertainment/television/richard-hammond-defends-his-controversial-joke/news-story/2a2e44f617666455692e2d9fff66fb7a'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/entertainment/television/richard-hammond-defends-his-controversial-joke/news-story/2a2e44f617666455692e2d9fff66fb7a'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/entertainment/tv/flashback/richard-hammond-defends-his-controversial-joke/news-story/2a2e44f617666455692e2d9fff66fb7a'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/entertainment/television/richard-hammond-defends-his-controversial-joke/news-story/2a2e44f617666455692e2d9fff66fb7a'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/entertainment/television/richard-hammond-defends-his-controversial-joke/news-story/2a2e44f617666455692e2d9fff66fb7a'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/entertainment/television/richard-hammond-defends-his-controversial-joke/news-story/2a2e44f617666455692e2d9fff66fb7a'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/entertainment/television/richard-hammond-defends-his-controversial-joke/news-story/2a2e44f617666455692e2d9fff66fb7a'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Television/Flashback/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Television/Flashback/',
                        'id': '1227086532813',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Television/Flashback/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Television/Flashback/',
                            'id': '1227086532813',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1227086532813/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1227086532813/',
                            'id': '1227086532813',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Television/',
                            'id': '1226494599190',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226494599190/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226494599190/',
                            'id': '1226494599190',
                            'isDominant': false
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/',
                            'id': '1226494497264',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226494497264/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226494497264/',
                            'id': '1226494497264',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Bailee Dean/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Bailee%20Dean/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/arts, culture and entertainment/television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/arts,%20culture%20and%20entertainment/television/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/01016000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/01016000/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/controversial gay joke/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/controversial%20gay%20joke/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/controversial joke/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/controversial%20joke/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/controversial comment/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/controversial%20comment/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/ice cream/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/ice%20cream/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/dinner party/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/dinner%20party/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/interesting thing/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/interesting%20thing/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Grand Tour/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Grand%20Tour/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/defends controversial gay/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/defends%20controversial%20gay/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/star defends/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/star%20defends/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/gay ice-cream joke/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/gay%20ice-cream%20joke/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/boundaries type way/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/boundaries%20type%20way/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/News Corporation/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/News%20Corporation/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/British Broadcasting Corporation/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/British%20Broadcasting%20Corporation/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Olly Alexander/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Olly%20Alexander/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Richard Hammond/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Richard%20Hammond/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Jeremy Clarkson/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Jeremy%20Clarkson/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Ricky Gervais/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Ricky%20Gervais/otca/'
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/TV/Flashback/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/TV/Flashback/',
                            'id': '1227086527095',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Entertainment - syndicated/Television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Entertainment%20-%20syndicated/Television/',
                            'id': '1226617421843',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Entertainment - syndicated/Television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Entertainment%20-%20syndicated/Television/',
                            'id': '1228018416490',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Entertainment - syndicated/Television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Entertainment%20-%20syndicated/Television/',
                            'id': '1226617421844',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Entertainment - syndicated/Television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Entertainment%20-%20syndicated/Television/',
                            'id': '1228018416493',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Entertainment - syndicated/Television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Entertainment%20-%20syndicated/Television/',
                            'id': '1226597425949',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Entertainment - syndicated/Television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Entertainment%20-%20syndicated/Television/',
                            'id': '1226617421842',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Entertainment - syndicated/Television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Entertainment%20-%20syndicated/Television/',
                            'id': '1228018416491',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/TV/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/TV/',
                            'id': '1111112063226',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Entertainment - syndicated/Television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Entertainment%20-%20syndicated/Television/',
                            'id': '1226646458027',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Entertainment - syndicated/Television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Entertainment%20-%20syndicated/Television/',
                            'id': '1228018416488',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Entertainment - syndicated/Television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Entertainment%20-%20syndicated/Television/',
                            'id': '1228018416489',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Entertainment - syndicated/Television/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Entertainment%20-%20syndicated/Television/',
                            'id': '1228018416492',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369329',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935502',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369324',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935504',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226588210335',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369322',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935507',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/',
                            'id': '1111112062929',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226637326589',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935503',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935505',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935506',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'controversial gay joke',
                        'controversial joke',
                        'controversial comment',
                        'ice cream',
                        'dinner party',
                        'interesting thing',
                        'Grand Tour',
                        'defends controversial gay',
                        'star defends',
                        'gay ice-cream joke',
                        'boundaries type way',
                        'News Corporation',
                        'British Broadcasting Corporation',
                        'Olly Alexander',
                        'Richard Hammond',
                        'Jeremy Clarkson',
                        'Ricky Gervais'
                    ],
                    'authors': [
                        'Bailee Dean'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'couriermail.com.au',
                        'goldcoastbulletin.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '6b47a1070f8d20ad702ff60a7512ddc8',
                                'link': 'http://cdn.newsapi.com.au/content/v2/6b47a1070f8d20ad702ff60a7512ddc8'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-7effbe2e378ce718a0dbaf0bc733bf84',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '12a9d7c2565e3a6f3a768a1b22448cdd',
                                'link': 'http://cdn.newsapi.com.au/content/v2/12a9d7c2565e3a6f3a768a1b22448cdd'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-1e57c6347cc36a3d3cd354e6e9455f73',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'e9ffcb20bc757b9cd10b8a1172c51d94',
                                'link': 'http://cdn.newsapi.com.au/content/v2/e9ffcb20bc757b9cd10b8a1172c51d94'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-6e1e6c5115410799b96f968f8d551b12',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'd395d88da29f6fb712e52a07dec23de0',
                                'link': 'http://cdn.newsapi.com.au/content/v2/d395d88da29f6fb712e52a07dec23de0'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-c6f88975280af3b70b3ed37be2a8d396',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '7038c2c95c8a0b89efc172e8b9f6e2e9',
                                'link': 'http://cdn.newsapi.com.au/content/v2/7038c2c95c8a0b89efc172e8b9f6e2e9'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-afb1a84d6db4c99df79fd1f030b683b7',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '0bf6a9d8a706362af7c1927180d4bb0b',
                                'link': 'http://cdn.newsapi.com.au/content/v2/0bf6a9d8a706362af7c1927180d4bb0b'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-b2579a51966a6ae02c8a5f8b625b2499',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '093d5076db76fa87f9aa55e3d633d2f0',
                                'link': 'http://cdn.newsapi.com.au/content/v2/093d5076db76fa87f9aa55e3d633d2f0'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-e64fe61c19f06092ed010e02c6ee75ac',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '711c9a1cc8e342d538d12d0ba43122a7',
                                'link': 'http://cdn.newsapi.com.au/content/v2/711c9a1cc8e342d538d12d0ba43122a7'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-cb89942b8eda8729885ef33996a74073',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '930efacded1dc8aeed305362579284b3',
                                'link': 'http://cdn.newsapi.com.au/content/v2/930efacded1dc8aeed305362579284b3'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-9f0042be4b88e313aacf91b87160b78a',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '9a8712b063467fab48dc67708715bb0e',
                                'link': 'http://cdn.newsapi.com.au/content/v2/9a8712b063467fab48dc67708715bb0e'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [],
                    'socialTitle': 'Richard Hammond defends his controversial gay joke',
                    'seoHeadline': 'Rich Hammond, ‘Top Gear’: Defends gay ice-cream joke',
                    'userOriginUpdated': 'coyb',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'richard-hammond-defends-his-controversial-joke',
                    'revision': 3,
                    'body': 'According to The Sun, in December 2016 while on The Big Tour with fellow ex-Top Gear presenters Jeremy Clarkson and James May, Richard had announced that he didn’t want to eat ice cream, declaring: “I don’t eat ice cream,” replied Hammond. “It’s something to do with being straight. Ice cream is a bit — you know.”\n\nClarkson replied: “Are you saying everyone who likes ice cream ... you’re saying all children are homosexual?”\n\nHammond continues: “There’s nothing wrong with it ... it’s that way rather than that way. There’s nothing wrong with it, but a grown man eating an ice cream — it’s that way, rather than that way.”\n\nSpeaking in an interview with the Times Magazine this weekend, he commented that he didn’t think the comments, which were slammed by LGBT organisations, had discouraged people from coming out.\n\nHe commented: “It was certainly not what I set out to do. I wouldn’t want to cause genuine difficulty for anyone. But if it’s mock fury, pantomime fury from people looking to take offence then …\n\n“Anyone who knows me know that I was being serious, that I’m not homophobic. Love is love, whatever the sex of the two people in love.\n\n“It may be because I live in a hideously safe and contained middle class world, where a person’s sexuality is not an issue, but when I hear of people in the media coming out, I think, why do they even feel the need to mention it.\n\n“It is so old-fashioned to make a big deal of it. That isn’t even an interesting thing to say at a dinner party any more.”\n\nWhen asked if he had meant the comments in a Ricky Gervais, pushing the boundaries type way, Hammond replied: “I don’t think I can claim it was as carefully crafted as that.\n\n“I’m not a comic, and when I try to be funny it bites me on the arse.”\n\nSinger Olly Alexander tweeted at the time: “Really tho no wonder some straight guys are f***ed up they can’t even have ice cream.”\n\nThis article was originally published on The Sun and was republished here with permission. \n\n',
                    'standFirst': 'THE ex-Top Gear presenter says being gay ‘isn’t even an interesting thing to say’ anymore and doesn’t understand why people need to mention it. \n\n',
                    'kicker': 'Controversial joke',
                    'byline': 'Rosie Gizauskas',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [],
                    'bylineNames': [
                        'Rosie Gizauskas'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': '913800e7a1ce020a6b222ec6673a204c',
                        'link': 'http://cdn.newsapi.com.au/content/v2/913800e7a1ce020a6b222ec6673a204c'
                    },
                    'originId': '50522d6a-d77d-11e7-981c-07121f345a0f',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': '‘You know what you’re getting into’',
                    'subtitle': 'Pamela Anderson doubles down on controversial Harvey Weinstein victim comments',
                    'description': 'PAMELA Anderson says Harvey Weinstein’s victims should have known better — and even after a backlash against her comments, she’s still not apologising.\n\n',
                    'link': 'http://cdn.newsapi.com.au/link/913800e7a1ce020a6b222ec6673a204c?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'News Corp Australia Network',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': '50522d6a-d77d-11e7-981c-07121f345a0f',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T00:40:53.000Z',
                    'dateLive': '2017-12-02T22:33:00.000Z',
                    'customDate': '2017-12-03T00:40:00.000Z',
                    'dateCreated': '2017-12-02T16:24:47.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '303fcb249847d9bff2ad177b4885aba5',
                            'link': 'http://cdn.newsapi.com.au/image/v1/303fcb249847d9bff2ad177b4885aba5'
                        },
                        'originId': 'crop-5f9f7de31c14a3396ec5db83e514ee6a',
                        'origin': 'METHODE',
                        'title': 'US actress Pamela Anderson poses before attending the Rock My Swim by Mode City Paris fashion show in Paris on July 8, 2017. / AFP PHOTO / Thomas SAMSON',
                        'subtitle': '09ff8ae4-d780-11e7-981c-07121f345a0f',
                        'description': 'US actress Pamela Anderson poses before attending the Rock My Swim by Mode City Paris fashion show in Paris on July 8, 2017. / AFP PHOTO / Thomas SAMSON',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/303fcb249847d9bff2ad177b4885aba5',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'AFP',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-02T22:34:11.000Z',
                        'dateLive': '2017-12-02T22:33:00.000Z',
                        'dateCreated': '2017-12-02T16:44:18.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'primaryCategory': {
                            'value': '/author/newscorpaustralia.com/THOMAS SAMSON/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/THOMAS%20SAMSON/'
                        },
                        'categories': [
                            {
                                'value': '/author/newscorpaustralia.com/THOMAS SAMSON/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/THOMAS%20SAMSON/'
                            },
                            {
                                'value': '/location/iptc.org/FRANCE/Paris/Paris/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/location/iptc.org/FRANCE/Paris/Paris/',
                                'selected': 'auto'
                            },
                            {
                                'value': '/countrycode/iptc.org/FRA/Paris/Paris/',
                                'link': 'http://cdn.newsapi.com.au/category/v2/countrycode/iptc.org/FRA/Paris/Paris/',
                                'selected': 'auto'
                            }
                        ],
                        'keywords': [
                            'france-fashion',
                            'Pamela Anderson'
                        ],
                        'authors': [
                            'THOMAS SAMSON'
                        ],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'goldcoastbulletin.com.au',
                            'couriermail.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'delarochea',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '09ff8ae4d78011e7981c07121f345a0f',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'US actress Pamela Anderson poses before attending',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '09ff8ae4-d780-11e7-981c-07121f345a0f',
                        'enterpriseAssetId': 'NEWSMMGLPICT000160766791',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/913800e7a1ce020a6b222ec6673a204c?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/entertainment/celebrity/pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments/news-story/913800e7a1ce020a6b222ec6673a204c'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/entertainment/pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments/news-story/913800e7a1ce020a6b222ec6673a204c'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/entertainment/celebrity/pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments/news-story/913800e7a1ce020a6b222ec6673a204c'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/entertainment/celebrity/pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments/news-story/913800e7a1ce020a6b222ec6673a204c'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/entertainment/pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments/news-story/913800e7a1ce020a6b222ec6673a204c'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/entertainment/pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments/news-story/913800e7a1ce020a6b222ec6673a204c'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/entertainment/pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments/news-story/913800e7a1ce020a6b222ec6673a204c'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/entertainment/celebrity-life/pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments/news-story/913800e7a1ce020a6b222ec6673a204c'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/entertainment/celebrity/pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments/news-story/913800e7a1ce020a6b222ec6673a204c'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/entertainment/pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments/news-story/913800e7a1ce020a6b222ec6673a204c'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/entertainment/celebrity/pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments/news-story/913800e7a1ce020a6b222ec6673a204c'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/entertainment/pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments/news-story/913800e7a1ce020a6b222ec6673a204c'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Life/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Life/',
                        'id': '1226496181309',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/Life/',
                            'id': '1226496181309',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226496181309/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226496181309/',
                            'id': '1226496181309',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Entertainment%20-%20syndicated/',
                            'id': '1226494497264',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226494497264/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226494497264/',
                            'id': '1226494497264',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Tiffany Bakker/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Tiffany%20Bakker/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/arts, culture and entertainment/cinema/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/arts,%20culture%20and%20entertainment/cinema/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/economy, business and finance/media/cinema industry/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/economy,%20business%20and%20finance/media/cinema%20industry/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/economy, business and finance/tourism and leisure/hotel and accommodation/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/economy,%20business%20and%20finance/tourism%20and%20leisure/hotel%20and%20accommodation/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/01005000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/01005000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/04010003/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/04010003/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/04014002/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/04014002/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/victim comments/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/victim%20comments/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/hotel room/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/hotel%20room/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/film industry/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/film%20industry/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/growing number/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/growing%20number/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/disgraced movie mogul/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/disgraced%20movie%20mogul/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/sense measures/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/sense%20measures/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/New York Post Company/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/New%20York%20Post%20Company/otca/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Agence France Presse/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Agence%20France%20Presse/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Pamela Anderson/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Pamela%20Anderson/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Harvey Weinstein/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Harvey%20Weinstein/otca/'
                        },
                        {
                            'value': '/person/newscorpaustralia.com/Megyn Kelly/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/person/newscorpaustralia.com/Megyn%20Kelly/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/California/Hollywood/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/California/Hollywood/',
                            'otcaConfidence': 82.749,
                            'otcaRelevancy': 64.7186,
                            'otcaFrequency': 2,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 34.098333,
                                'longitude': -118.326667
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/California/Hollywood/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/California/Hollywood/',
                            'otcaConfidence': 82.749,
                            'otcaRelevancy': 64.7186,
                            'otcaFrequency': 2,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 34.098333,
                                'longitude': -118.326667
                            }
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/couriermail.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226646434873',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226617389624',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226617389621',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226597362952',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Entertainment - syndicated/Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Entertainment%20-%20syndicated/Life/',
                            'id': '1226617389623',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/Celebrity Life/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/Celebrity%20Life/',
                            'id': '1226072982788',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369329',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935502',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369324',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935504',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226588210335',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226617369322',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935507',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Entertainment/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Entertainment/',
                            'id': '1111112062929',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Entertainment%20-%20syndicated/',
                            'id': '1226637326589',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935503',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935505',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Entertainment - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Entertainment%20-%20syndicated/',
                            'id': '1227986935506',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'victim comments',
                        'hotel room',
                        'film industry',
                        'growing number',
                        'disgraced movie mogul',
                        'sense measures',
                        'Hollywood',
                        'California',
                        'United States of America',
                        'Northern America',
                        'North America',
                        'America',
                        'New York Post Company',
                        'Agence France Presse',
                        'Pamela Anderson',
                        'Harvey Weinstein',
                        'Megyn Kelly'
                    ],
                    'authors': [
                        'Tiffany Bakker'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'goldcoastbulletin.com.au',
                        'couriermail.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '303fcb249847d9bff2ad177b4885aba5',
                                'link': 'http://cdn.newsapi.com.au/content/v2/303fcb249847d9bff2ad177b4885aba5'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-5f9f7de31c14a3396ec5db83e514ee6a',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '60e864421e6be914def0b4c37d4f2087',
                                'link': 'http://cdn.newsapi.com.au/content/v2/60e864421e6be914def0b4c37d4f2087'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-9fe61be0216975f94493444cd453fc91',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '9133bc39ce707de0a9955b1084b860cd',
                                'link': 'http://cdn.newsapi.com.au/content/v2/9133bc39ce707de0a9955b1084b860cd'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-b5122f0637494a15dfccc3385db4bff2',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'c4204ded73488178b292fa5f897e1f08',
                                'link': 'http://cdn.newsapi.com.au/content/v2/c4204ded73488178b292fa5f897e1f08'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-384216a13bb4d73228a4e517d860e51a',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '74590c4ce5b3cf4ff637e3662bd9a183',
                                'link': 'http://cdn.newsapi.com.au/content/v2/74590c4ce5b3cf4ff637e3662bd9a183'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-4a09cff9a92eceff4547b2f70159a248',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '40fef2c3096f6deef9a0e31ca5111abb',
                                'link': 'http://cdn.newsapi.com.au/content/v2/40fef2c3096f6deef9a0e31ca5111abb'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-c1e2b7a049e7ff6ec9a49a5599dc5dc4',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '279b7d8eed7dd7d59a8a785cbd6b6337',
                                'link': 'http://cdn.newsapi.com.au/content/v2/279b7d8eed7dd7d59a8a785cbd6b6337'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-2b1bc1aa13ceca676faf85b5038ef899',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '1ee8981403b95ade4f98823157b97689',
                                'link': 'http://cdn.newsapi.com.au/content/v2/1ee8981403b95ade4f98823157b97689'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-fd795d40bdaad8c53c4becf160d532a0',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '9e41729bd8b018f4187e4d1d8bdc4da4',
                                'link': 'http://cdn.newsapi.com.au/content/v2/9e41729bd8b018f4187e4d1d8bdc4da4'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': 34.098333,
                            'longitude': -118.326667
                        }
                    ],
                    'seoHeadline': 'Pamela Anderson doubles down on controversial Harvey Weinstein victim comments',
                    'userOriginUpdated': 'delarochea',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'pamela-anderson-doubles-down-on-controversial-harvey-weinstein-victim-comments',
                    'revision': 3,
                    'body': 'The former Baywatch babe appeared on Megyn Kelly’s NBC show, telling her story of sexual abuse as a child and saying women shouldn’t blame themselves for being victimised, reports the New York Post. \n\nShe then seemed to contradict herself. When asked by Kelly about disgraced movie mogul Weinstein, Anderson stated, “I think it was common knowledge that certain producers or certain people in Hollywood [were] people to avoid, privately. You know what you’re getting into if you’re going into a hotel room alone.”\n\nWhen Kelly countered that many of the actors were sent by their agents, Anderson responded, “They should have sent somebody with them. I just think there’s easy ways to remedy that. That’s not a good excuse.”\n\nAnderson also said in the interview that she had been offered private auditions, condos and even Porsches. \n\n“Don’t go into a hotel room alone. If someone answers the door in a bathrobe, leave. Things that are common sense. I know Hollywood is very seductive and people want to be famous and sometimes you think you’re going to be safe with an adult in the room.”\n\nAs her comments provoked outrage, Anderson doubled down on her website. “I’m trying to tell women ... be proactive as an adult who knows better — in defending themselves. Don’t get in cars with strangers ... Don’t go to Hotel rooms alone for an audition.”\n\nShe continues, “To say I am victim blaming completely misconstrues my point. Victims are not to blame, they never are ... predators are always to blame — solely and entirely. That doesn’t mean we can’t take common sense measures to keep ourselves safe and avoid harmful situations.”\n\nAnderson, who is best friends with WikiLeaks founder Julian Assange, further claims people are after her because they are ­“anti-Wikileaks — and they probably want to discredit me.”\n\nThis article was first published in the New York Post. \n\n',
                    'standFirst': 'PAMELA Anderson said Harvey Weinstein’s victims should have known better — and even after a backlash against her comments, she’s still not apologising.\n\n',
                    'kicker': 'Doubles down',
                    'byline': 'New York Post',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [],
                    'bylineNames': [
                        'New York Post'
                    ],
                    'bylineTitles': [],
                    'bulletList': []
                },
                {
                    'contentType': 'NEWS_STORY',
                    'id': {
                        'value': 'b85a699328557d9410b0f03e66c17265',
                        'link': 'http://cdn.newsapi.com.au/content/v2/b85a699328557d9410b0f03e66c17265'
                    },
                    'originId': 'f1112ce0-d7b6-11e7-9755-aa5e1d28405b',
                    'origin': 'METHODE',
                    'channel': 'NONE',
                    'title': 'Courier driver’s disgusting act',
                    'subtitle': 'Amazon driver filmed going to the toilet on customer’s driveway',
                    'description': 'WHEN Nemy Bautista arrived to his Sacramento home on Tuesday, he found what appeared to be dog poo at the bottom of his driveway. \n\n',
                    'link': 'http://cdn.newsapi.com.au/link/b85a699328557d9410b0f03e66c17265?domain=newscorpaustralia.com',
                    'paidStatus': 'NON_PREMIUM',
                    'originalSource': 'Fox News',
                    'creditedSource': 'news.com.au',
                    'originalAssetId': 'f1112ce0-d7b6-11e7-9755-aa5e1d28405b',
                    'version': 'PUBLISHED',
                    'dateUpdated': '2017-12-03T20:15:18.000Z',
                    'dateLive': '2017-12-02T23:24:00.000Z',
                    'customDate': '2017-12-03T20:15:00.000Z',
                    'dateCreated': '2017-12-02T23:17:18.000Z',
                    'status': 'ACTIVE',
                    'referenceType': 'PRIMARY',
                    'thumbnailImage': {
                        'contentType': 'IMAGE',
                        'id': {
                            'value': '73f5f1b1ba956e2d7b71a8b78c34f4ae',
                            'link': 'http://cdn.newsapi.com.au/image/v1/73f5f1b1ba956e2d7b71a8b78c34f4ae'
                        },
                        'originId': 'crop-0ce0b06a1cd51ab9ae9fb739b2dfb1a8',
                        'origin': 'METHODE',
                        'title': 'An Amazon courier driver was filmed going to the toilet on a driveway',
                        'subtitle': '9e9e27be-d7b7-11e7-a38d-10a36ef4cb34',
                        'description': 'An Amazon courier driver was filmed going to the toilet on a driveway',
                        'link': 'http://cdn.newsapi.com.au/image/v1/thumbnail/73f5f1b1ba956e2d7b71a8b78c34f4ae',
                        'paidStatus': 'NON_PREMIUM',
                        'originalSource': 'Supplied',
                        'version': 'PUBLISHED',
                        'dateUpdated': '2017-12-02T23:22:36.000Z',
                        'dateLive': '2017-12-02T23:24:00.000Z',
                        'dateCreated': '2017-12-02T23:22:09.000Z',
                        'status': 'ACTIVE',
                        'related': [],
                        'domainLinks': [],
                        'categories': [],
                        'keywords': [],
                        'authors': [],
                        'domains': [
                            'newscorpaustralia.com',
                            'cairnspost.com.au',
                            'ntnews.com.au',
                            'couriermail.com.au',
                            'goldcoastbulletin.com.au',
                            'themercury.com.au',
                            'heraldsun.com.au',
                            'adelaidenow.com.au',
                            'news.com.au',
                            'townsvillebulletin.com.au',
                            'perthnow.com.au',
                            'dailytelegraph.com.au',
                            'geelongadvertiser.com.au'
                        ],
                        'locationGeoPoints': [],
                        'userOriginUpdated': 'chungf',
                        'systemOriginUpdated': 'METHODE',
                        'domainOriginUpdated': 'None',
                        'urlTitle': '9e9e27bed7b711e7a38d10a36ef4cb34',
                        'format': 'jpeg',
                        'width': 100,
                        'height': 75,
                        'imageName': 'courier.jpg',
                        'imageType': 'THUMBNAIL',
                        'sourceImageId': '9e9e27be-d7b7-11e7-a38d-10a36ef4cb34',
                        'cropName': 'standpreview'
                    },
                    'related': [],
                    'domainLinks': [
                        {
                            'name': 'newscorpaustralia.com',
                            'link': 'http://cdn.newsapi.com.au/link/b85a699328557d9410b0f03e66c17265?domain=newscorpaustralia.com'
                        },
                        {
                            'name': 'goldcoastbulletin.com.au',
                            'link': 'http://www.goldcoastbulletin.com.au/business/work/amazon-driver-filmed-going-to-the-toilet-on-customers-driveway/news-story/b85a699328557d9410b0f03e66c17265'
                        },
                        {
                            'name': 'couriermail.com.au',
                            'link': 'http://www.couriermail.com.au/business/work/amazon-driver-filmed-going-to-the-toilet-on-customers-driveway/news-story/b85a699328557d9410b0f03e66c17265'
                        },
                        {
                            'name': 'adelaidenow.com.au',
                            'link': 'http://www.adelaidenow.com.au/business/work/amazon-driver-filmed-going-to-the-toilet-on-customers-driveway/news-story/b85a699328557d9410b0f03e66c17265'
                        },
                        {
                            'name': 'heraldsun.com.au',
                            'link': 'http://www.heraldsun.com.au/business/work/amazon-driver-filmed-going-to-the-toilet-on-customers-driveway/news-story/b85a699328557d9410b0f03e66c17265'
                        },
                        {
                            'name': 'themercury.com.au',
                            'link': 'http://www.themercury.com.au/business/work/amazon-driver-filmed-going-to-the-toilet-on-customers-driveway/news-story/b85a699328557d9410b0f03e66c17265'
                        },
                        {
                            'name': 'ntnews.com.au',
                            'link': 'http://www.ntnews.com.au/business/work/amazon-driver-filmed-going-to-the-toilet-on-customers-driveway/news-story/b85a699328557d9410b0f03e66c17265'
                        },
                        {
                            'name': 'cairnspost.com.au',
                            'link': 'http://www.cairnspost.com.au/business/work/amazon-driver-filmed-going-to-the-toilet-on-customers-driveway/news-story/b85a699328557d9410b0f03e66c17265'
                        },
                        {
                            'name': 'news.com.au',
                            'link': 'http://www.news.com.au/finance/work/amazon-driver-filmed-going-to-the-toilet-on-customers-driveway/news-story/b85a699328557d9410b0f03e66c17265'
                        },
                        {
                            'name': 'perthnow.com.au',
                            'link': 'http://www.perthnow.com.au/business/work/amazon-driver-filmed-going-to-the-toilet-on-customers-driveway/news-story/b85a699328557d9410b0f03e66c17265'
                        },
                        {
                            'name': 'townsvillebulletin.com.au',
                            'link': 'http://www.townsvillebulletin.com.au/business/work/amazon-driver-filmed-going-to-the-toilet-on-customers-driveway/news-story/b85a699328557d9410b0f03e66c17265'
                        },
                        {
                            'name': 'dailytelegraph.com.au',
                            'link': 'http://www.dailytelegraph.com.au/business/work/amazon-driver-filmed-going-to-the-toilet-on-customers-driveway/news-story/b85a699328557d9410b0f03e66c17265'
                        },
                        {
                            'name': 'geelongadvertiser.com.au',
                            'link': 'http://www.geelongadvertiser.com.au/business/work/amazon-driver-filmed-going-to-the-toilet-on-customers-driveway/news-story/b85a699328557d9410b0f03e66c17265'
                        }
                    ],
                    'primaryCategory': {
                        'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Finance - syndicated/Work/',
                        'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Finance%20-%20syndicated/Work/',
                        'id': '1226544451302',
                        'isDominant': true
                    },
                    'categories': [
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Finance%20-%20syndicated/Work/',
                            'id': '1226544451302',
                            'isDominant': true
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226544451302/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226544451302/',
                            'id': '1226544451302',
                            'isDominant': true
                        },
                        {
                            'value': '/display/newscorpaustralia.com/Web/NewsNetwork/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Finance%20-%20syndicated/',
                            'id': '1226544095474',
                            'isDominant': false
                        },
                        {
                            'value': '/displayId/newscorpaustralia.com/1226544095474/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/displayId/newscorpaustralia.com/1226544095474/',
                            'id': '1226544095474',
                            'isDominant': false
                        },
                        {
                            'value': '/rating/newscorpaustralia.com/G/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/rating/newscorpaustralia.com/G/'
                        },
                        {
                            'value': '/author/newscorpaustralia.com/Oliver Murray/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/author/newscorpaustralia.com/Oliver%20Murray/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/economy, business and finance/financial and business service/shipping service/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/economy,%20business%20and%20finance/financial%20and%20business%20service/shipping%20service/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/economy, business and finance/company information/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/economy,%20business%20and%20finance/company%20information/'
                        },
                        {
                            'value': '/taxonomy/iptc.org/environmental issue/waste/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomy/iptc.org/environmental%20issue/waste/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/04006012/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/04006012/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/04016000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/04016000/'
                        },
                        {
                            'value': '/taxonomyid/iptc.org/06009000/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/taxonomyid/iptc.org/06009000/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/courier driver/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/courier%20driver/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/Amazon driver/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/Amazon%20driver/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/delivery person/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/delivery%20person/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/security camera/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/security%20camera/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/fragile porcelain figurine/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/fragile%20porcelain%20figurine/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/delivery woman/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/delivery%20woman/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/company representative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/company%20representative/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/security footage/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/security%20footage/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/dissatisfying surprise/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/dissatisfying%20surprise/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/gift card/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/gift%20card/'
                        },
                        {
                            'value': '/keyword/newscorpaustralia.com/back-to-back incident/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/keyword/newscorpaustralia.com/back-to-back%20incident/'
                        },
                        {
                            'value': '/organisation/newscorpaustralia.com/Fox News Channel/otca/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/organisation/newscorpaustralia.com/Fox%20News%20Channel/otca/'
                        },
                        {
                            'value': '/location/newscorpaustralia.com/United States of America/California/Sacramento/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/United%20States%20of%20America/California/Sacramento/',
                            'otcaConfidence': 82.9323,
                            'otcaRelevancy': 63.2752,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 38.581667,
                                'longitude': -121.494444
                            }
                        },
                        {
                            'value': '/location/newscorpaustralia.com/America/North America/Northern America/United States of America/California/Sacramento/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/location/newscorpaustralia.com/America/North%20America/Northern%20America/United%20States%20of%20America/California/Sacramento/',
                            'otcaConfidence': 82.9323,
                            'otcaRelevancy': 63.2752,
                            'otcaFrequency': 1,
                            'selected': 'auto',
                            'geoPoint': {
                                'latitude': 38.581667,
                                'longitude': -121.494444
                            }
                        },
                        {
                            'value': '/tone/newscorpaustralia.com/negative/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/tone/newscorpaustralia.com/negative/'
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1226617464509',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1228018420923',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1226617464511',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1228018420922',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1226597503297',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1226617464510',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1228018420921',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Finance/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Finance/Work/',
                            'id': '1111112062335',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1226637313603',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1228018420924',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1228018420925',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Finance - syndicated/Work/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Finance%20-%20syndicated/Work/',
                            'id': '1228018420926',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/adelaidenow.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Finance%20-%20syndicated/',
                            'id': '1226617455913',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/goldcoastbulletin.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Finance%20-%20syndicated/',
                            'id': '1228018264720',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/dailytelegraph.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Finance%20-%20syndicated/',
                            'id': '1226617455914',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/ntnews.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Finance%20-%20syndicated/',
                            'id': '1228018278910',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/perthnow.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Finance%20-%20syndicated/',
                            'id': '1226597501825',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/heraldsun.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Finance%20-%20syndicated/',
                            'id': '1226617455907',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/townsvillebulletin.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Finance%20-%20syndicated/',
                            'id': '1228018264718',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/news.com.au/Finance/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/news.com.au/Finance/',
                            'id': '1111112062038',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/couriermail.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Finance%20-%20syndicated/',
                            'id': '1226637308375',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/themercury.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Finance%20-%20syndicated/',
                            'id': '1226680532430',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/geelongadvertiser.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Finance%20-%20syndicated/',
                            'id': '1228018264717',
                            'isSyndicated': true
                        },
                        {
                            'value': '/display/cairnspost.com.au/Finance - syndicated/',
                            'link': 'http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Finance%20-%20syndicated/',
                            'id': '1228018264719',
                            'isSyndicated': true
                        }
                    ],
                    'keywords': [
                        'courier driver',
                        'Amazon driver',
                        'delivery person',
                        'security camera',
                        'fragile porcelain figurine',
                        'delivery woman',
                        'company representative',
                        'security footage',
                        'dissatisfying surprise',
                        'gift card',
                        'back-to-back incident',
                        'Sacramento',
                        'California',
                        'United States of America',
                        'Northern America',
                        'North America',
                        'America',
                        'Fox News Channel'
                    ],
                    'authors': [
                        'Oliver Murray'
                    ],
                    'domains': [
                        'newscorpaustralia.com',
                        'cairnspost.com.au',
                        'ntnews.com.au',
                        'couriermail.com.au',
                        'goldcoastbulletin.com.au',
                        'themercury.com.au',
                        'heraldsun.com.au',
                        'adelaidenow.com.au',
                        'news.com.au',
                        'townsvillebulletin.com.au',
                        'perthnow.com.au',
                        'dailytelegraph.com.au',
                        'geelongadvertiser.com.au'
                    ],
                    'references': [
                        {
                            'id': {
                                'value': '73f5f1b1ba956e2d7b71a8b78c34f4ae',
                                'link': 'http://cdn.newsapi.com.au/content/v2/73f5f1b1ba956e2d7b71a8b78c34f4ae'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-0ce0b06a1cd51ab9ae9fb739b2dfb1a8',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'f5fe3ce1075bb683a1e5b20f1d60ed48',
                                'link': 'http://cdn.newsapi.com.au/content/v2/f5fe3ce1075bb683a1e5b20f1d60ed48'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-0e8e5f0c3f6d9ec94353716d3f49a70e',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '1d810096c8295090da3e4a87dae05269',
                                'link': 'http://cdn.newsapi.com.au/content/v2/1d810096c8295090da3e4a87dae05269'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-bb8bcce9d31136769184824596496ead',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '8bc6c99835da0a2364c211e3b9c9291b',
                                'link': 'http://cdn.newsapi.com.au/content/v2/8bc6c99835da0a2364c211e3b9c9291b'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-6029519cb3731d21ddb211955242a0a4',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '7418326625cdeebf7edcb5edf43f4b66',
                                'link': 'http://cdn.newsapi.com.au/content/v2/7418326625cdeebf7edcb5edf43f4b66'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-ab0502d1be8336fdf3858379bff5db3c',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': '41a2d23fc411dc39283fb69bf63358d0',
                                'link': 'http://cdn.newsapi.com.au/content/v2/41a2d23fc411dc39283fb69bf63358d0'
                            },
                            'origin': 'METHODE',
                            'originId': 'crop-52b7325110f117ce2cfb66f3cc80a09d',
                            'contentType': 'IMAGE',
                            'referenceType': 'PRIMARY'
                        },
                        {
                            'id': {
                                'value': 'b8858701256198f7f189cc6a0324597d',
                                'link': 'http://cdn.newsapi.com.au/content/v2/b8858701256198f7f189cc6a0324597d'
                            },
                            'origin': 'CONTENT_API',
                            'contentType': 'VIDEO',
                            'referenceType': 'PRIMARY'
                        }
                    ],
                    'locationGeoPoints': [
                        {
                            'latitude': 38.581667,
                            'longitude': -121.494444
                        }
                    ],
                    'seoHeadline': 'Amazon driver filmed going to the toilet on customer’s driveway',
                    'userOriginUpdated': 'chungf',
                    'systemOriginUpdated': 'METHODE',
                    'domainOriginUpdated': 'None',
                    'urlTitle': 'amazon-driver-filmed-going-to-the-toilet-on-customers-driveway',
                    'revision': 3,
                    'body': 'When he looked at the footage in his security camera, however, he found a dissatisfying surprise.\n\nBautista told Fox News on Friday that instead of a puppy relieving itself, he watched a woman who was delivering a package for Amazon driving a U-Haul doing the deed.\n\nHe said he was “shocked” by what he saw and immediately contacted Amazon and filed a complaint. \n\nA company representative was “shocked and thoroughly apologised,” and said that the delivery woman worked for a third-party contractor Amazon had hired to make those deliveries.\n\n“I wanted Amazon to come clean it up,” Bautista said, adding he missed the delivery by minutes.\n\nA supervisor for the driver arrived at Bautista’s home about five hours later, unprepared to deal with the “package.”\n\n“He didn’t have any gloves, nothing,” Bautista said. “He grabbed a plastic bag to scoop it up and I told him he couldn’t put it my [trash] can. I didn’t want it stinking up my can.”\n\nThe man asked Bautista if he could leave it beside the trash can, which he did. Bautista eventually put it in the trash can after the man left.\n\nAmazon has apologised to Bautista and offered him a gift card. He told FOX 40 that the company told him the driver “has been dealt with” but was unsure what that meant.\n\n“This is a third-party provider — anyone can be a driver,” he told Fox News. “It’s a lack of professionalism. It’s very strange.”\n\nBut it seems as if the problems didn’t end there for Bautista.\n\nHe said the next day another Amazon delivery person, instead of walking up to his front door to drop off the package, was caught on camera throwing it from about 20 yards out.\n\n“To put salt on the wound, we had another driver the next day that tossed the package. He tossed it instead of walking up the driveway,” said Bautista, adding that it landed on top of a rose bed. “It was a fragile porcelain figurine. It didn’t break.”\n\nA representative with Amazon was “shocked” and profusely apologised for the second incident.\n\n“I have lived in this home 17 years and I have never had back-to-back incident [like these],” Bautista added. “I am disappointed in how it was handled.”\n\nThis article originally appeared on Fox News and was reproduced with permission \n\n',
                    'standFirst': 'A MAN returned home to found what appeared to be dog poo on his driveway. Then he checked the security footage.\n\n',
                    'commentsAllowed': false,
                    'commentsTotal': 0,
                    'commentsShown': false,
                    'authorProfileIds': [
                        'b3cc8740651a8ac0a0789a6aabdd4727'
                    ],
                    'bylineNames': [],
                    'bylineTitles': [],
                    'bulletList': []
                }
            ],
            'domainLinks': [
                {
                    'name': 'news.com.au',
                    'link': ''
                }
            ],
            'primaryCategory': {
                'value': '/section/news.com.au/collection/popular-content/all/today/',
                'link': 'http://cdn.newsapi.com.au/category/v2/section/news.com.au/collection/popular-content/all/today/'
            },
            'categories': [
                {
                    'value': '/section/news.com.au/collection/popular-content/all/today/',
                    'link': 'http://cdn.newsapi.com.au/category/v2/section/news.com.au/collection/popular-content/all/today/'
                }
            ],
            'keywords': [],
            'authors': [],
            'domains': [
                'news.com.au'
            ],
            'locationGeoPoints': [],
            'urlTitle': 'popular-news-story-collection-sectionnewscomaucollectionpopularcontentalltoday',
            'revision': 13306
        }
    ],
    'resultSize': 1,
    'warnings': []
};
