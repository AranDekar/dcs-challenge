'use strict';

let basePath = '../../../../../../../transformers/1.0/components/article/middleware',
    expect = require('chai').expect,
    implementation = require(`${basePath}/content-enforcer_implementation`);

describe('content enforcer middleware', () => {
    const middleware = implementation();

    describe('sends an error', () => {
        it('when no valid data', (done) => {
            middleware({}, {
                locals: { data: {} },
                status: (code) => {
                    expect(code, 'A status code of 404 is set').to.equal(404);

                    return {
                        end: (response) => {
                            expect(
                                JSON.parse(response),
                                'valid error payload provided'
                            ).to.eql({
                                message: 'Content not available.',
                                code: '404',
                                raw: '{}'
                            });

                            done();
                        }
                    };
                }
            }, () => {
                done(new Error('next should not have been called'));
            });
        });

        it('when "CONTENT_TYPE" not valid', (done) => {
            middleware({}, {
                locals: {
                    data: {
                        contentType: 'UNKNOWN'
                    }
                },
                status: (code) => {
                    expect(
                        code,
                        'A status code of 404 is set'
                    ).to.equal(404);

                    return {
                        end: (response) => {
                            expect(
                                JSON.parse(response),
                                'valid error payload provided'
                            ).to.eql({
                                message: 'Content not available.',
                                code: '404',
                                raw: '{\"contentType\":\"UNKNOWN\"}'
                            });

                            done();
                        }
                    };
                }
            }, () => {
                done(new Error('next should not have been called'));
            });
        });
    });

    describe('does not send an error', () => {
        it('when content is of type "NEWS_STORY"', (done) => {
            middleware({}, {
                locals: {
                    data: {
                        contentType: 'NEWS_STORY'
                    }
                },
                status: (code) => {
                    throw new Error('res.status should not be called');
                }
            }, done);
        });

        it('when content is of type "IMAGE_GALLERY"', (done) => {
            middleware({}, {
                locals: {
                    data: {
                        contentType: 'IMAGE_GALLERY'
                    }
                },
                status: (code) => {
                    throw new Error('res.status should not be called');
                }
            }, done);
        });

        it('when content is of type "PROMO"', (done) => {
            middleware({}, {
                locals: {
                    data: {
                        contentType: 'PROMO'
                    }
                },
                status: (code) => {
                    throw new Error('res.status should not be called');
                }
            }, done);
        });
    });
});
