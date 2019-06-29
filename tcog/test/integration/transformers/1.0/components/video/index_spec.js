const express = require('express'),
    expect = require('chai').expect,
    request = require('supertest'),
    middleware = require('../../../../../../lib/middleware'),
    video = require('../../../../../../transformers/1.0/video').middleware,
    fs = require('fs'),
    path = require('path');

const text = `<esi:include src="https://a.tcog.news.com.au/news/content/v2/?maxRelated=20&pageSize=20&offset=0&query=(contentType:video+AND+domains:news.com.au+AND+-paidStatus:fair_dealing+AND+categories.value:%22%2Fdisplay%2Fnewscorpaustralia.com%2FWeb%2FNewsNetwork%2FEntertainment%20-%20syndicated%2FTelevision%2F%22)&td_domain=news.com.au&t_product=newscomau&t_template=../video/module&td_list_style=block&td_path=entertainment%2Ftv" dca="esi" onerror="continue"></esi:include>\n<img class="tcog-pixel" src="https://i1.wp.com/pixel.tcog.cp1.news.com.au/track/news/video/categories?t_product=newscomau&site=news.com.au&td_domain=news.com.au&t_template=../video/index&td_path=entertainment/tv&td_list_style=block" style="opacity:0; height:0px; width:0px; position:absolute;" width="0" height="0" />\n`;
const app = express();

app.get('/news/video/categories', middleware.responseLocals, middleware.requestInitialiser, middleware.product, middleware.queryProcessor, video);

describe('/news/video/categories', function() {
    it('collection', (done) => {
        request(app)
            .get('/news/video/categories?t_product=newscomau&site=news.com.au&td_domain=news.com.au&t_template=../video/index&td_path=entertainment/tv&td_list_style=block')
            .end(function(err, res) {
                expect(res.statusCode).to.eq(200);
                expect(res.text).to.eq(text);
                done(err);
            });
    });
});
