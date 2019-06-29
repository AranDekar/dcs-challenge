const profileMiddleware = require('./../../../../../transformers/sport/profile'),
    expect = require('chai').expect,
    nock = require('nock'),
    conf = require('./../../../../../conf'),
    request = require('supertest'),
    service = require('./../../../../../service');

const playerId = 'cricket/series/26/players/601079',
    playerName = 'Glen+Maxwell';

describe('Player profile', () => {
    let foxsports, capi;

    describe('success conditions', () => {
        beforeEach(() => {
            foxsports = nock(`${conf.foxsportsAPI}`)
                .log(console.log)
                .get(`/3.0/api/sports/${playerId}/stats.json?userkey=${conf.products['tcog'].foxsportsApiKey}`)
                .reply(200, (uri, requestBody) => {
                    return { profile: true };
                });
        });

        afterEach(() => {
            nock.cleanAll();
        });

        it('calls Foxsports with the playerId', (done) => {
            request(service)
                .get(`/sport/profile/${playerId}?t_product=tcog&t_output=json`)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    const resp = JSON.parse(res.text);

                    expect(foxsports.isDone()).to.be.true;
                    expect(resp.data.foxsports.profile).to.be.true;
                    done();
                });
        });

        it('optionally calls CAPI v3 search if the t_player_name URI parameter is provided', (done) => {
            capi = nock(`${conf.capiV3API}`)
                .log(console.log)
                .get(`/v3/search?extendedHeadline=${encodeURIComponent(playerName)}&api_key=${conf.capiV3APIKey}`)
                .reply(200, (uri, requestBody) => {
                    return { results: true };
                });

            request(service)
                .get(`/sport/profile/${playerId}?t_product=tcog&t_output=json&t_player_name=${encodeURIComponent(playerName)}`)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    const resp = JSON.parse(res.text);

                    expect(foxsports.isDone()).to.be.true;
                    expect(capi.isDone()).to.be.true;
                    expect(resp.data.foxsports.profile).to.be.true;
                    expect(resp.data.capi.results).to.be.true;
                    done();
                });
        });
    });
});
