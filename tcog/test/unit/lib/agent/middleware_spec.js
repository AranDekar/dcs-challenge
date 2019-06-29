// var app,
//     config = require('../../../../conf'),
//     agentMiddleware = require('./../../../../lib/agent/middleware'),
//     agent = require('./../../../../lib/json-agent'),
//     fs = require('fs'),
//     express = require('express'),
//     request = require('supertest'),
//     oldRequest = agent._requestFromApi;

// var finisher = function (req, res) {
//     res.set('Content-Type', 'application/json');
//     res.status(200).send({ locals: { data: res.locals.data } });
// };

// describe('agent/middleware', function () {
//     var previousHttpProxy,
//         mocked = {
//             res: {
//                 headers: { 'content-type': 'application/json' }
//             }
//         };

//     beforeEach(function () {
//         app = express(),
//         previousHttpProxy = process.env.HTTP_PROXY;
//         process.env.HTTP_PROXY = '';
//     });

//     afterEach(function () {
//         process.env.HTTP_PROXY = previousHttpProxy;
//     });

//     describe('fetching from a destination with only a server URL', function () {
//         beforeEach(function () {
//             agent._requestFromApi = function (reqOptions, options, cb) {
//                 agent._handleResponse(reqOptions.url, options, cb)(
//                     null,
//                     mocked.res,
//                     fs.readFileSync(
//                         __dirname + '/../../../fixtures/api-search-text-sport.json'
//                     ).toString()
//                 );
//             };
//             app.get('/test-url', agentMiddleware('http://somewhereovertherainbow/api', {}), finisher);
//         });

//         afterEach(function () {
//             agent._requestFromApi = oldRequest;
//         });

//         it('generates a middleware closure with a valid agent', function (done) {
//             request(app)
//                 .get('/test-url')
//                 .expect(200)
//                 .end(function (err, res) {
//                     if (err) throw err;
//                     var payload = JSON.parse(res.text);
//                     expect(payload.locals.data.resultSize).to.equal(20);
//                     done();
//                 });
//         });
//     });

//     describe('fetching with a server URL and URL parameters', function () {
//         beforeEach(function () {
//             agent._requestFromApi = function (reqOptions, options, cb) {
//                 agent._handleResponse(reqOptions.url, options, cb)(
//                     null,
//                     mocked.res,
//                     fs.readFileSync(
//                         __dirname + '/../../../fixtures/api-search-text-sport.json'
//                     ).toString()
//                 );
//             };
//         });

//         afterEach(function () {
//             agent._requestFromApi = oldRequest;
//         });

//         it('should call the request function with the parameters passed in to reqData', function (done) {
//             var agentMiddleware = require('./../../../../lib/agent/middleware_implementation')(
//                 function () {},
//                 {},
//                 require('lodash')
//             );
//             var originalRequest = agentMiddleware.request;
//             agentMiddleware.request = function (url, options, req, res, callback) {
//                 callback();
//             };
//             sinon.spy(agentMiddleware, 'request');

//             var reqData = {
//                 'headers': {
//                     'User-Agent': 'tcog v1 (tcog@news.com.au) (Like facebookexternalhit)'
//                 }
//             };

//             agentMiddleware('http://somewhereovertherainbow/api', reqData)(
//                 {},
//                 { 'locals': '' },
//                 function (req, res, next) {
//                     expect(agentMiddleware.request.calledOnce).to.equal(true);
//                     expect(agentMiddleware.request.getCall(0).args[1].headers['User-Agent']).to.equal('tcog v1 (tcog@news.com.au) (Like facebookexternalhit)');
//                     done();
//                 }
//             );

//             agentMiddleware.request.restore();
//             agentMiddleware.request = originalRequest;
//         });

//         it('conveys tcog request queries onto the destination URL', function (done) {
//             app.get('/test-query',
//                 agentMiddleware('http://somewhereovertherainbow/api', {
//                     query: {
//                         includeRelated: true,
//                         format: 'json'
//                     }
//                 }), finisher);

//             request(app)
//                 .get('/test-query?foo=hello')
//                 .end(function (err, res) {
//                     if (err) throw err;
//                     var payload = JSON.parse(res.text);
//                     expect(payload.locals.data.resultSize).to.equal(20);
//                     done();
//                 });
//         });
//     });

