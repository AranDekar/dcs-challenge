# Running tests

To bring up the stack for integration testing, from the top level dir of `pp-services` run

```
docker-compose -f docker-compose.yml -f ./tests/docker-compose.override.yml up
```

The env file means that, among other things, TCOG will start up with the right conf, pointing to Tabula.

When this is done, you can then run the legacy tests. Go into the pp-services/tests folder and run

```
yarn run legacy1
```

## Background

`article-urls.txt`, `urls.txt` and `prod-urls` are fixture files taken from pp-services/tcog/test/data and used in integration testing for TCOG.

As part of refactoring TCOG into a group of services, we have to prove that the old set of TCOG URLs will render in the same way against the newer TCOG.

The `loader.ts` script is therefore meant to be run against the legacy TCOG, targetting the legacy TCOG that calls CAPI via Tabula. This way, we have all of CAPI's data for these URLs stored in Redis and we can later start the newer TCOG up and assert that each URL that passed for old TCOG works for new TCOG.

## How to build a test dataset in Redis

This ended up becoming quite a manual process. We will probably be repeating it during integration testing and can hone it.

In the end, it was simpler to do it outside of docker-compose. Though, without time constraints, I would have preferred to set it up this way.

1. Using the redis.conf in /tests/test/data/redis.conf, start up a local redis.

`redis-server ./tests/test/data/redis.conf`

2. Configure the integration environment in *legacy tcog* to have a redis TTL of 1 second:

This means you will need another copy of pp-services checked out locally.

```
  "cache": {
    "tiers": {
      "remote": {
        "host": "localhost",
        "port": 6379,
        "ttl": 1
      }
    }
```

It should also be proxying through Tabula using the following conf:

```
  "contentAPI": "http://localhost:3001/http://cdn.newsapi.com.au",
  "articleContentAPI": "http://localhost:3001/http://cdn.newsapi.com.au",
```

3. Now, in Tabula, change the src/cache/ttlDecider to return a long lived value for all cache entries. I defaulted to 100 x FIFTEEN_MINUTES.

4. Switch back to the original copy of pp-services, `cd tests` and run `yarn run data-loader`.

5. The following new files will be produced:

```
	new file:   integration-test-manifest.json
	new file:   test/data/integration-data.rdb
```

The manifest maps status codes to groups of URLs:
```
{
  "200":[...],
  "404: [...],
  etc.
}
```

Later, in a test, each URL can be called via the newer TCOG with Tabula using the underlying .rdb file so we can perform a 'like for like test'.
