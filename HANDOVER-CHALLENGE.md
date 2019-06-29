# The Dynamic Content Services Platform

DCS is a refactored services architecture of a monolith called TCOG, which now runs as a large service in the stack.

TCOG is still the primary service, with all other services built around it considered to be supportive services. 

This introduction is deliberately brief. It shares several challenges that will let us identify the ability for a 3rd party Node team to take over the project in maintenance mode. 

## TCOG

TCOG is named after the part of a transformer that lets it turn from a car into a giant Robot.

It was written in late 2013 as an Express + Redis app that follows a `Backend for the Frontend` pattern - for example see https://nordicapis.com/building-a-backend-for-frontend-shim-for-your-microservices/.

It was heavily refactored in early 2017 onward to fall into a docker based SOA approach, hosted on Elastic Container Service on AWS.

Specifically, TCOG stands between teams of front end developers writing templates and backend content APIs, most importantly the News Content API. It simplifies how front enders can access background APIs and deploy templates that can be rendered at high scale and cached by the platform.

TCOG's most important endpoint renders the article page for around 20 papers, including news.com.au, theaustralian.com.au, thedailytelegraph.com.au, heraldsun.com.au, etc..

The article page should not need further refactoring and will not be part of the challenges below.

In addition, a number of endpoints also expose other APIs for use. Examples of other APIs are integrations with:

* Vidora, for personalised content recommendations for our users.
* FoxsportsPulse, to access various pieces of sport data.
* Wordpress Plus, to load templates or pieces of JSON to use within TCOG templates.

TCOG's templates are, generally, written in Jade (now called Pug) and compiled into Javascript that is serialsed as JSON and stored on s3. In more recent years, some front end teams were using other approaches which would be compiled and transported as the same artifact. Some of these compiled and serialised templates can reach large sizes. TCOG will pull these down in flight and maintain an internal cache of them.

TCOG URLs take a number of important URI parameters, prefixed with `t_`, `td_` (a display parameter, passed into templates) and `tc_` (a configuration paramter).

The two most important `t_` parameters are:

* `t_product` - which identifies the name of a product (e.g. t_product=HeraldSun). TCOG has a JSON file internally that maps API keys to products, so TCOG links can be used to hide API keys from being exposed in HTML source, otherwise opening the API key up to external abuse.
* `t_template` - which identifies the template loaded from s3 or internally, (e.g. t_template=t_template=s3/chronicle-templaterouterbeta/index). A small amount of legacy templates remain internally in TCOG.

There are two further important aspects to point out about TCOG, before sharing the challenges.

### Caching
TCOG is used heavily and is surrounded by caching layers. The original monolith had an in memory cache layer (running with around 40 to 60 nodes in one cluster, each with their RAM based copy of rendered content) and a distributed layer with Redis as a centralised database. Additionally, Akamai functioned above all of this to enable high scalability.

The refactored DCS version has abstracted the in memory layer to use Varnish instead. The Redis based layer has been rewritten into Tabula. Akamai logic remains the same and is mostly managed by our ops team.

### Eventing - Cache Invalidation
An important concept in Newscorp is "Legal Kill". It is really another way of saying "cache invalidation". DCS subscribes to an SQS queue that is maintained by the Content API team. When a legal kill occurs an event is sent through that is picked up the CAPI Events Adapter service in DCS. This is then sent to Tabula and to Varnish to invalidate the cache.

### Proxying

Additionally, a fair bit of reverse proxy work occurs at our WAF layer.


### Challenge One - Upgrade Node for the TCOG Service

Using the existing Node version 8.12.0 in tcog/.nvmrc, run the unit tests and ensure they all pass. 

`yarn test:unit`

Upgrade the Node version to v10.6.0. 

Expect to see node-gyp breakages, etc.. You will need to identify how to work through this until only one unit test breaks after the upgraded version. Once this is done, you should be able to figure out how to make all the unit tests pass.

Please describe each command line step it takes to achieve this (in your terminal). You do not need to share how you came up with the answer, although we may ask you to talk us through this in a subsequent interview.

