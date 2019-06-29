import * as mocha from 'mocha';
import { should, expect } from 'chai';
import * as supertest from 'supertest';
import { initialize } from '../../src/index';
import * as v3article1 from '../fixtures/v3tov2/v3-86f0a4cda1c57ca41ae232369b5b2b13.json';
import * as v3article2 from '../fixtures/v3tov2/v3-7939008bef306b53080c62b7bbfebe1f.json';
import * as v3collection from '../fixtures/v3tov2/v2-5f145d128a3c4ad74fd1c2a58401781f.json';


const root: V3Root = {
  get: async (url: string) => {
    switch (true) {
      case /content-dev\.api/.test(url):
        return v3article1;
      default:
        return {};
    }
  },
  getResources: async (ids: string[], apiKey: string, domain: string, includeDraft: boolean = false) => {
    switch (ids) {
      case ['86f0a4cda1c57ca41ae232369b5b2b13', '86f0a4cda1c57ca41ae232369b5b2b13']: return v3article1;
      case ['not-found']: throw 'Entity not found';
    }
  },
  getResource: async (id: string, apiKey: string, domain: string, includeDraft: boolean = false, bustTime: any, documentRevisionMajor: string, documentRevisionMinor: string) => {
    switch (id) {
      case '86f0a4cda1c57ca41ae232369b5b2b13': return v3article1;
      case '7939008bef306b53080c62b7bbfebe1f': return v3article2;
      case 'not-found': throw 'Entity not found';
    }
  },
  getResourceRevision: async (id: string, apiKey: string,  documentRevisionMajor: string, documentRevisionMinor: string) => {
    switch (id) {
      case '86f0a4cda1c57ca41ae232369b5b2b13': return v3article1;
    }
  },
  getCollection: async (id: string) => {
    switch (id) {
      case '5f145d128a3c4ad74fd1c2a58401781f': return v3collection;
    }
  },
  getSearch: async (args: object) => {
    throw 'no implemented';
  },
  articleBasicSearch: async () => {
    throw 'no implemented';
  },
  collectionBasicSearch: async (args: object) => {
    throw 'no implemented';
  },
  imageBasicSearch: async (args: object) => {
    throw 'no implemented';
  },
  searchAdvance: async (args: object) => {
    throw 'no implemented';
  },
  videoBasicSearch: async (args: object) => {
    throw 'no implemented';
  },
};

const request = supertest(initialize(root));

describe('GET /facade/content/v2/methode/<id>?document_revision_major=1&document_revision_minor=2', () => {
  it('it returns 200 OK', (done) => {
    request
      .get('/facade/content/v2/methode/86f0a4cda1c57ca41ae232369b5b2b13')
      .query({api_key: 'wy745368rhtznnrprnqzp5dt', document_revision_major: 1, document_revision_minor: 2})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        expect(res.body.id.value).to.eq('86f0a4cda1c57ca41ae232369b5b2b13');

        /** .related */

        expect(res.body.related.filter((item: any) => !!item).length).to.eq(12);

        /** .related[<video>] */

        expect(res.body.related.filter((item: any) => item.contentType === 'VIDEO').length).to.eq(2);

        /** .related[<image>] */

        expect(res.body.related.filter((item: any) => item.contentType === 'IMAGE').length).to.eq(9);

        /** .related[<promo>] */

        expect(res.body.related.filter((item: any) => item.contentType === 'PROMO').length).to.eq(1);

        done();
      });
  });
});

