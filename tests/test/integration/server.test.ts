import * as fs from 'fs';
import * as request from 'request';
import * as _ from 'lodash';
import { expect } from 'chai';
import * as crypto from 'crypto';

enum RedisVerificationType {
    Key = 'Key',
    Ttl = 'Ttl'
}

describe('tabula', () => {
    const TABULA_URL = process.env.TABULA_URL;    
    const MOCK_SERVER_URL = process.env.MOCK_SERVER_URL;
    const LOCALHOST_CAPI_ARTICLE_URL = MOCK_SERVER_URL + 'content/v2/15e1847a075d7d293062d302da150668';
    const CAPI_ARTICLE_URL = 'http://mock-server/content/v2/15e1847a075d7d293062d302da150668';
    const LOCALHOST_CAPI_COLLECTION_URL = MOCK_SERVER_URL + 'content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7';
    const CAPI_COLLECTION_URL = 'http://mock-server/content/v2/collection/4d2cca2ccdb9187205750fb1ca5025c7';
    const LOCALHOST_CAPI_SEARCH_URL = MOCK_SERVER_URL + 'content/v2/collection/3abcca2ccdb9187205750fb1ca50abc1';
    const CAPI_SEARCH_URL = 'http://mock-server/content/v2/collection/3abcca2ccdb9187205750fb1ca50abc1';
    const LOCALHOST_FOX_SPORTS_URL = MOCK_SERVER_URL + '/3.0/api/sports/afl/series/1/seasons/121/fixturesandresults.json';
    const FOX_SPORTS_URL = 'http://mock-server/3.0/api/sports/afl/series/1/seasons/121/fixturesandresults.json';
    const TABULA_ARTICLE_URL = TABULA_URL + CAPI_ARTICLE_URL;
    const TABULA_COLLECTION_URL = TABULA_URL + CAPI_COLLECTION_URL;
    const TABULA_SEARCH_URL = TABULA_URL + CAPI_SEARCH_URL;
    const TABULA_FOX_SPORTS_URL = process.env.TABULA_URL + FOX_SPORTS_URL;
    const articleKey = 'default-' + CAPI_ARTICLE_URL;
    const collectionKey = 'capi-collection-' + CAPI_COLLECTION_URL;
    const searchKey = 'capi-search-' + crypto.createHash('md5').update(CAPI_SEARCH_URL, 'utf8').digest('hex');
    const foxSportsKey = 'default-' + FOX_SPORTS_URL;

    it('GET and persist capi article', (done) => {
        request(LOCALHOST_CAPI_ARTICLE_URL, (err: Error, response: any, body: any) => {
            if (!err) {
                const capiArticleBody = JSON.parse(response.body);

                request(TABULA_ARTICLE_URL, (err: Error, response: any, body: any) => {
                    if (!err) {
                        const tabulaArticleBody = JSON.parse(response.body);
                        expect(_.isEqual(capiArticleBody, tabulaArticleBody)).to.be.true;
                        done();
                    } else {
                        return done(err);
                    }
                });
            } else {
                return done(err);
            }
        });
    });

    it('GET and persist capi collection', done => {
        request(LOCALHOST_CAPI_COLLECTION_URL, (err: Error, response: any, body: any) => {
            if (!err) {
                const capiCollectionBody = JSON.parse(response.body);

                request(TABULA_COLLECTION_URL, (err: Error, response: any, body: any) => {
                    if (!err) {
                        const tabulaCollectionBody = JSON.parse(response.body);
                        expect(_.isEqual(capiCollectionBody, tabulaCollectionBody)).to.be.true;
                        done();
                    } else {
                        return done(err);
                    }
                });
            } else {
                return done(err);
            }
        });
    });

    it('GET and persist capi search', done => {
        request(LOCALHOST_CAPI_SEARCH_URL, (err: Error, response: any, body: any) => {
            if (!err) {
                const capiSearchBody = JSON.parse(response.body);
                request(TABULA_SEARCH_URL, (err: Error, response: any, body: any) => {
                    if (!err) {
                        const tabulaSearchBody = JSON.parse(response.body);
                        expect(_.isEqual(capiSearchBody, tabulaSearchBody)).to.be.true;
                        done();
                    } else {
                        return done(err);
                    }
                });
            } else {
                return done(err);
            }
        });
    });

    it('GET and persist fox sporst', done => {
        request(LOCALHOST_FOX_SPORTS_URL, (err: Error, response: any, body: any) => {
            if (!err) {
                const capiFoxSportsBody = JSON.parse(response.body);
                request(TABULA_FOX_SPORTS_URL, (err: Error, response: any, body: any) => {
                    if (!err) {
                        const tabulaFoxSportsBody = JSON.parse(response.body);
                        expect(_.isEqual(capiFoxSportsBody, tabulaFoxSportsBody)).to.be.true;
                        done();
                    } else {
                        return done(err);
                    }
                });
            } else {
                return done(err);
            }
        });
    });
});
