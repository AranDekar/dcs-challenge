const expect = require('chai').expect,
    get = require('../../transformers/get'),
    nock = require('nock');

describe('#get', () => {
    let example;

    afterEach(() => {
        nock.cleanAll();
    });

    describe('headers', () => {
        it('User-Agent: DCS-TCOG/5.0 (+dl-dcs@news.com.au)', (done) => {
            example = nock('http://example.com')
                .matchHeader('user-agent', 'DCS-TCOG/5.0 (+dl-dcs@news.com.au)')
                .get('/')
                .reply(200);

            get('http://example.com/', {}, (err, res) => {
                expect(example.isDone()).to.be.true;

                done();
            });
        });

        it('Accept-Encoding: gzip, deflate', (done) => {
            example = nock('http://example.com')
                .matchHeader('accept-encoding', 'gzip, deflate')
                .get('/')
                .reply(200);

            get('http://example.com/', {}, (err, res) => {
                expect(example.isDone()).to.be.true;

                done();
            });
        });

        describe('custom', () => {
            it('Accepts: application/json', (done) => {
                example = nock('http://example.com')
                    .matchHeader('accepts', 'application/json')
                    .get('/')
                    .reply(200);

                get('http://example.com/', { 'Accepts': 'application/json' }, (err, res) => {
                    expect(example.isDone()).to.be.true;

                    done();
                });
            });
        });
    });

    describe('url', () => {
        it('ROBOTS.txt', (done) => {
            example = nock('http://example.com')
                .get('/ROBOTS.txt')
                .reply(200);

            get('http://example.com/ROBOTS.txt', {}, (err, res) => {
                expect(example.isDone()).to.be.true;
                expect(res.url).to.be.eq('');

                done();
            });
        });
    });

    describe('statusCode', () => {
        it('200', (done) => {
            example = nock('http://example.com')
                .get('/')
                .reply(200);

            get('http://example.com/', {}, (err, res) => {
                expect(example.isDone()).to.be.true;
                expect(res.statusCode).to.be.eq(200);

                done();
            });
        });
    });

    describe('body', () => {
        it('<h1>Hello World</h1>', (done) => {
            example = nock('http://example.com')
                .get('/')
                .reply(200, '<h1>Hello World</h1>');

            get('http://example.com/', {}, (err, res) => {
                expect(example.isDone()).to.be.true;
                expect(res.body).to.eq('<h1>Hello World</h1>');

                done();
            });
        });
    });
});