//     var status = [400, 500];

//     status.forEach(function (code) {
//         describe('handling a ' + code + ' from the Content API', function () {
//             beforeEach(function () {
//                 agent._requestFromApi = function (reqOptions, options, cb) {
//                     agent._handleResponse(reqOptions.url, options, cb)(
//                         null, mocked.res, JSON.stringify({ code: code, message: 'Content does not exist.' })
//                     );
//                 };
//             });

//             afterEach(function () {
//                 agent._requestFromApi = oldRequest;
//             });

//             it('conveys tcog request queries onto the destination URL', function (done) {
//                 app.get('/test-query',
//                     agentMiddleware('http://' + code + 'error.com/api', {
//                         query: {
//                             includeRelated: true,
//                             format: 'json'
//                         }
//                     }), finisher);

//                 request(app)
//                     .get('/test-query?foo=hello')
//                     .expect(code)
//                     .end(function (err, res) {
//                         if (err) throw err;
//                         var payload = JSON.parse(res.text);
//                         expect(payload.code).to.equal(code);
//                         expect(payload.message).to.equal('Content does not exist.');
//                         done();
//                     });
//             });
//         });
//     });

//     describe('reqData parameter', function () {
//         beforeEach(function () {
//             agent._requestFromApi = function (reqOptions, options, cb) {
//                 agent._handleResponse(reqOptions.url, options, cb)(null, mocked.res, fs.readFileSync(__dirname + '/../../../fixtures/api-search-text-sport.json').toString());
//             };

//             app.get('/test-url',
//                 agentMiddleware('http://somewhereovertherainbow/api', {
//                     query: {
//                         foo: 'bar',
//                         includeRelated: true,
//                         format: 'json'
//                     }
//                 }),
//                 finisher);
//         });

//         afterEach(function () {
//             agent._requestFromApi = oldRequest;
//         });

//         it('merges reqData with req', function (done) {
//             request(app)
//                 .get('/test-url')
//                 .expect(200)
//                 .end(function (err, res) {
//                     if (err) throw err;
//                     done();
//                 });
//         });
//     });

//     describe('interpolation of request level and static parameters', function () {
//         beforeEach(function () {
//             agent._requestFromApi = function (reqOptions, options, cb) {
//                 agent._handleResponse(reqOptions.url, options, cb)(null, mocked.res, fs.readFileSync(__dirname + '/../../../fixtures/api-search-text-sport.json').toString());
//             };
//         });

//         afterEach(function () {
//             agent._requestFromApi = oldRequest;
//         });

//         it('should interpolate parameters correctly', function (done) {
//             app.get('/interpolate-test-1',
//                 agentMiddleware('http://somewhereovertherainbow/api',
//                     { query: {
//                         foo: '{{query.bar}}',
//                         baz: 'foo',
//                         includeRelated: true,
//                         format: 'json'
//                     } }),
//                 finisher);

//             request(app)
//                 .get('/interpolate-test-1?bar=bar')
//                 .expect(200)
//                 .end(function (err, res) {
//                     if (err) throw err;
//                     done();
//                 });
//         });

//         it('should not merge with the request if a falsy parameter provided', function (done) {
//             app.get('/interpolate-test-2',
//                 agentMiddleware('http://somewhereovertherainbow/api',
//                     { query: { foo: '{{query.bar}}', baz: 'foo' } }, false),
//                 finisher);

//             request(app)
//                 .get('/interpolate-test-2?bar=bar')
//                 .expect(200)
//                 .end(function (err, res) {
//                     if (err) throw err;
//                     done();
//                 });
//         });

//         it('should merge the hostname if required', function (done) {
//             var middleware = agentMiddleware('http://{{query.foo}}/', {}, false);
//             var originalRequest = agentMiddleware.request;

//             agentMiddleware.request = function (url, options, req, res, callback) {
//                 expect(url).to.equal('http://foo.com/');
//                 done();
//                 agentMiddleware.request = originalRequest;
//             };

//             middleware({
//                 query: {
//                     foo: 'foo.com'
//                 }
//             }, {
//                 locals: {}
//             }, null);
//         });

//         it('should merge a new hostname', function (done) {
//             var calls = 0,

