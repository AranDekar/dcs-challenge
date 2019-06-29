
var tpl = require('util').format,
    expect = require('chai').expect,
    getOptions = require('../../../../../transformers/popular/helpers/options');

describe('components/popular-combined', function() {
    describe('/helpers/options', function() {
        var domains = 'news.com.au,dailytelegraph.com.au'.split(','),
            catTemplate = '((' + [
                'categories.value:"/section/%s/collection/popular-content/all/today/"',
                'origin:omniture',
                'domains:%s'
            ].join(')AND(') + '))',
            options;

        beforeEach(function() {
            options = getOptions(domains);
        });

        it('returns undefined if a non array value passed', function() {
            expect(getOptions()).to.not.be.ok;
            expect(getOptions({})).to.not.be.ok;
            expect(getOptions(domains)).to.be.ok;
        });

        it('returns an array of options if valid query parameters found', function() {
            expect(options).to.be.an('array');
            expect(options.length).to.equal(2);
        });

        it('returns a correctly set options item', function() {
            options.forEach(function(option) {
                expect(option.query).to.be.ok;
            });

            domains.forEach(function(domain, index) {
                expect(options[index].query.query)
                    .to.equal(tpl(catTemplate, domain, domain));
            });
        });

        it('uses category from locals', function() {
            var locals = {
                    config: {
                        category: '/section/some/collection/foo/'
                    }
                },
                catTemplate = '((' + [
                    'categories.value:"/section/some/collection/foo/"',
                    'origin:omniture',
                    'domains:%s'
                ].join(')AND(') + '))',
                options = getOptions(domains, locals);

            domains.forEach(function(domain, index) {
                var query = options[index].query.query,
                    expected = tpl(catTemplate, domain);

                expect(query).to.equal(expected);
            });
        });

        it('uses origin from locals', function() {
            var locals = {
                    config: {
                        category: '/section/some/collection/foo/',
                        origin: 'methode'
                    }
                },
                catTemplate = '((' + [
                    'categories.value:"/section/some/collection/foo/"',
                    'origin:methode',
                    'domains:%s'
                ].join(')AND(') + '))',
                options = getOptions(domains, locals);

            domains.forEach(function(domain, index) {
                var query = options[index].query.query,
                    expected = tpl(catTemplate, domain);

                expect(query).to.equal(expected);
            });
        });
    });
});
