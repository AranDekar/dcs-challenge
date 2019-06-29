var modulePath = '../../../../lib/render/responder_implementation',
    expect = require('chai').expect,
    leche = require('leche'),
    implementation = require(modulePath);

describe('Responder', function() {
    var host = 'foo.com.au',
        res = {},
        req = {},
        responder = implementation(host, JSON, encodeURI),

        imageFixture =
            '\n<img class="tcog-pixel" src="{host}/track/" ' +
            'style="opacity:0; height:0px; width:0px; position:absolute;" ' +
            'width="0" height="0" />\n';

    beforeEach(function() {
        res = leche.create(['end', 'setHeader']);
    });

    it('ends without body when method is HEAD', function() {
        var executed = 0,
            headers = {};
        res.end = function(body) {
            expect(body).to.equal(undefined);
            executed++;
        };
        headers['Content-Type'] = 'text/html; charset=utf-8';
        responder.send({ method: 'HEAD' }, res, 'body', headers);
        expect(executed).to.equal(1);
    });

    it('sets pixel host correctly', function() {
        var item = 'foo.com.au',
            headers = {},
            responder = implementation(item, JSON, encodeURI),
            executed = 0,
            pixel = imageFixture.replace('{host}', item);

        res.end = function(body) {
            expect(body).to.equal('body' + pixel);
            executed++;
        };
        headers['Content-Type'] = 'text/html; charset=utf-8';
        responder.send({ method: 'GET', url: '/' }, res, 'body', headers);
        expect(executed).to.equal(1);
    });

    it('ends with body when method is not HEAD', function() {
        var executed = 0,
            headers = {},
            pixel = imageFixture.replace('{host}', host);

        res.end = function(body) {
            expect(body).to.equal('body' + pixel);
            executed++;
        };
        headers['Content-Type'] = 'text/html; charset=utf-8';
        responder.send({ method: 'GET', url: '/' }, res, 'body', headers);
        expect(executed).to.equal(1);
    });

    it('sets header properly when contentType is null', function() {
        var executed = 0,
            headers = {};
        res.setHeader = function(type, data) {
            if (type === 'Content-Type') {
                expect(data).to.equal(
                    'text/html; charset=utf-8');
                executed++;
            }
        };
        headers['Content-Type'] = 'text/html; charset=utf-8';
        responder.send({ method: 'GET' }, res, 'body', headers);
        expect(executed).to.equal(1);
    });

    it('sets header properly when contentType is not null', function() {
        var executed = 0,
            headers = {};
        res.setHeader = function(type, data) {
            if (type === 'Content-Type') {
                expect(data).to.equal(
                    'looper; charset=utf-8');
                executed++;
            }
        };
        headers['Content-Type'] = 'looper; charset=utf-8';
        responder.send({ method: 'GET' }, res, 'body', headers);
        expect(executed).to.equal(1);
    });

    it('sets content length properly', function() {
        var executed = 0,
            headers = {},
            pixel = imageFixture.replace('{host}', host),
            contentLength = Buffer.byteLength(('body' + pixel), 'utf8');

        res.setHeader = function(type, data) {
            if (type === 'Content-Length') {
                expect(data).to.equal(contentLength);
                executed++;
            }
        };
        headers['Content-Type'] = 'text/html; charset=utf-8';
        responder.send({ method: 'GET', url: '/' }, res, 'body', headers);
        expect(executed).to.equal(1);
    });

    it('sets headers via "res.local.headers"', function() {
        var executed = 0,
            headers = {};
        headers['xyz'] = '123';

        res.setHeader = function(type, data) {
            if (type === 'xyz') {
                expect(data).to.equal('123');
                executed++;
            }
        };

        headers['Content-Type'] = 'text/html; charset=utf-8';
        responder.send({ method: 'GET', url: '/' }, res, 'body', headers);
        expect(executed).to.equal(1);
    });

    it('converts objects to strings', function() {
        var executed = 0,
            headers = {};
        res.end = function(body) {
            expect(body).to.equal('{"test":"test"}');
            executed++;
        };
        headers['Content-Type'] = 'application/test';
        responder.send({}, res, { test: 'test' }, headers);
        expect(executed).to.equal(1);
    });

    it('doesn\'t do anything if the response has already ended', function() {
        var called = false,
            responder = implementation(host);

        responder.send = function() { called = true; };
        responder.respond({}, { finished: true }, null, null);
        expect(called).to.equal(false);
    });

    it('sends JSON if t_output=json exists in url', function() {
        var responder = implementation(host);

        responder.send = function(req, res, body, headers) {
            expect(headers['Content-Type']).to.equal('text/plain; charset=utf-8');
            expect(body).to.eql({});
        };
        responder.respond({ url: 'test&t_output=json' }, { locals: { config: {} } }, {}, null);
    });

    it('does not send JSON if t_output=json is ommited in url & document string', function() {
        var responder = implementation(host);

        responder.send = function(req, res, body, headers) {
            expect(headers['Content-Type']).to.not.equal('text/plain');
            expect(body).to.equal('string');
        };
        responder.respond({ url: 'test&t_output=text' }, { locals: { config: {} } }, 'string', null);
    });

    it('sends JSON if t_output=json is ommited in url but document is of type Object', function() {
        var responder = implementation(host);

        responder.send = function(req, res, body, headers) {
            expect(headers['Content-Type']).to.equal('text/plain; charset=utf-8');
        };
        responder.respond({ url: 'test' }, { locals: { config: {} } }, {}, null);
    });

    it('supports content type being set via t_contentType', function() {
        var responder = implementation(host);

        responder.send = function(req, res, body, headers) {
            expect(headers['Content-Type']).to.equal('custom/content; charset=utf-8');
        };
        responder.respond({ url: 'test' }, { locals: { config: { contentType: 'custom/content' } } }, {}, null);
    });

    it('supports headers via "res.local.headers"', function() {
        var responder = implementation(host);

        responder.send = function(req, res, body, headers) {
            expect(headers['xyz']).to.equal('123');
        };
        responder.respond({ url: 'test' }, { locals: { headers: { xyz: '123' } } }, {}, null);
    });
});
