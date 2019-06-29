# Tabula

A caching proxy before upstream APIs. Tabula handles JSON content, though it could handle others.

## Usage

An upstream service (TCOG or Newsgraph) calls our Content API for data. It does by going through Tabula transparently.

For example: http://tabula.dcs4.digprod.cp1.news.com.au/https://cdn.newsapi.com.au/ARTICLE_URI

Tabula then keeps a copy of the data.

We also handle generic JSON data, which is stored as a "resource". This can include any JSON document from an upstream source.

## Installing

You'll need:

* A recent version of Node
* Redis 4.0.0 or higher
* Docker

Tabula connects to Redis in src/cache/lib/redis/index.ts with the following command line:

```
const defaultHost = process.env.REDIS_CACHE_HOST || 'localhost';
```


## Conventions

Each service can be run with the following commands.

- `yarn install`
- `yarn build` (for Typescript services)
- `yarn start`

\* No all applications support build.
\*\* `yarn start` should in general implement `forever <entry point script>.js`.


## Docker

### Run

```
docker-compose run --service-ports test yarn start
```

### Test

```
docker-compose run test
```

### Redis

```
docker-compose exec redis redis-cli
```