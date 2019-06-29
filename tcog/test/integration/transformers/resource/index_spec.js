const express = require('express'),
    expect = require('chai').expect,
    request = require('supertest'),
    middleware = require('./../../../../lib/middleware'),
    resource = require('./../../../../transformers/resource'),
    nock = require('nock'),
    fs = require('fs'),
    path = require('path');

const app = express();
const text = `<div class="module asx-top-risers"><div class="module-header"><h3 class="heading">ASX - Top Gainers<em class="timestamp"> at 6:35pm</em></h3></div><div class="module-content"><table class="market-table"><thead><tr><th scope="col" class="index">Position</th><th scope="col" class="th-code">Code</th><th scope="col" class="th-name">Name</th><th scope="col" class="th-price">Price</th><th scope="col" class="movement-index">Percent</th></tr></thead><tbody class="gain"><tr><td class="table-position">1</td><td class="asx-code">SLR </td><td class="company"><a href="http://markets.news.com.au/newscorp/entry.aspx?secid=SLR">Silver Lake Resources Limited</a></td><td class="price">0.455</td><td class="movement">+15.20%</td></tr></tbody></table></div></div>
<img class="tcog-pixel" src="https://i1.wp.com/pixel.tcog.cp1.news.com.au/track/component/resource/nmdata/topmovers/topgainers?t_product=newscomau&t_template=s3/ncatemp/standalone/finance/asx-top-gainers" style="opacity:0; height:0px; width:0px; position:absolute;" width="0" height="0" />
`;

app.get('/component/resource/(*)', middleware.responseLocals, middleware.requestInitialiser, middleware.queryProcessor, resource);

describe('components/resource', function() {
    afterEach(() => {
        nock.cleanAll();
    });

    it('transforms', (done) => {
        // http://prod.marketdata.digprod.cp1.news.com.au/nmdata/topmovers/topgainers
        const nmdata = nock(/marketdata/)
            .log(console.log)
            .get(/topgainers/)
            .reply(200, () => {
                return {
                    'name': 'ASX - Top Gainers',
                    'result': [
                        {
                            'code': 'SLR',
                            'name': 'Silver Lake Resources Limited',
                            'price': '0.45500',
                            'percentage': '15.2%'
                        }
                    ],
                    'lastpricedate': 'Fri Apr 06 2018 17:35:00 GMT+1000 (AEST)'
                };
            });

        // http://dev.resources.newscdn.com.au/cs/ncatemp/latest/templates/standalone/finance/asx-top-gainers.json
        const s3 = nock(/resources.newscdn.com.au/)
            .log(console.log)
            .get(/asx-top-gainers.json/)
            .reply(200, (a, b) => {
                return fs.readFileSync(path.resolve(__dirname + /fixtures/, 'asx-top-gainers.json'), 'utf8');
            });

        request(app)
            .get('/component/resource/nmdata/topmovers/topgainers?t_product=newscomau&t_template=s3/ncatemp/standalone/finance/asx-top-gainers')
            .end(function(err, res) {
                expect(nmdata.isDone()).to.be.true;
                expect(s3.isDone()).to.be.true;
                expect(res.statusCode).to.eq(200);
                expect(res.text).to.eq(text);
                done(err);
            });
    });
});
