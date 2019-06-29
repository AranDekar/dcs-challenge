const modules = require('../../../../../transformers/vidora/modules/modules'),
    conf = require('../../../../../conf'),
    expect = require('chai').expect;

const modulesFixture = [
    {
        'id': '/news/south-australia'
    },
    {
        'id': '/news/law-order'
    },
    {
        'id': '/entertainment/celebrity'
    },
    {
        'id': '/news/national'
    },
    {
        'id': '/entertainment/confidential'
    },
    {
        'id': '/business/sa-business-journal'
    },
    {
        'id': '/sport/cricket'
    },
    {
        'id': '/sport/football'
    }
];

const req = {
        params: {
            user_id: 'some-nk'
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

describe('Calling Vidora modules endpoint', () => {
    it('simply returns the response from the agent', (done) => {
        const agent = (url, cb) => {
            return cb(null, modulesFixture);
        };

        const middleware = modules(agent);
        middleware(req, res, () => {
            expect(res.locals.data.vidora).to.equal(modulesFixture);
            done();
        });
    });

    it('passes errors into default middleware', (done) => {
        const agent = (url, cb) => {
            cb({ message: 'Kaboom' });
        };

        const middleware = modules(agent);
        middleware(req, res, (err) => {
            expect(err.message).to.equal('Kaboom');
            done();
        });
    });
});
