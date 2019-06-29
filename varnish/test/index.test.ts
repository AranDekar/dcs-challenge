import { expect } from 'chai';
import * as supertest from 'supertest';
import * as superagent from 'superagent';

const url = 'http://varnish:80',
  request = supertest(url);

describe('GET /example.html', () => {
  it('support gzip', (done) => {
    request
      .get('/example.html')
      .set('Accept-Encoding', 'gzip')
      .expect(200, '<h1>Hello World</h1>')
      .expect('Content-Encoding', 'gzip')
      .end((err: any, res: any) => {
        if (err) return done(err);

        done();
      });
  });

  it('support no compression', (done) => {
    request
      .get('/example.html')
      .set('Accept-Encoding', '')
      .expect(200, '<h1>Hello World</h1>')
      .end((err: any, res: any) => {
        if (err) return done(err);

        expect(res.headers).to.not.have.property('Content-Encoding');

        done();
      });
  });
});

describe('GET /cat.jpg', () => {
  beforeEach((done) => {
    superagent('BAN', url)
      .set('X-Cache-Tags', '.')
      .end(done);
  });

  it('supports cache miss', (done) => {
    request
      .get('/cat.jpg')
      .expect(200)
      .expect('X-Cache', 'MISS')
      .expect('X-Cache-Hits', '0')
      .expect('X-Cache-Tags', '123 456 C:ABC')
      .end((err: any, res: any) => {
        if (err) return done(err);

        done();
      });
  });

  it('supports cache hit', (done) => {
    request
      .get('/cat.jpg')
      .expect(200)
      .expect('X-Cache', 'MISS')
      .expect('X-Cache-Hits', '0')
      .expect('X-Cache-Tags', '123 456 C:ABC')
      .end((err: any, res: any) => {
        if (err) return done(err);
        
        request
          .get('/cat.jpg')
          .expect(200)
          .expect('X-Cache', 'HIT')
          .expect('X-Cache-Hits', '1')
          .expect('X-Cache-Tags', '123 456 C:ABC')
          .end((err: any, res: any) => {
            if (err) return done(err);

            done();
          });
        });
  });

  it('supports cache ban with tag header', (done) => {
    request
      .get('/cat.jpg')
      .expect(200)
      .expect('X-Cache', 'MISS')
      .expect('X-Cache-Hits', '0')
      .expect('X-Cache-Tags', '123 456 C:ABC')
      .end((err: any, res: any) => {
        if (err) return done(err);

        superagent('BAN', url)
          .set('X-Cache-Tags', '123')
          .end(() => {
            request
              .get('/cat.jpg')
              .expect(200)
              .expect('X-Cache', 'MISS')
              .expect('X-Cache-Hits', '0')
              .expect('X-Cache-Tags', '123 456 C:ABC')
              .end((err: any, res: any) => {
                if (err) return done(err);

                done();
              });
          });
      }); 
  });

  it('supports cache ban with empty header', (done) => {
    request
      .get('/cat.jpg')
      .expect(200)
      .expect('X-Cache', 'MISS')
      .expect('X-Cache-Hits', '0')
      .expect('X-Cache-Tags', '123 456 C:ABC')
      .end((err: any, res: any) => {
        if (err) return done(err);

        superagent('BAN', url)
          .set('X-Cache-Tags', '')
          .end(() => {
            request
              .get('/cat.jpg')
              .expect(200)
              .expect('X-Cache', 'HIT')
              .expect('X-Cache-Hits', '1')
              .expect('X-Cache-Tags', '123 456 C:ABC')
              .end((err: any, res: any) => {
                if (err) return done(err);

                done();
              });
          });
      });
  });

  it('supports 404', (done) => {
    request
      .get('/dog.png')
      .expect(404)
      .end((err: any, res: any) => {
        if (err) return done(err);

        done();
      });
  });

  it('cache sorts query parameter header', (done) => {
    request
      .get('/cat.jpg?b=c&a=b')
      .expect(200)
      .expect('X-Cache', 'MISS')
      .end((err: any, res: any) => {
        if (err) return done(err);

        request
          .get('/cat.jpg?a=b&b=c')
          .expect(200)
          .expect('X-Cache', 'HIT')
          .end((err, res) => {
            if (err) return done(err);

            done();
          });
      });
  });

  it('cache ignores "Cookie" header', (done) => {
    request
      .get('/cat.jpg')
      .set('Cookie', 'n_regis=123456789; nkr=1')
      .expect(200)
      .expect('X-Cache', 'MISS')
      .end((err: any, res: any) => {
        if (err) return done(err);

        request
          .get('/cat.jpg')
          .expect(200)
          .expect('X-Cache', 'HIT')
          .end((err, res) => {
            if (err) return done(err);

            done();
          });
      });
  });

  it('ignores cache when X-No-Cache header present', (done) => {
    request
      .get('/cat.jpg')
      .set('X-No-Cache', '')
      .expect(200)
      .expect('X-Cache', 'MISS')
      .end((err: any, res: any) => {
        if (err) return done(err);

        request
          .get('/cat.jpg')
          .expect(200)
          .expect('X-Cache', 'MISS')
          .end((err, res) => {
            if (err) return done(err);

            done();
          });
      });
  });

  describe('cache ignores "nk" query parameter', () => {
    const examples = [
      ['/cat.jpg?nk=123', '/cat.jpg'],
      ['/cat.jpg?a=b&nk=123', '/cat.jpg?a=b'],
      ['/cat.jpg?nk=123&a=b', '/cat.jpg?a=b'],
      ['/cat.jpg?a=b&nk=123&c=d', '/cat.jpg?a=b&c=d'],
    ];

    for (const example of examples) {
      it(example[0], (done) => {
        request
          .get(example[0])
          .expect(200)
          .expect('X-Cache', 'MISS')
          .end((err: any, res: any) => {
            if (err) return done(err);

            request
              .get(example[1])
              .expect(200)
              .expect('X-Cache', 'HIT')
              .end((err, res) => {
                if (err) return done(err);

                done();
              });
          });
      });
    }

    it('REGRESSION /cat.jpg?monk=trouble', (done) => {
      request
        .get('/cat.jpg?monk=trouble')
        .expect(200)
        .expect('X-Cache', 'MISS')
        .end((err: any, res: any) => {
          if (err) return done(err);

          request
            .get('/cat.jpg?mo')
            .expect(200)
            .expect('X-Cache', 'MISS')
            .end((err, res) => {
              if (err) return done(err);

              done();
            });
        });
    });

    it('REGRESSION /cat.jpg?monkey=trouble', (done) => {
      request
        .get('/cat.jpg?monkey=trouble')
        .expect(200)
        .expect('X-Cache', 'MISS')
        .end((err: any, res: any) => {
          if (err) return done(err);

          request
            .get('/cat.jpg?mo')
            .expect(200)
            .expect('X-Cache', 'MISS')
            .end((err, res) => {
              if (err) return done(err);

              done();
            });
        });
    });
  });

  it('cache ignores trailing "?"', (done) => {
    request
      .get('/cat.jpg?')
      .expect(200)
      .expect('X-Cache', 'MISS')
      .end((err: any, res: any) => {
        if (err) return done(err);

        request
          .get('/cat.jpg')
          .expect(200)
          .expect('X-Cache', 'HIT')
          .end((err, res) => {
            if (err) return done(err);

            done();
          });
      });
  });

  it('cache includes "X-TCOG-" headers', (done) => {
    request
      .get('/cat.jpg')
      .set('X-TCOG-TEMPLATE', 's3/ncatemp/router@2.0.0')
      .expect(200)
      .expect('X-Cache', 'MISS')
      .end((err: any, res: any) => {
        if (err) return done(err);

        request
          .get('/cat.jpg')
          .set('X-TCOG-TEMPLATE', 's3/ncatemp/router@2.0.0')
          .expect(200)
          .expect('X-Cache', 'HIT')
          .end((err, res) => {
            if (err) return done(err);
            
            request
              .get('/cat.jpg')
              .expect(200)
              .expect('X-Cache', 'MISS')
              .end((err, res) => {
                if (err) return done(err);

                done();
              });
          });
      });
    });
});