//                 stubb = {
//                     req: {
//                         query: {
//                             foo: 'foo.com',
//                             bar: 'bar.com'
//                         },
//                         params: {}
//                     },
//                     res: {
//                         locals: {}
//                     }
//                 };

//             var mware = agentMiddleware('http://{{query.foo}}/', { }, false),
//                 originalRequest = agentMiddleware.request;

//             agentMiddleware.request = function (url, options, req, res, callback) {
//                 if (calls === 0) {
//                     calls += 1;
//                     expect(url).to.equal('http://foo.com/');
//                 } else {
//                     expect(url).to.equal('http://bar.com/');
//                     agentMiddleware.request = originalRequest;
//                     done();
//                 }
//             };

//             mware(stubb.req, stubb.res);

//             stubb.req.query.foo = 'bar.com';

//             mware(stubb.req, stubb.res);
//         });
//     });

//     describe('parallel utility function', function () {
//         it('should return a middleware function', function () {
//             var middleware = agentMiddleware.parallel();

//             expect(middleware).to.be.a('function');
//             expect(middleware.length).to.equal(3);
//         });

//         it('should immediately call back if queue empty', function () {
//             var emptyQueue = Array(8),
//                 parallel = agentMiddleware.parallel.apply(null, emptyQueue),
//                 called = false;

//             parallel(null, null, function (err) {
//                 called = true;
//             });

//             expect(called).to.equal(true);
//         });

//         it('should run middleware in parallel', function (done) {
//             var req = Math.random(), res = Math.random(),
//                 called = 0,
//                 middlewareCount = 10,
//                 middlewareLatencyMultiplier = 10;

//             var middleware = [], idx = 0;

//             /* jshint ignore:start */
//             while (idx++, middleware.length < middlewareCount) {
//                 (function (idx) {
//                     middleware.push(function (innerReq, innerRes, next) {
//                         expect(innerReq).to.equal(req);
//                         expect(innerRes).to.equal(res);
//                         called++;

//                         setTimeout(next, idx * middlewareLatencyMultiplier);
//                     });
//                 })(idx);
//             }
//             /* jshint ignore:end */

//             var parallel = agentMiddleware.parallel.apply(null, middleware),
//                 commenced = Date.now();

//             parallel(req, res, function (err) {
//                 var timeTaken = Date.now() - commenced;

//                 expect(err).to.be.not.ok;
//                 expect(called).to.equal(middlewareCount);

//                 // Expect at least 100ms latency
//                 expect(timeTaken).to.gte(middlewareCount * middlewareLatencyMultiplier);

//                 done();
//             });
//         });

//         it('should handle errors appropriately', function (done) {
//             var queue = [function (req, res, next) {
//                     return next(new Error('foo'));
//                 }],
//                 parallel = agentMiddleware.parallel.apply(null, queue);

//             parallel(null, null, function (err) {
//                 expect(err).to.be.ok;
//                 expect(err.message).to.equal('foo');
//                 done();
//             });
//         });
//     });

//     describe('collection utility function', function () {
//         it('should return a middleware function', function () {
//             var middleware = agentMiddleware.collection();

//             expect(middleware).to.be.a('function');
//             expect(middleware.length).to.equal(3);
//         });

//         it('should immediately call back if agent collection empty', function () {
//             var collection = agentMiddleware.collection(),
//                 called = false;

//             collection({}, {}, function (err) {
//                 called = true;
//             });

//             expect(called).to.equal(true);
//         });

//         it('should create a collection of agents', function (done) {
//             var domains = 'one.com.au,two.com.au',

//                 spies = {
//                     options: sinon.stub(),
//                     parallel: sinon.spy(agentMiddleware, 'parallel'),
//                     request: sinon.stub(agentMiddleware, 'request', function () {
//                         arguments[arguments.length - 1]();
//                     })
//                 },

//                 mock = {
//                     req: { params: {} },
//                     res: {
//                         locals: {
//                             query: { 'domain': domains },
//                             config: { 'domain': domains }
//                         }
//                     }
//                 },

//                 options,
//                 collection;

//             // setup stubs

//             spies.options.returns(domains.split(',').map(function (domain) {
//                 return {
//                     query: {
//                         domain: domain
//                     },
//                     scope: domain
//                 };
//             }));

//             options = {
//                 scope: 'popular-',
//                 query: { origin: 'OMNITURE' },
//                 collection: { key: 't_domain', options: spies.options }
//             };

