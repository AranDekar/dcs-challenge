var normaliser = require('../../../../../transformers/popular/normalisers/reorder-collections-by-domains'),
    expect = require('chai').expect,
    doc;

describe('collection domains match order of domain query params', function() {
    var domains = ['two.com.au', 'one.com.au', 'unrecognised.com.au'],
        doc;

    beforeEach(function() {
        doc = domains.reduce(function(previous, current) {
            previous['popular-' + current] = {
                results: [{
                    contentType: 'COLLECTION',
                    domains: [current],
                    related: [
                        {
                            title: 'some title',
                            domainLinks: [{
                                name: 'one.com.au',
                                link: 'foo'
                            }],
                            duration: 0
                        }
                    ]
                }]
            };

            return previous;
        }, {});
    });

    it('orders by domains in the req, ommitting domains not present in query', function(done) {
        var mock = {
            req: {
                query: { 't_domain': 'one.com.au,two.com.au' }
            },
            res: { locals: { data: doc, config: { domain: 'one.com.au,two.com.au' } } }
        };

        normaliser(mock.req, mock.res, function() {
            var results = mock.res.locals.data.results;

            expect(results[0].domains[0]).to.equal('one.com.au');
            expect(results[1].domains[0]).to.equal('two.com.au');
            expect(results[2]).to.be.not.ok;

            done();
        });
    });

    it('removes related results which do not have domain links', function(done) {
        var mock = {
            req: {
                query: { 't_domain': 'one.com.au,two.com.au' }
            },
            res: { locals: { data: doc, config: { domain: 'one.com.au,two.com.au' } } }
        };

        doc['popular-one.com.au'].results[0].related[0].domainLinks = [];

        normaliser(mock.req, mock.res, function() {
            var results = mock.res.locals.data.results;
            expect(results[0].domains[0]).to.equal('one.com.au');
            expect(results[0].related.length).to.equal(0);
            done();
        });
    });

    it('does not error if item.domainLinks undefined', function(done) {
        var mock = {
            req: {
                query: { 't_domain': 'one.com.au,two.com.au' }
            },
            res: { locals: { data: doc, config: { domain: 'one.com.au,two.com.au' } } }
        };

        delete doc['popular-one.com.au'].results[0].related[0].domainLinks;

        normaliser(mock.req, mock.res, function() {
            var results = mock.res.locals.data.results;
            expect(results[0].domains[0]).to.equal('one.com.au');
            expect(results[0].related.length).to.equal(0);
            done();
        });
    });

    it('returns a subset of data if not a legacy popular call', function(done) {
        var mock = {
            req: {
                query: { 't_domain': 'one.com.au,two.com.au' }
            },
            res: { locals: { data: doc, config: { domain: 'one.com.au,two.com.au' } } }
        };

        normaliser(mock.req, mock.res, function() {
            var result = mock.res.locals.data.results[0].related[0];
            expect(
                result,
                'should only have "title", "domains" & "domainLinks" keys'
            ).to.have.all.keys(['title', 'domains', 'domainLinks']);
            done();
        });
    });

    it('returns a all data if a legacy popular call', function(done) {
        var mock = {
            req: {
                query: { 't_domain': 'one.com.au,two.com.au' }
            },
            res: {
                locals: {
                    data: doc,
                    config: {
                        domain: 'one.com.au,two.com.au'
                    },
                    legacy: {}
                }
            }
        };

        normaliser(mock.req, mock.res, function() {
            var result = mock.res.locals.data.results[0].related[0];
            expect(
                result,
                'should have a duration key'
            ).to.have.any.keys(['duration']);
            done();
        });
    });
});
