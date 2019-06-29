'use strict';

const cheerio = require('cheerio'),
    specHelper = require('../spec_helper'),
    expect = require('chai').expect,
    tcog = specHelper.tcog,

    testURLs = [
        'world/bali-prisoner-stephen-henri-lubbe-writes-letter-saying-foreign-prisoners-buy-reduced-sentences-from-indonesian-jails/story-fndir2ev-1227014030151',
        'lifestyle/parenting/parents-in-baby-gammy-thai-surrogacy-row-break-silence/story-fnet08xa-1227013406177',
        'travel/travel-updates/mh17-breakthrough-owner-of-volvo-truck-that-transported-missile-fears-his-life/story-fnizu68q-1227014149633',
        'world/middle-east/israel-to-withdraw-troops-from-gaza-strip/story-fnh81ifq-1227014186885',
        'technology/online/google-defends-child-porn-tipoffs-to-police/story-fnjwmwrh-1227014134113',
        'entertainment/tv/ten-eyewitness-news-adelaide-newsreader-nick-butler-stumbles-through-excruciating-autocue-disaster/story-e6frfmyi-1227014160393',
        'entertainment/tv/from-modern-family-to-game-of-thrones-how-much-do-tv-stars-get-paid/story-e6frfmyi-1227014186666'
    ];

describe('*AGAINST PRODUCTION* URLs that must work!', () => {
    before(tcog.start);

    beforeEach((done) => {
        done();
    });

    describe('article page', () => {
        testURLs.forEach((url) => {
            it.only(`successfully delivers article text for ${url}`, (done) => {
                const requestURL = `/component/article/${url}?t_product=tcog`;

                tcog.request(requestURL, (err, res, body) => {
                    if (err) { return done(err); }

                    let $ = cheerio.load(body),
                        heading = $('h1'),
                        paras	= $('p');

                    expect(heading.length).to.be.gt(0);
                    expect(paras.length).to.be.gt(0);

                    done();
                });
            });
        });

        it('endpoint supports returning promos', (done) => {
            const requestURL = '/component/article/c38d61304d41e6476af34c4ec8b61d4d' +
                             '?t_product=tcog&t_output=json';

            tcog.request({
                url: requestURL,
                json: true
            }, (err, res, body) => {
                if (err) { return done(err); }

                expect(body.data.contentType).to.equal('PROMO');

                done();
            });
        });

        describe('route enforcement', () => {
            it('not activated if request does not originate from Akamai', (done) => {
                const url = '/component/article/world/bali-prisoner-stephen-henri-lubbe-writes-' +
                          'letter-saying-foreign-prisoners-buy-reduced-sentences-from-indonesian-' +
                          'jails/story-fndir2ev-1227014030151';

                tcog.request({
                    url: url,
                    headers: {
                        'x-tcog-product': 'DailyTelegraph'
                    },
                    followRedirect: false
                }, (err, res, body) => {
                    expect(res.statusCode, 'status code is 200').to.equal(200);
                    expect(body.indexOf('&t_trouter=true') === -1).to.equal(true);

                    done();
                });
            });

            describe('if request does originate from Akamai', () => {
                it('redirects if url not correct', (done) => {
                    const url = '/component/article/world/bali-prisoner-stephen-henri-lubbe-writes-' +
                              'letter-saying-foreign-prisoners-buy-reduced-sentences-from-indonesian-' +
                              'jails/story-fndir2ev-1227014030151';

                    tcog.request({
                        url: url,
                        headers: {
                            'x-tcog-product': 'DailyTelegraph',
                            'surrogate-capability': 1
                        },
                        followRedirect: false
                    }, (err, res, body) => {
                        expect(res.statusCode, 'status code is 301').to.equal(301);

                        const newURL = body.split('Moved Permanently. Redirecting to ')[1];

                        expect(newURL, 'redirects article to correct url').to.equal(
                            'http://www.dailytelegraph.com.au/news/world/bali-prisoner-stephen-' +
                            'henri-lubbe-writes-letter-saying-foreign-prisoners-buy-reduced-' +
                            'sentences-from-indonesian-jails/news-story/' +
                            '9fe4814184f33966cedc4dcbfc6720f0'
                        );

                        done();
                    });
                });

                it('permits akamai based JSON requests', (done) => {
                    const url = '/component/article/world/bali-prisoner-stephen-henri-lubbe-writes-' +
                              'letter-saying-foreign-prisoners-buy-reduced-sentences-from-indonesian-' +
                              'jails/story-fndir2ev-1227014030151?t_output=json&t_product=DailyTelegraph';

                    tcog.request({
                        url: url,
                        headers: {
                            'surrogate-capability': 1
                        },
                        followRedirect: false,
                        json: true
                    }, (err, res, body) => {
                        expect(res.statusCode, 'status code is 200').to.equal(200);
                        expect(body, 'is an object').to.be.an('object');

                        done();
                    });
                });

                it('does not redirect if url is correct', (done) => {
                    var url = '/component/article/news/world/bali-prisoner-stephen-' +
                              'henri-lubbe-writes-letter-saying-foreign-prisoners-buy-reduced-' +
                              'sentences-from-indonesian-jails/news-story/' +
                              '9fe4814184f33966cedc4dcbfc6720f0';

                    tcog.request({
                        url: url,
                        headers: {
                            'x-tcog-product': 'DailyTelegraph',
                            'surrogate-capability': 1
                        },
                        followRedirect: false
                    }, (err, res, body) => {
                        expect(res.statusCode, 'status code is 200').to.equal(200);
                        expect(body.indexOf('&t_trouter=true') !== -1).to.equal(true);

                        done();
                    });
                });
            });
        });
    });
});