//             collection = agentMiddleware.collection('path', options, false);

//             collection(mock.req, mock.res, function (err) {
//                 if (err) done(err);

//                 collection(mock.req, mock.res, function (err) {
//                     if (err) done(err);

//                     // ensure we only create one parallel
//                     // middleware

//                     expect(spies.options.callCount).to.equal(1);

//                     expect(spies.options.lastCall.args.length).to.equal(2);
//                     expect(spies.options.lastCall.args[1]).to.equal(mock.res.locals);

//                     expect(spies.parallel.callCount).to.equal(1);

//                     expect(spies.request.callCount).to.equal(4);

//                     spies.parallel.restore();
//                     spies.request.restore();

//                     done();
//                 });
//             });
//         });
//     });

//     describe('X-API-URL Header', function () {
//         var mock,

//             spies = {
//                 set: sinon.spy(),
//                 get: sinon.spy()
//             },

//             headers = {
//                 set: function (name, value) {
//                     spies.set(name, value);
//                     this.headers[name] = value;
//                 },
//                 get: function (name) {
//                     spies.get(name);
//                     return this.headers[name];
//                 }
//             };

//         beforeEach(function () {
//             agent._requestFromApi = function (reqOptions, options, cb) {
//                 agent._handleResponse(reqOptions.url, options, cb)(null, mocked.res, fs.readFileSync(__dirname + '/../../../fixtures/api-search-text-sport.json').toString());
//             };

//             spies.set.reset();
//             spies.get.reset();

//             mock = {
//                 req: {},
//                 res: {
//                     ended: false,
//                     locals: {},
//                     setHeader: headers.set,
//                     getHeader: headers.get,
//                     headers: {}
//                 }
//             };
//         });

//         afterEach(function () {
//             agent._requestFromApi = oldRequest;
//         });

//         it('set for single url', function () {
//             var called = false;

//             agentMiddleware('http://api.some.com/path', { raw: true })(mock.req, mock.res, function (err) {
//                 var headers = mock.res.headers['X-API-URL'].split(',');

//                 expect(spies.get.called).to.equal(true);
//                 expect(spies.set.called).to.equal(true);
//                 expect(headers.length).to.equal(1);
//                 expect(headers[0]).to.equal('http://api.some.com/path/');
//                 called = true;
//             });

//             expect(called).to.be.ok;
//         });

//         it('set for multiple urls', function () {
//             var called = false;

//             agentMiddleware('http://api.some.com/path', { raw: true })(mock.req, mock.res, function () {
//                 agentMiddleware('http://api.some.com/path/2', { raw: true })(mock.req, mock.res, function () {
//                     var headers = mock.res.headers['X-API-URL'].split(',');

//                     expect(spies.get.callCount).to.equal(3);
//                     expect(spies.set.callCount).to.equal(2);
//                     expect(headers.length).to.equal(2);

//                     expect(headers[0])
//                         .to.equal('http://api.some.com/path/');
//                     expect(headers[1])
//                         .to.equal('http://api.some.com/path/2/');

//                     called = true;
//                 });
//             });

//             expect(called).to.be.ok;
//         });

//         it('not set if request has finished', function () {
//             var called = false;

//             agentMiddleware('http://api.some.com/path', { raw: true })(mock.req, mock.res, function () {
//                 mock.res.finished = true;

//                 agentMiddleware('http://api.some.com/path/2', { raw: true })(mock.req, mock.res, function () {
//                     var headers = mock.res.headers['X-API-URL'].split(',');

//                     expect(spies.get.callCount).to.equal(1);
//                     expect(spies.set.callCount).to.equal(1);
//                     expect(headers.length).to.equal(1);

//                     expect(headers[0])
//                         .to.equal('http://api.some.com/path/');

//                     called = true;
//                 });
//             });

//             expect(called).to.be.ok;
//         });
//     });

//     describe('res.locals.upstreamRequests', function () {
//         var mock,

//             spies = {
//                 set: sinon.spy(),
//                 get: sinon.spy()
//             },

//             headers = {
//                 set: function (name, value) {
//                     spies.set(name, value);
//                     this.headers[name] = value;
//                 },
//                 get: function (name) {
//                     spies.get(name);
//                     return this.headers[name];
//                 }
//             };

