var componentPath = '../../../../../../../../../transformers/1.0/components' +
                     '/article/middleware/interleave-media/interleave/body',

    implementation = require(componentPath + '_implementation'),
    interleaveBody = require(componentPath),
    expect = require('chai').expect,
    cheerio = require('cheerio');

describe('/component/article', function() {
    describe('#interleaveMedia/body', function() {
        var locals = {
            'data': {
                'body': ''
            }
        };

        beforeEach(function() {
            locals.data.body = '';
            locals.data.related = [];
        });

        describe('xhtml', () => {
            it('can handle non-void self closing tags', () => {
                locals.data.body = `
                <canvas/>
                <p> <span class="h2" /> <b><span class="h2">ADELAIDE </span></b> </p>
                <p> <span class="h2" />Lost Tom Doedee to a knee injury in Round 1 but the Crows’ defence didn’t miss a beat in the
                    Round 2 win over Sydney. Biggest concern surrounds ruckman Sam Jacobs who “tweaked” his knee in the first half and
                    spent 15 minutes in the rooms in the third quarter. He returned to play out the game but will be tested this week.
                    Back-up ruckman Reilly O’Brien had 17 disposals, 21 hit-outs and three contested marks in the SANFL on the weekend
                    and is on standby. Also in the reserves young forward Darcy Fogarty impressed playing in defence and midfielder Hugh
                    Greenwood had 17 disposals and kicked 1.2 as he builds towards a senior return. - REECE HOMFRAY</p>`;

                var result = interleaveBody(locals.data.body, locals, function() {});

                expect(result).to.deep.eq(
                    [
                        {
                            'contentType': 'HTML',
                            'html': '<canvas></canvas>'
                        },
                        {
                            'contentType': 'HTML',
                            'html': '<p> <b><span class="h2">ADELAIDE </span></b></p>'
                        },
                        {
                            'contentType': 'HTML',
                            'html': '<p>Lost Tom Doedee to a knee injury in Round 1 but the Crows&#x2019; defence didn&#x2019;t miss a beat in the Round 2 win over Sydney. Biggest concern surrounds ruckman Sam Jacobs who &#x201C;tweaked&#x201D; his knee in the first half and spent 15 minutes in the rooms in the third quarter. He returned to play out the game but will be tested this week. Back-up ruckman Reilly O&#x2019;Brien had 17 disposals, 21 hit-outs and three contested marks in the SANFL on the weekend and is on standby. Also in the reserves young forward Darcy Fogarty impressed playing in defence and midfielder Hugh Greenwood had 17 disposals and kicked 1.2 as he builds towards a senior return. - REECE HOMFRAY</p>'
                        }
                    ]
                );
            });
        });

        it('Returns empty paragraph array to the body when there are no paragraphs, ' +
            'to parse',
        function() {
            var doneCalled = false,
                results = interleaveBody(locals.data.body, locals, function() {});

            expect(
                results,
                'results is an array'
            ).to.be.an('array');
            expect(
                results.length,
                'results is an empty array'
            ).to.equal(0);
        });

        it('Calls back with error should parsing fail', function(done) {
            locals.data.body = '<p>foo</p>';

            var doneCalled = false,
                results = implementation({
                    load: function() {
                        throw new Error('Cheerio error');
                    }
                })(locals.data.body, locals, function(err, results) {
                    expect(
                        err,
                        'error correctly defined'
                    ).to.be.an('error');

                    expect(
                        err.message,
                        'error message is correct'
                    ).to.equal('Cheerio error');

                    expect(
                        results,
                        'results is an array'
                    ).to.be.an('array');
                    expect(
                        results.length,
                        'results is an empty array'
                    ).to.equal(0);

                    done();
                });
        });

        it('Returns an array of paragraphs from the source HTML', function() {
            locals.data.body = '<p>a</p><p>b</p><p>c</p>';

            var results = interleaveBody(locals.data.body, locals, function() {});

            expect(results,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(results.length,
                'The length of the returned paragraph array must be ' +
                    'equal to the number of paragraphs that were passed in')
                .to.equal(3);

            results.forEach(function(result) {
                expect(result,
                    'Each item in the paragraphs array must be an object')
                    .to.be.an('object');

                expect(result.contentType,
                    'Each paragraph must have a contentType of HTML')
                    .to.equal('HTML');
            });

            expect(results[0].html,
                'The nth paragraph must have the same value as the raw ' +
                    'HTML passed in.')
                .to.equal('<p>a</p>');

            expect(results[1].html,
                'The nth paragraph must have the same value as the raw ' +
                    'HTML passed in.')
                .to.equal('<p>b</p>');

            expect(results[2].html,
                'The nth paragraph must have the same value as the raw ' +
                    'HTML passed in.')
                .to.equal('<p>c</p>');
        });

        it('Returns an empty array of paragraphs if HTML ' +
            "doesn't have a body",
        function() {
            locals.data.body = null;
            var result = interleaveBody(locals.data.body, locals, function() {});

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be 0").to.equal(0);
        });

        it('Successfully interleaves key media', function() {
            locals.data.body =
                '<p>first paragraph</p>' +
                "<p><a capiId='a'>this must not appear</a></p>" +
                '<p>second paragraph</p>' +
                "<p><a class='capi-image' capiId='b'>this must not appear</a></p>" +
                '<p>third paragraph</p>' +
                "<p><a capiId='c'>this must not appear</a></p>";

            locals.data.related = [{
                'id': {
                    'value': 'a'
                },
                'contentType': 'IFRAME',
                'body': '<foo></foo>'
            }, {
                'id': {
                    'value': 'b'
                },
                'contentType': 'IMAGE',
                'src': 'foo'
            }, {
                'id': {
                    'value': 'c'
                },
                'contentType': 'IFRAME',
                'iframeUrl': 'http://youtube.com/watch?v=abcd'
            }];

            var result = interleaveBody(locals.data.body, locals, function() {});

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be 6").to.equal(6);

            var names = ['first', 'second', 'third'];
            [0, 2, 4].forEach(function(i, idx) {
                expect(result[i],
                    'The nth result item must be an object')
                    .to.be.an('object');

                expect(result[i].contentType,
                    "The nth result item's contentType must be 'HTML'")
                    .to.equal('HTML');

                expect(result[i].html,
                    "The nth result item's html must contain the right content")
                    .to.equal('<p>' + names[idx] + ' paragraph</p>');
            });

            // IFRAME with body
            expect(result[1],
                'The nth result item must be an object').to.be.an('object');

            expect(result[1]).to.equal(locals.data.related[0]);

            // IMAGE
            expect(result[3],
                'The nth result item must be an object').to.be.an('object');

            expect(result[3]).to.equal(locals.data.related[1]);

            expect(
                locals.data.related[1].embedType,
                'The nth result item has a correct embedType property'
            ).to.equal('capi-image');

            // IFRAME with youtube embed
            expect(result[5],
                'The nth result item must be an object').to.be.an('object');

            expect(result[5]).to.equal(locals.data.related[2]);
            expect(result[5].iframeUrl).to.equal('//www.youtube.com/embed/abcd');
        });

        it('Successfully interleaves side by side media elements', function() {
            locals.data.body =
                "<p>first paragraph<a capiId='a'></a><a capiId='b'></a></p>" +
                '<p>second paragraph</p>';

            locals.data.related = [{
                'id': {
                    'value': 'a'
                },
                'contentType': 'IFRAME',
                'body': '<foo></foo>'
            }, {
                'id': {
                    'value': 'b'
                },
                'contentType': 'IMAGE',
                'src': 'foo'
            }];

            var result = interleaveBody(locals.data.body, locals, function() {});

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be 4").to.equal(4);

            var names = ['first', 'second'];
            [0, 3].forEach(function(i, idx) {
                expect(result[i],
                    'The nth result item must be an object')
                    .to.be.an('object');

                expect(result[i].contentType).to.equal('HTML');
                expect(result[i].html)
                    .to.equal('<p>' + names[idx] + ' paragraph</p>');
            });

            expect(result[1].contentType).to.equal('IFRAME');
            expect(result[2].contentType).to.equal('IMAGE');
        });

        it('Successfully interleaves nested media elements', function() {
            locals.data.body =
                '<p>' +
                '<span>' + // index within result:
                'paragraph 1' + // 0
                "<a capiId='a'></a>" + // 1
                'paragraph 2' + // 2
                '</span>' +
                '</p>' +
                '<div>' +
                '<span>' +
                'paragraph 3' + // 3
                "<a capiId='b'></a>" + // 4
                '<i>' +
                'paragraph 4' + // 5
                '<b>' +
                "<a capiId='a'></a>" + // 6
                'paragraph 5' + // 7
                '</b>' +
                '</i>' +
                '</span>' +
                '</div>' +
                '<p>' + // 8
                'paragraph 6' +
                '<i>' +
                "<a href='http://tcog.com.au'>" +
                'link text' +
                '</a>' +
                '</i>' +
                'paragraph 6' +
                '</p>' +
                '<p>' +
                '<span>' +
                'paragraph 7' +
                '<b>' +
                'paragraph 7' +
                '</b>' +
                'paragraph 7' +
                '</span>' +
                'paragraph 7' +
                '<span>this is a <br /> test <hr /> </span>',
            '</p>';

            locals.data.related = [{
                'id': {
                    'value': 'a'
                },
                'contentType': 'IFRAME',
                'body': '<foo></foo>'
            }, {
                'id': {
                    'value': 'b'
                },
                'contentType': 'IMAGE',
                'src': 'foo'
            }];

            var result = interleaveBody(locals.data.body, locals, function() {}),
                expectedResults = [{
                    contentType: 'HTML',
                    html: '<p><span>paragraph 1</span></p>'
                }, {
                    contentType: 'IFRAME'
                }, {
                    contentType: 'HTML',
                    html: '<p><span>paragraph 2</span></p>'
                }, {
                    contentType: 'HTML',
                    html: '<div><span>paragraph 3</span></div>'
                }, {
                    contentType: 'IMAGE'
                }, {
                    contentType: 'HTML',
                    html: '<div><span><i>paragraph 4</i></span></div>'
                }, {
                    contentType: 'IFRAME'
                }, {
                    contentType: 'HTML',
                    html: '<div><span><i><b>' +
                        'paragraph 5</b></i></span></div>'
                }, {
                    contentType: 'HTML',
                    html: '<p>paragraph 6' +
                        '<i><a href="http://tcog.com.au">' +
                        'link text</a></i>' +
                        'paragraph 6</p>'
                }, {
                    contentType: 'HTML',
                    html: '<p><span>paragraph 7<b>paragraph 7</b>paragraph 7</span>' +
                          'paragraph 7<span>this is a <br> test <hr></span></p>'
                }];

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be" +
                    ' ' + expectedResults.length)
                .to.equal(expectedResults.length);

            expectedResults.forEach(function(expectedResult, index) {
                var resultItem = result[index];

                expect(resultItem,
                    'The nth result item must be an object')
                    .to.be.an('object');

                expect(resultItem.contentType,
                    "The nth result item's contentType must be set correctly")
                    .to.equal(expectedResult.contentType);

                if (resultItem.contentType === 'HTML') {
                    expect(resultItem.html,
                        "The nth result item's html must be set correctly")
                        .to.equal(expectedResult.html);
                }
            });
        });

        it('Retains html attributes', function() {
            locals.data.body =
                '<p>first paragraph</p>' +
                '<p></p>' +
                '<p>second paragraph</p>' +
                '<p>     </p>' +
                "<div><h1 class='heading'>I am a header</h1></div>" +
                '<p/>';

            var result = interleaveBody(locals.data.body, locals, function() {});

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be 3")
                .to.equal(3);

            expect(result[2].html,
                "The nth result item's html must be set correctly")
                .to.equal(
                    '<div><h1 class="heading">I am a header</h1></div>'
                );
        });

        it('Result contains an error paragraph if the ID ' +
            'can not be resolved',
        function() {
            locals.data.body =
                    '<p>first paragraph</p>' +
                    "<p><a capiId='notexisting'></a></p>";

            locals.data.related = [{
                'id': {
                    'value': 'a'
                },
                'contentType': 'IFRAME',
                'body': '<foo></foo>'
            }];

            var result = interleaveBody(locals.data.body, locals, function() {});

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be 2")
                .to.equal(2);

            expect(result[1].contentType,
                "The nth result items's contentType must be 'HTML'")
                .to.equal('HTML');

            expect(result[1].html,
                "The nth result item's html should contain a parse error")
                .to.contain('tcog parse error');
        });

        it('Successfully converts capi-link items to full link tag', function() {
            locals.data.body =
                '<p>this is an ' +
                "<a class='capi-link' capiid='81df1a609cafecfe8e6fa981a8d146b6'>inline</a> " +
                'link</p>';

            locals.data.related = [{
                contentType: 'NEWS_STORY',
                id: {
                    value: '81df1a609cafecfe8e6fa981a8d146b6',
                    link: 'http://api.newsapi.com.au/sit/content/v2/81df1a609' +
                          'cafecfe8e6fa981a8d146b6'
                },
                link: 'http://cdn.newsapi.com.au/sit/link/81df1a609cafecfe8e6' +
                      'fa981a8d146b6?domain=adelaidenowsit.com.au'
            }];

            var result = interleaveBody(locals.data.body, locals, function() {});

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be 1").to.equal(1);

            expect(result[0].html,
                'The returned paragaph correctly interleaves links'
            ).to.equal(
                '<p>this is an ' +
                '<a ' +
                'class="capi-link" data-id="81df1a609cafecfe8e6fa981a8d146b6" ' +
                'href="http://cdn.newsapi.com.au/sit/link/' +
                '81df1a609cafecfe8e6fa981a8d146b6?domain=adelaidenowsit.com.au"' +
                '>inline</a> ' +
                'link</p>'
            );
        });

        it('Removes blank paragraphs', function() {
            locals.data.body =
                '<p>first paragraph</p>' +
                '<p></p>' +
                '<p>second paragraph</p>' +
                '<p>     </p>' +
                '<p/>';

            var result = interleaveBody(locals.data.body, locals, function() {});

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be 2").to.equal(2);

            expect(result[0].html).to.equal('<p>first paragraph</p>');
            expect(result[1].html).to.equal('<p>second paragraph</p>');
        });

        it('Supports nested tags with immediate siblings', function() {
            locals.data.body =
                '<blockquote><p><em><a>paragraph</a> link <span>foo</span></em></p></blockquote>';

            var result = interleaveBody(locals.data.body, locals, function() {});

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be 1").to.equal(1);
            expect(result[0].html).to.equal(
                '<blockquote><p><em><a>paragraph</a> link <span>foo</span></em></p>\n</blockquote>'
            );
        });

        it('Removes blank divs', function() {
            locals.data.body =
                '<p>first paragraph</p>' +
                '<div></div>' +
                '<article>second paragraph</article>' +
                '<div>     </div>' +
                '<aside/>';

            var result = interleaveBody(locals.data.body, locals, function() {});

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be 2")
                .to.equal(2);

            expect(result[0].html).to.equal('<p>first paragraph</p>');
            expect(result[1].html).to.equal('<article>second paragraph</article>');
        });

        it("Doesn't remove void elements", function() {
            locals.data.body =
                '<img src="foo">' +
                '<div></div>' +
                '<article>second paragraph</article>' +
                '<div>     </div>' +
                '<canvas/>';

            var result = interleaveBody(locals.data.body, locals, function() {});

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be 3")
                .to.equal(3);

            expect(result[0].html).to.equal('<img src="foo">');
            expect(result[1].html).to.equal('<article>second paragraph</article>');
            expect(result[2].html).to.equal('<canvas></canvas>');
        });

        it('Retains top level sectioning elements ' +
            'which are not paragraphs',
        function() {
            locals.data.body =
                    '<article>fooo</article>' +
                    '<div>paragraph 2</div>' +
                    '<aside>bar</aside>';

            var result = interleaveBody(locals.data.body, locals, function() {});

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be 3")
                .to.equal(3);

            expect(result[0].html).to.equal('<article>fooo</article>');
            expect(result[1].html).to.equal('<div>paragraph 2</div>');
            expect(result[2].html).to.equal('<aside>bar</aside>');
        });

        it('Retains paragraph text from paragraphs that ' +
            'contain a CAPI link',
        function() {
            locals.data.body =
                    '<p>first paragraph</p>' +
                    "<p><a capiId='a'>this must not appear</a>third paragraph</p>" +
                    '<p>fourth paragraph</p>' +
                    "<p>fifth paragraph<a capiId='b'>this must not appear</a></p>" +
                    '<p>seventh paragraph</p>' +
                    "<p><a capiId='c'>this must not appear</a></p>";

            locals.data.related = [{
                'id': {
                    'value': 'a'
                },
                'contentType': 'IFRAME',
                'body': '<foo></foo>'
            }, {
                'id': {
                    'value': 'b'
                },
                'contentType': 'IMAGE',
                'src': 'foo'
            }, {
                'id': {
                    'value': 'c'
                },
                'contentType': 'IFRAME',
                'iframeUrl': 'http://youtube.com/watch?v=abcd'
            }];

            var result = interleaveBody(locals.data.body, locals, function() {});

            expect(result,
                'The returned paragraph data must be an array')
                .to.be.an('array');

            expect(result.length,
                "The returned paragraph's length must be 3")
                .to.equal(8);

            var names = ['first', 'third', 'fourth', 'fifth', 'seventh'];
            [0, 2, 3, 4, 6].forEach(function(i, idx) {
                expect(result[i],
                    'The nth result item must be an object')
                    .to.be.an('object');

                expect(result[i].contentType).to.equal('HTML');

                expect(result[i].html).to.equal(
                    '<p>' + names[idx] + ' paragraph</p>'
                );
            });

            // IFRAME with body
            expect(result[1],
                'The nth result item must be an object')
                .to.be.an('object');

            expect(result[1]).to.equal(locals.data.related[0]);

            // IMAGE
            expect(result[5],
                'The nth result item must be an object')
                .to.be.an('object');

            expect(result[5]).to.equal(locals.data.related[1]);

            // IFRAME with youtube embed
            expect(result[7],
                'The nth result item must be an object')
                .to.be.an('object');

            expect(result[7]).to.equal(locals.data.related[2]);

            expect(result[7].iframeUrl)
                .to.equal('//www.youtube.com/embed/abcd');
        });
    });
});
