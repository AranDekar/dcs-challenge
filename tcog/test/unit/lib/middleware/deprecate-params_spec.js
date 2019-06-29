'use strict';

var deprecatorImplementation =
        require('./../../../../lib/middleware/deprecate-params_implementation'),
    req, res,
    logCount = 0,
    expect = require('chai').expect;

const loggerWrapper = {
    debug: function(logObject) {
        expect(logObject,
            'The data logged from the deprecator should be an object')
            .to.be.an('object');

        expect(logObject.event,
            "The logger should specify 'deprecatedParam' as the event")
            .to.equal('deprecatedParam');

        expect(logObject.url,
            'The logger should record the URL')
            .to.equal('/testing/url');

        expect(logObject.param,
            'The logger should record the paramter being deprecated').to.be.ok;

        expect(logObject.note,
            'The logger should record a note about the deprecation strategy')
            .to.be.ok;

        logCount++;
    }
};

describe('deprecation rules', function() {
    var deprecator = deprecatorImplementation(loggerWrapper);

    beforeEach(function() {
        logCount = 0;
        req = {
            url: '/testing/url',
            query: {},
            params: {}
        };

        res = {};
    });

    afterEach(function() {
        req = null;
        res = null;
    });

    describe('renaming url params with other prefixes', function() {
        var tester = function(param, renamed, done, renameNotAllowed) {
            req.query[param] = 'aValue';

            deprecator(req, res, function(err, result) {
                expect(req.query[renamed]).to.be.ok;
                expect(req.query[renamed]).to.equal('aValue');

                if (renameNotAllowed) {
                    expect(req.query[param]).to.be.ok;
                    expect(logCount,
                        'The deprecator should not a deprecation, since nothing happened')
                        .to.equal(0);
                } else {
                    expect(req.query[param]).to.not.be.ok;
                    expect(logCount,
                        'The deprecator should log the deprecation')
                        .to.equal(1);
                }

                done();
            });
        };

        it('renames product URL var to t_product var', function(done) {
            tester('product', 't_product', done);
        });

        it('renames display: URL vars to tcog:display:.. vars', function(done) {
            tester('display:test', 'td_test', done);
        });

        it('renames subkey: URL var to tc_subkey', function(done) {
            tester('subkey', 'tc_subkey', done);
        });

        it('renames key: URL var to tc_subkey', function(done) {
            tester('key', 'tc_key', done);
        });

        it('does not rename keyword: URL var to tc_keyword', function(done) {
            tester('keyword', 'keyword', done, true);
        });

        it('renames tcog:mobile to t_mobile', function(done) {
            tester('tcog:mobile', 't_mobile', done);
        });

        it('renames display:foo to td_foo', function(done) {
            tester('display:foo', 'td_foo', done);
        });

        it('renames esi to t_esi', function(done) {
            tester('esi', 't_esi', done);
        });

        it('tcog parameters are snake cased, not camel cased', function(done) {
            req.query['t_dateHeader'] = 'aValue';
            req.query['tcog:display:dateHeader'] = 'aValue';

            deprecator(req, res, function(err, result) {
                expect(req.query['td_date_header']).to.be.ok;
                expect(req.query['td_date_header']).to.equal('aValue');

                ['t_dataHeader', 'tcog:display:dateHeader'].forEach(function(param) {
                    expect(req.query[param]).to.not.be.ok;
                });

                done();
            });
        });
    });

    describe('renaming and cleaning up (legacy from /common/search/:template/:format) vars', function() {
        it('renames then deletes req.params.format (legacy from /common/search/:template/:format)', function(done) {
            req.params.format = 'foo';

            deprecator(req, res, function(err, result) {
                expect(req.query['t_layout']).to.be.ok;
                expect(req.query['t_layout']).to.equal('foo');
                expect(req.params['format']).to.not.be.ok;
                done();
            });
        });

        it('deletes req.params.template (legacy from /common/search/:template/:format)', function(done) {
            req.params.template = 'foo';
            deprecator(req, res, function(err, result) {
                expect(req.params.template).to.not.be.ok;
                done();
            });
        });
    });

    describe('template renaming, style parameter renaming', function() {
        it('popular is now popular-footer', function(done) {
            req.query['display:style'] = 'popular';

            deprecator(req, res, function(err, result) {
                expect(req.query['t_template']).to.equal('popular-footer');
                done();
            });
        });

        it('popular is now popular-footer', function(done) {
            req.query['tcog:display:style'] = 'popular';

            deprecator(req, res, function(err, result) {
                expect(req.query['t_template']).to.equal('popular-footer');
                done();
            });
        });
    });
});
