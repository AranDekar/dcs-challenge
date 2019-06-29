const expect = require('chai').expect,
    get = require('../../transformers/get'),
    getRetry = require('../../transformers/getRetry'),
    nock = require('nock');

describe('#getRetry', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('200', (done) => {
        const first = nock('http://example.com')
            .get(/\/v3\/articles\/839deb2c4c7024630910d4ef57d58f78\?api_key=wy745368rhtznnrprnqzp5dt/)
            .reply(200, '<h1>Hello World</h1>');

        const url = 'http://example.com/v3/articles/839deb2c4c7024630910d4ef57d58f78?api_key=wy745368rhtznnrprnqzp5dt';

        get(url, {}, (err, response) => {
            getRetry(url, {}, { api_key: 'vypycn3st9t49haf8mce927y' }, () => {}, err, response, (err, response) => {
                expect(first.isDone()).to.be.true;
                expect(response.statusCode).to.eq(200);
                expect(response.body).to.eq('<h1>Hello World</h1>');

                done();
            });
        });
    });

    it('403 "<h1>Developer Over Rate</h1>"', (done) => {
        const first = nock('http://example.com')
            .get(/\/v3\/articles\/839deb2c4c7024630910d4ef57d58f78\?api_key=wy745368rhtznnrprnqzp5dt/)
            .reply(403, { body: '<h1>Developer Over Rate</h1>' });

        const second = nock('http://example.com')
            .get(/\/v3\/articles\/839deb2c4c7024630910d4ef57d58f78\?api_key=vypycn3st9t49haf8mce927y/)
            .reply(200, '<h1>Hello World</h1>');

        const url = 'http://example.com/v3/articles/839deb2c4c7024630910d4ef57d58f78?api_key=wy745368rhtznnrprnqzp5dt';

        get(url, {}, (err, response) => {
            getRetry(url, {}, { api_key: 'vypycn3st9t49haf8mce927y' }, () => {}, err, response, (err, response) => {
                expect(first.isDone()).to.be.true;
                expect(second.isDone()).to.be.true;
                expect(response.statusCode).to.eq(200);
                expect(response.body).to.eq('<h1>Hello World</h1>');

                done();
            });
        });
    });

    it('500', (done) => {
        const first = nock('http://example.com')
            .get(/\/v3\/articles\/839deb2c4c7024630910d4ef57d58f78\?api_key=wy745368rhtznnrprnqzp5dt/)
            .reply(500, '<h1>Hello World</h1>');

        const url = 'http://example.com/v3/articles/839deb2c4c7024630910d4ef57d58f78?api_key=wy745368rhtznnrprnqzp5dt';

        get(url, {}, (err, response) => {
            getRetry(url, {}, { api_key: 'vypycn3st9t49haf8mce927y' }, () => {}, err, response, (err, response) => {
                expect(first.isDone()).to.be.true;
                expect(response.statusCode).to.eq(500);
                expect(response.body).to.eq('<h1>Hello World</h1>');

                done();
            });
        });
    });
});
