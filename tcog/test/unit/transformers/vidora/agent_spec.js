const expect = require('chai').expect,
    generateAgent = require('../../../../transformers/vidora/agent');

describe('Default vidora agent', () => {
    it('passes the given url to the supplied agent', (done) => {
        const url = 'http://somedestination.com';

        const fakeAgent = (url2, headers, stream, cb) => {
            expect(url2).to.equal(url);
            done();
            return cb();
        };

        const agent = generateAgent(fakeAgent);
        agent(url, () => {});
    });

    it('handles an error', (done) => {
        const fakeAgent = (url, headers, stream, cb) => {
            return cb({ message: 'an error' });
        };

        const agent = generateAgent(fakeAgent);

        agent('http://something', (err) => {
            expect(err.message).to.equal('an error');
            return done();
        });
    });

    it('returns the results as JSON', (done) => {
        const fakeAgent = (url, headers, stream, cb) => {
            const resp = {
                body: JSON.stringify({ personalisedData: 'hello' })
            };

            return cb(null, resp);
        };

        const agent = generateAgent(fakeAgent);

        agent('http://something', (err, result) => {
            expect(result.personalisedData).to.equal('hello');
            return done();
        });
    });
});
