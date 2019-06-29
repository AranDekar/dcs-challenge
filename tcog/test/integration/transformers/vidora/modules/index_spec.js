const profileMiddleware = require('./../../../../../transformers/vidora/modules'),
    expect = require('chai').expect,
    nock = require('nock'),
    conf = require('./../../../../../conf'),
    request = require('supertest'),
    service = require('./../../../../../service');

const nk = '15ad0692f00-6b6d2fb8-0e71-4b37-b455-74bd3708b712',
    modulesFixture = [
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

describe('Vidora modules', () => {
    let vidora;

    describe('success conditions', () => {
        beforeEach(() => {
            vidora = nock(`${conf.vidoraAPI}`)
                .log(console.log)
                .get(`/v1/users/${nk}/modules/?api_key=${conf.vidoraApiKey}`)
                .reply(200, (uri, requestBody) => {
                    return modulesFixture;
                });
        });

        afterEach(() => {
            nock.cleanAll();
        });

        it('calls vidora with the nk', (done) => {
            request(service)
                .get(`/p13n/users/${nk}/modules?t_product=tcog&t_output=json`)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    const resp = JSON.parse(res.text);

                    expect(vidora.isDone()).to.be.true;
                    expect(resp.data.vidora).to.deep.equals(modulesFixture);
                    done();
                });
        });
    });
});
