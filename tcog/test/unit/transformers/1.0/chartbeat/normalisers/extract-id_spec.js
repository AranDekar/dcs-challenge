'use strict';

var modulePath = '../../../../../../transformers/1.0/chartbeat/normalisers',
    expect = require('chai').expect,
    implementation = require(modulePath + '/extract-ids_implementation');

describe('chartbeatAPI/transformer', function() {
    describe('normaliser/extract-ids', function() {
        it('should be a function', function() {
            var extractIds = implementation();
            expect(extractIds).to.be.a('function');
            expect(
                extractIds.length,
                'has an arity of 3'
            ).to.equal(3);
        });

        describe('data.references', function() {
            it('not created if data.pages not found', function() {
                var extractIds = implementation(),
                    mocks = {
                        req: {},
                        res: { locals: { data: {} } }
                    };

                extractIds(mocks.req, mocks.res, function() {
                    expect(
                        mocks.res.locals.data.references,
                        'data.references should not be created'
                    ).to.be.an('undefined');
                });
            });

            it('created if data.pages found', function() {
                var extractIds = implementation(),
                    mocks = {
                        req: {},
                        res: { locals: { data: { pages: [] } } }
                    };

                extractIds(mocks.req, mocks.res, function() {
                    expect(
                        mocks.res.locals.data.references,
                        'data.references created'
                    ).to.be.an('array');
                    expect(
                        mocks.res.locals.data.references.length,
                        'data.references is empty'
                    ).to.equal(0);
                });
            });

            it('contains ids for "news-story" items', function() {
                var extractIds = implementation(),
                    mocks = {
                        req: {},
                        res: {
                            locals: {
                                data: {
                                    pages: [
                                        { path: '/foo/bar' },
                                        { path: '/foo/bar/news-story/123456' }
                                    ]
                                }
                            }
                        }
                    },

                    pagesLen = mocks.res.locals.data.pages.length;

                extractIds(mocks.req, mocks.res, function() {
                    expect(
                        mocks.res.locals.data.references,
                        'data.references created'
                    ).to.be.an('array');

                    expect(
                        mocks.res.locals.data.references.length,
                        'data.references contains matched story only'
                    ).to.equal(1);

                    expect(
                        mocks.res.locals.data.references[0],
                        'data.references contains matched story'
                    ).to.eql({
                        id: { value: '123456' }
                    });
                });
            });

            it('contains ids for "news-gallery" items', function() {
                var extractIds = implementation(),
                    mocks = {
                        req: {},
                        res: {
                            locals: {
                                data: {
                                    pages: [
                                        { path: '/foo/bar' },
                                        { path: '/foo/bar/image-gallery/123456' }
                                    ]
                                }
                            }
                        }
                    },

                    pagesLen = mocks.res.locals.data.pages.length;

                extractIds(mocks.req, mocks.res, function() {
                    expect(
                        mocks.res.locals.data.references,
                        'data.references created'
                    ).to.be.an('array');

                    expect(
                        mocks.res.locals.data.references.length,
                        'data.references contains matched gallery only'
                    ).to.equal(1);

                    expect(
                        mocks.res.locals.data.references[0],
                        'data.references contains matched gallery'
                    ).to.eql({
                        id: { value: '123456' }
                    });
                });
            });
        });
    });
});
