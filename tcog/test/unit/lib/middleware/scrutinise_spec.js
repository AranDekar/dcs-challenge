var fileUnderTest = '../../../../lib/middleware/scrutinise',
    scrutinise = require(fileUnderTest),
    _ = require('lodash'),
    expect = require('chai').expect;

describe('Scrutinise Middleware', function() {
    var res = {},
        req = {},
        build = function() {
            var resBuild = {};
            resBuild.end = function() {};
            resBuild.set = function() {};
            resBuild.status = function(args) {
                return resBuild;
            };
            resBuild.send = function(doc) {

            };
            return resBuild;
        };

    beforeEach(function() {
        res = build();
    });

    afterEach(function() {
        req = {};
    });

    it('Creates a string from the headers', function() {
        req.headers = {
            'body': 'a',
            'params': 'b',
            'query': 'l'
        };
        req.header = function(key) {
            return req.headers[key];
        };
        res.send = function(doc) {
            var items = doc.split('\n');
            expect(items[2]).to.be.equal('body: a');
            expect(items[3]).to.be.equal('params: b');
            expect(items[4]).to.be.equal('query: l');
        };

        scrutinise(req, res);
    });

    it('must have sorted keys', function() {
        _.each(_.clone(scrutinise.keys).sort(), function(val, index) {
            expect(val).to.be.equal(scrutinise.keys[index]);
        });
    });
});
