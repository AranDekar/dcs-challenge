const capi = require('./../../../../../transformers/sport/profile/capi'),
    conf = require('./../../../../../conf'),
    expect = require('chai').expect;

const playerName = 'Glen Maxwell',
    req = { query: {} },
    res = {
        locals: {
            data: {},
            product: {
                name: 'tcog'
            }
        }
    };

describe('capi v3 match search on profile name', () => {
    it('calls next immediately if t_player_name is missing', (done) => {
        let called = false;
        const agent = (url, cb) => {
            called = true;
            return cb();
        };

        const middleware = capi(agent);
        middleware(req, res, () => {
            expect(called).to.be.false;
            done();
        });
    });

    it('calls CAPI v3 with a search on extendedHeadline for playerName', (done) => {
        req.query.t_player_name = playerName;
        const apiKey = conf.capiV3APIKey;

        const agent = (url, cb) => {
            const expectedUrl = `${conf.capiV3API}/v3/search?extendedHeadline=${encodeURIComponent(playerName)}&api_key=${apiKey}`;
            expect(url).to.equal(expectedUrl);
            done();
        };

        const middleware = capi(agent);
        middleware(req, res, () => {});
    });

    it('passes errors into default middleware', (done) => {
        const agent = (url, cb) => {
            cb({ message: 'Kaboom' });
        };

        const middleware = capi(agent);
        middleware(req, res, (err) => {
            expect(err.message).to.equal('Kaboom');
            done();
        });
    });
});