//         beforeEach(function () {
//             agent._requestFromApi = function (reqOptions, options, cb) {
//                 agent._handleResponse(reqOptions.url, options, cb)(null, mocked.res, fs.readFileSync(__dirname + '/../../../fixtures/api-search-text-sport.json').toString());
//             };

//             spies.set.reset();
//             spies.get.reset();

//             mock = {
//                 req: {},
//                 res: {
//                     ended: false,
//                     locals: {},
//                     setHeader: headers.set,
//                     getHeader: headers.get,
//                     headers: {}
//                 }
//             };
//         });

//         afterEach(function () {
//             agent._requestFromApi = oldRequest;
//         });

//         it('set to an array of length 1 for a single URL', function () {
//             var called = false;

//             agentMiddleware('http://api.some2.com/path', { raw: true })(mock.req, mock.res, function (err) {
//                 expect(spies.get.called).to.equal(true);
//                 expect(spies.set.called).to.equal(true);
//                 expect(mock.res.locals.upstreamRequests).to.be.an('array');
//                 expect(mock.res.locals.upstreamRequests.length).to.equal(1);
//                 expect(mock.res.locals.upstreamRequests[0])
//                     .to.equal('http://api.some2.com/path/');

//                 called = true;
//             });

//             expect(called).to.be.ok;
//         });

//         it('subsequent URLs are added to the array', function () {
//             var called = false;

//             agentMiddleware('http://api.some2.com/path/2', { raw: true })(mock.req, mock.res, function () {
//                 agentMiddleware('http://api.some2.com/path/3', { raw: true })(mock.req, mock.res, function () {
//                     var headers = mock.res.headers['X-API-URL'].split(',');

//                     expect(spies.get.callCount).to.equal(3);
//                     expect(spies.set.callCount).to.equal(2);

//                     expect(mock.res.locals.upstreamRequests).to.be.an('array');
//                     expect(mock.res.locals.upstreamRequests.length).to.equal(2);
//                     expect(mock.res.locals.upstreamRequests[0])
//                         .to.equal('http://api.some2.com/path/2/');
//                     expect(mock.res.locals.upstreamRequests[1])
//                         .to.equal('http://api.some2.com/path/3/');

//                     called = true;
//                 });
//             });

//             expect(called).to.be.ok;
//         });
//     });

//     describe('request', function () {
//         it('should append the TCOG user agent header if no options are provided', function () {
//             sinon.stub(agentMiddleware, 'agent');

//             agentMiddleware.request('http://www.disney.com');

//             expect(agentMiddleware.agent.calledOnce).to.equal(true);
//             expect(agentMiddleware.agent.getCall(0).args[0]).to.equal('http://www.disney.com');
//             expect(agentMiddleware.agent.getCall(0).args[1]).to.deep.equal({
//                 headers: {
//                     'User-Agent': 'tcog v1 (tcog@news.com.au)'
//                 }
//             });
//             agentMiddleware.agent.restore();
//         });

//         it('should append the TCOG user-agent header to existing options if no user-agent header is provided', function () {
//             sinon.stub(agentMiddleware, 'agent');

//             agentMiddleware.request('http://www.disney.com', { foo: 'bar' });

//             expect(agentMiddleware.agent.calledOnce).to.equal(true);
//             expect(agentMiddleware.agent.getCall(0).args[0]).to.equal('http://www.disney.com');
//             expect(agentMiddleware.agent.getCall(0).args[1]).to.deep.equal({
//                 foo: 'bar',
//                 headers: {
//                     'User-Agent': 'tcog v1 (tcog@news.com.au)'
//                 }
//             });
//             agentMiddleware.agent.restore();
//         });

//         it('should not override the user-agent header if one is provided', function () {
//             sinon.stub(agentMiddleware, 'agent');

//             agentMiddleware.request('http://www.disney.com', { headers: { 'User-Agent': 'foo' } });

//             expect(agentMiddleware.agent.calledOnce).to.equal(true);
//             expect(agentMiddleware.agent.getCall(0).args[0]).to.equal('http://www.disney.com');
//             expect(agentMiddleware.agent.getCall(0).args[1]).to.deep.equal({
//                 headers: {
//                     'User-Agent': 'foo'
//                 }
//             });
//             agentMiddleware.agent.restore();
//         });
//     });
// });
