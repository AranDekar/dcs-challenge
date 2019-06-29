let articleImplementation = require('../../../../../../transformers/1.0/components/article/index_implementation'),
    expect = require('chai').expect;

describe('/component/article', function() {
    it('Sends through parameters required for metering', function() {
        let parametersPassedThrough = false,
            executeCount = 0,
            config = {},
            req = {},
            res = {
                locals: {
                    data: {
                        methodeAssociation: {
                            'results': [
                                'abc123'
                            ]
                        },
                        results: [
                            {'title': 'article'}
                        ]
                    }
                }
            },
            middlewares = {
                'templateHandler': function() {}
            },
            normalisers = {},
            agentMiddleware = function(route, options) {
                executeCount++;

                if (!options || !options.query) return;
                if (options.query.domain === "{{ query.domain || res.locals.product.domain || res.locals.config.domain || '' }}" &&
                    options.query.includeDynamicMetadata === true) {
                    parametersPassedThrough = true;
                }
            },
            deconstructArticleURL = function() {
                return {
                    slug: 'from-modern-family-to-game-of-thrones-how-much-do-tv-stars-get-paid',
                    section: [ 'entertainment', 'tv' ],
                    sectionID: 1111112063226,
                    id: '1227014186666'
                };
            },
            interleaveMedia = function() {},
            _ = {
                compose: function() {
                    return function() {
                        return res.locals;
                    };
                }
            };

        articleImplementation(config, agentMiddleware, middlewares, normalisers, deconstructArticleURL, interleaveMedia, _);

        expect(executeCount).to.equal(1);
        expect(parametersPassedThrough).to.be.ok;
    });
});
