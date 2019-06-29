import * as mocha from 'mocha';
import { should, expect } from 'chai';
import * as supertest from 'supertest';
import { root } from '../lib/v2/root';
import { initialize } from '../../../src/index';

const request = supertest(initialize(root));

describe('POST /graphql/v2', () => {
  it('search', (done) => {
    request
      .post('/graphql/v2')
      .set('Accept', 'application/json')
      .type('form')
      .send({ query: `query  {
        getV2Search(query: "contentType:NEWS_STORY",pageSize: 3, apiKey: "7ukztsc3p3hgaxnduw7m8zc7") {
          resultSize
          totalHits
          results{
            ... on V2NewsStory {
              id {
                value
                link
              }
            }
          }
        }
      }`})
      .expect(200, {
        data: {
          getV2Search: {
            resultSize: 3,
            results: [
              {
                id: {
                  link: 'https://cdn.newsapi.com.au/sit/content/v2/baac72074659989f8860dac05ac432b7',
                  value: 'baac72074659989f8860dac05ac432b7'
                }
              },
              {
                id: {
                  link: 'https://cdn.newsapi.com.au/sit/content/v2/d04e5fb88e99e5b1cb9cae341ddcc5a6',
                  value: 'd04e5fb88e99e5b1cb9cae341ddcc5a6'
                }
              },
              {
                id: {
                  link: 'https://cdn.newsapi.com.au/sit/content/v2/621c068e25a49ea0498c35a127ef764d',
                  value: '621c068e25a49ea0498c35a127ef764d'
                }
              }
            ],
            totalHits: 2018265
          }
        }
      }).end(done);
  });

  it('collection', (done) => {
    request
      .post('/graphql/v2')
      .set('Accept', 'application/json')
      .type('form')
      .send({ query: `query{
        getV2Collection(id: "123", apiKey: "456") {
          content {
            id { value }
          }
          offset
          pageSize
          totalHits
        }
      }` })
      .expect(200, {
        data: {
          getV2Collection: {
            content: {
              id: {
                value: '4d2cca2ccdb9187205750fb1ca5025c7'
              }
            },
            offset: 0,
            pageSize: 20,
            totalHits: 0
          }
        }
      }).end(done);
  });
});
