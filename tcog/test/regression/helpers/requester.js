var request = require('request'),
    cheerio = require('cheerio'),
    proxy = process.env.HTTP_PROXY,
    expect = require('chai').expect,
    base = 'http://localhost:3002/',
    logger = require('./../../../lib/logger/index');

module.exports = function(url, cb) {
    var args = {
        url: base + url,
        proxy: proxy
    };

    request(args, function(err, res, body) {
        var $ = cheerio.load(body);
        if (!err && res.statusCode !== 200) {
            err = new Error('non 200 status code: ' + body);
        }

        if (err) {
            logger.fatal({}, 'An integration test has found an error condition. TEST MUST HANDLE FAILURE!!!');
        }

        cb(err, { res: res, body: body, $: $ });
    });
};
