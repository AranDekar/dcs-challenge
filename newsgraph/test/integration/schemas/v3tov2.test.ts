import * as mocha from 'mocha';
import { should, expect } from 'chai';
import * as supertest from 'supertest';
import { root as defaultRoot } from '../lib/v3/root';
import { initialize } from '../../../src/index';
import * as video from '../../fixtures/v3/video.json';
import * as article from '../../fixtures/v3/article.json';

function request (root = defaultRoot) {
  return supertest(initialize(root));
}

describe('POST /graphql/v3tov2', () => {
  it('video', (done) => {
    const root: V3Root = {
      get: async () => {
        throw 'no implemented';
      },
      getResources: async (ids: string[]) => {
        switch (ids) {
          case ['e8a0b180f614a76cf5935e8e02b86a32101', 'e8a0b180f614a76cf5935e8e02b86a32101']: return article;
          default: throw `missing fixture for ${ids}`;
        }
      },
      getResource: async (id: string) => {
        switch (id) {
          case '98485290c72e31ce538c6b5de08912b6': return video;
          default: throw `missing fixture for ${id}`;
        }
      },
      getResourceRevision: async (id: string, apiKey: string,  documentRevisionMajor: string, documentRevisionMinor: string) => {
        throw 'no implemented';
      },
      getCollection: async () => {
        throw 'no implemented';
      },
      articleBasicSearch: async () => {
        throw 'no implemented';
      },
      getSearch: async (args: object) => {
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
      }
    };

    request(root)
      .post('/graphql/v3tov2')
      .set('Accept', 'application/json')
      .type('form')
      .send({ query: `query {
        getV2(id: "98485290c72e31ce538c6b5de08912b6", apiKey: "234") {
          ... on V2Video {
            contentType
            id { value }
            dateCreated
            dateLive
            dateUpdated
            description
          }
        }
      }`}).expect(200, {
        data: {
          getV2: {
            contentType: 'VIDEO',
            id: {
              value: '98485290c72e31ce538c6b5de08912b6'
            },
            dateCreated: '2018-02-22T18:10:12.000Z',
            dateLive: '2018-02-22T18:10:12.000Z',
            dateUpdated: '2018-02-23T03:52:10.000Z',
            description: 'this is the UPDATED long description.'
          }
        }
      }).end(done);
  });

  it('collection', (done) => {
    request()
      .post('/graphql/v3tov2')
      .set('Accept', 'application/json')
      .type('form')
      .send({ query: `query{
        getV2Collection(id: "123", apiKey: "456") {
          content {
            contentType
            id { value }
          }
          results {
            ... on V2NewsStory {
              contentType
              id { value }
            }
          }
        }
      }`})
      .expect(200, {
        data: {
          getV2Collection: {
            content: {
              contentType: 'COLLECTION',
              id: { value: '5f145d128a3c4ad74fd1c2a58401781f' }
            }, results: Array(31).fill({ contentType: 'NEWS_STORY', id: { value: 'e8a0b180f614a76cf5935e8e02b86a32101' } })
          }
        }
      }).end(done);
  });

  it('news story', (done) => {
    request()
      .post('/graphql/v3tov2')
      .set('Accept', 'application/json')
      .type('form')
      .send({ query: `query {
        getV2(id: "e8a0b180f614a76cf5935e8e02b86a32101", apiKey: "234") {
          ... on V2NewsStory {
            contentType
            id { value }
            title
            body
            authors
            byline
            paidStatus
            version
            domains
          }
        }
      }`})
      .expect(200, {
        data: {
          getV2: {
            contentType: 'NEWS_STORY',
            id: { value: 'e8a0b180f614a76cf5935e8e02b86a32101' },
            title: 'BOY George has signed on for the 2017 season',
            body: '<h1>h1 tag</h1><h2>h2 tag</h2><p>paragraph 1 paragraph 2</p>',
            authors: ['Colin Vickery', 'John Doe'],
            byline: 'By Colin Vickery, John Doe and Staff',
            paidStatus: 'NON_PREMIUM',
            version: 'PUBLISHED',
            domains: [ 'perthnow.com.au', 'heraldsun.com.au' ]
          }
        }
      })
      .end(done);
  });
});