### Challenge Two - Fixing a docker-compose file

At the top level of pp-services is a docker-compose.yml file. This orchestrates all of the DCS dockerised services in much the same way as they run on ECS, though at a smaller level.

Please build the set of services:

`NODE_ENV=integration docker-compose build`.

Then please run it.

`NODE_ENV=integration docker-compose run`

Please explain how you fixed it.

### Challenge Three - writing a TCOG endpoint

This challenge involves writing a TCOG endpoint. These things generally call upstream APIs with an API key embedded in a conf file that maps to a `t_product`, then either return the JSON or render them with a template that is defined by the `t_template` parameter.

I've adapted a coding challenge we used to use for this that is based on the Fibonacci sequence. It also tested recursion. If there is an alternate JSON API you would prefer to work with instead, that should be in fine. Please email us (nicholas.faiz@news.com.au) and clarify the alternative. We are really just testing basic Express endpoint writing and a few idiosyncracies in TCOG.

TCOG needs a new "transformer" (which is just another way of saying Express endpoint). It should be written in the current style of endpoints that are in the top level folder of pp-services/tcog/transformers. The 1.0 folder is for legacy transformers written in an older style.

It should use the standard callback pattern to be consistent with the surrounding code.

As a working example, look at the Vidora v3 Recommendations endpoint in pp-services/tcog/transformers/vidora/v3/recommendations.js

This is an endpoint that takes a :user_id (also called an nk, news-key) and sends it to the Vidora API, which responds with an array of 10 article IDs that are recommended content for the user. It then requests these 10 articles from the Content API. These are then returned either as a JSON collection or a rendered article.

For example - http://a.tcog.news.com.au/p13n/v3/users/6247768/recommendations?t_product=DailyTelegraph&t_output=json

(One weird thing about TCOG is that to specify a JSON response the `t_output=json` parameter is required).

Importantly, note the middleware chain at the end of the file:

```
    return [middleware.product, vidoraProduct, extractQuery, vidoraIntegration, capiIntegration, middleware.templateHandler('default')];
```

Your endpoint should use the `product` and `templateHandler('default')` middlewares. The `product` middleware ensures only trusted users can call the TCOG endpoint. The `templateHandler` knows how to load templates.


The Fibonacci Challenge.

The endpoint should take a position of the Fibonacci sequence and return the correct number in the sequences position. 

For example, you might test that given these inputs, you get these outputs:

INPUT | OUTPUT
0     |  0
3     |  1
5     |  3
7     |  8
9     | 21

The output should be expressed in a JSON package. For example:

{
    "position": 3,
    "number": 1
}


Once you have completed this endpoint, could you please send it the codebase back explaining how to use it? We will test it at the docker-compose level.

## Existing Documentation

There is a logical architecture diagram that may be helpful in pp-services/docs/api-docs/build/images/dcs.png.

There are other further document sources in pp-services/docs. Both pp-services/docs/internal-docs and pp-services/docs/api-docs docs have static HTML files to follow in their builds folders.

Legacy TCOG documentation is also in pp-services/tcog/docs.

## Supporting Services

### Newsgraph

A new GraphQL service. Newsgraph, was written to, in some ways, replace it as a JSON endpoint, backed by caching. This feature set has never completely evolved. We are still discussing how far to take it.

### Varnish

A front end caching layer using the open source Varnish framework - see https://varnish-cache.org/.

### Varnish Events Adapter

A lightweight HTTP service that reads from a Redis channel and obtains content IDs. It calls into Varnish with HTTP and invalidates this data.

### Tabula

A service that uses Redis as a backend centralised cache. It has been written to work with CAPI objects and sets various TTLs for them. Like the Varnish Events Adapter, it also invalidates data.

### Deck Events Adapter

A service that invalidates Deck data (a small and temporary CMS) in Tabula and Varnish. It accepts a HTTP call with a Deck ID and sends the ID into the Redis channel.

### CAPI Events Adapter

A service that reads cache events from an SQS Queue. The Content API team publish events into this channel.

### Devops

A folder of bash and Cloud Formation scripts that defines how we deploy to AWS.