describe('GET /facade/content/v2/methode/<id>', () => {
  it('it returns "dynamicMetadata" based on domain=couriermail.com.au', (done) => {
    request
      .get('/facade/content/v2/methode/86f0a4cda1c57ca41ae232369b5b2b13')
      .query({api_key: 'wy745368rhtznnrprnqzp5dt', domain: 'couriermail.com.au'})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        expect(res.body.dynamicMetadata.route).to.eq('news/national');
        expect(res.body.dynamicMetadata.adTarget).to.eq('NEWS.NATIONAL');
        expect(res.body.dynamicMetadata.caption).to.be.a('undefined');
        expect(res.body.dynamicMetadata.link).to.eq('https://www.couriermail.com.au/news/national/golden-age-gold-coasts-city-council-to-break-ground-on-15m-robina-city-parklands-this-year/news-story/86f0a4cda1c57ca41ae232369b5b2b13');

        done();
      });
  });

  it('it returns 500 INTERNAL SERVER ERROR', (done) => {
    request
      .get('/facade/content/v2/methode/server-error')
      .query({api_key: 'wy745368rhtznnrprnqzp5dt'})
      .expect(500)
      .end(function(err, res) {
        if (err) return done(err);

        expect(res.body.data.getV2).to.be.a('null');

        done();
      });
  });

  it('it returns 404 NOT FOUND', (done) => {
    request
      .get('/facade/content/v2/methode/not-found')
      .query({api_key: 'wy745368rhtznnrprnqzp5dt'})
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);

        expect(res.body).to.deep.eq([{message: 'Entity not found'}]);

        done();
      });
  });

  describe('it returns 200 OK', () => {
    it('86f0a4cda1c57ca41ae232369b5b2b13', (done) => {
      request
        .get('/facade/content/v2/methode/86f0a4cda1c57ca41ae232369b5b2b13')
        .query({api_key: 'wy745368rhtznnrprnqzp5dt'})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          expect(res.body.id.value).to.eq('86f0a4cda1c57ca41ae232369b5b2b13');

          done();
        });
    });

    it('7939008bef306b53080c62b7bbfebe1f', (done) => {
      request
        .get('/facade/content/v2/methode/7939008bef306b53080c62b7bbfebe1f')
        .query({api_key: 'wy745368rhtznnrprnqzp5dt'})
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);

          expect(res.body.id.value).to.eq('7939008bef306b53080c62b7bbfebe1f');

          /** .related */

          expect(res.body.related.filter((item: any) => !!item).length).to.eq(19);

          /** .related[<video>] */

          expect(res.body.related.filter((item: any) => item.contentType === 'VIDEO').length).to.eq(1);

          /** .related[<image>] */

          expect(res.body.related.filter((item: any) => item.contentType === 'IMAGE').length).to.eq(12);

          /** .related[<iframe>] */

          expect(res.body.related.filter((item: any) => item.contentType === 'IFRAME').length).to.eq(2);

          /** .related[<news-story>] */

          expect(res.body.related.filter((item: any) => item.contentType === 'NEWS_STORY').length).to.eq(4);

          const article = res.body.related.find((item: any) => item.id.value === 'ef90c3f157070dce44ddc20c0b3245fa');

          expect(article.title).to.eq('Albanese vs Bowen: What you don’t know');
          expect(article.description).to.eq('Albanese vs Bowen: What you don’t know');
          expect(article.link).to.eq('https://www.dailytelegraph.com.au/news/national/federal-election/labor-leadership-contenders-all-you-need-to-know-about-anthony-albanese-and-chris-bowen/news-story/ef90c3f157070dce44ddc20c0b3245fa');
          expect(article.domainLinks.length).to.eq(13);

          const domainLink = article.domainLinks.find((item: any) => item.name === 'adelaidenow.com.au');

          expect(domainLink.link).to.eq('https://www.adelaidenow.com.au/news/national/federal-election/labor-leadership-contenders-all-you-need-to-know-about-anthony-albanese-and-chris-bowen/news-story/ef90c3f157070dce44ddc20c0b3245fa');

          done();
        });
    });
  });
});

describe('GET /facade/content/v2/collection/<id>', () => {
  it('it returns 200 OK', (done) => {
    request
      .get('/facade/content/v2/collection/5f145d128a3c4ad74fd1c2a58401781f')
      .query({api_key: 'wy745368rhtznnrprnqzp5dt'})
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        expect(res.body.content.id.value).to.eq('5f145d128a3c4ad74fd1c2a58401781f');
        expect(res.body.results[0].id.value).to.eq('86f0a4cda1c57ca41ae232369b5b2b13');

        done();
      });
  });
});
