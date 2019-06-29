const foxsports = require('./../../../../../transformers/sport/profile/foxsports'),
    conf = require('./../../../../../conf'),
    expect = require('chai').expect;

const playerId = 'cricket/series/26/players/601079/',
    req = { params:
    {
        '0': playerId
    }
    },
    res = {
        locals: {
            data: {},
            product: {
                name: 'tcog'
            }
        }
    };

describe('Foxsports profile middleware', () => {
    it('calls the agent with a url built from the conf, playerId and userkey', (done) => {
        const agent = (url, cb) => {
            const expectedUrl = `${conf.foxsportsAPI}/3.0/api/sports/${playerId}/stats.json?userkey=${conf.foxsportsApiKey}`;
            expect(url).to.equal(expectedUrl);
            done();
        };

        const middleware = foxsports(agent);
        middleware(req, res, () => {});
    });

    it('stores the foxsports response in res.locals.data.foxsports', () => {
        const agent = (url, cb) => {
            return cb(null, { profile: true });
        };

        const middleware = foxsports(agent);
        middleware(req, res, () => {
            expect(res.locals.data.foxsports).to.be.ok;
            expect(res.locals.data.foxsports.profile).to.be.true;
        });
    });

    it('passes errors into default middleware', (done) => {
        const agent = (url, cb) => {
            cb({ message: 'Kaboom' });
        };

        const middleware = foxsports(agent);
        middleware(req, res, (err) => {
            expect(err.message).to.equal('Kaboom');
            done();
        });
    });
});
