# Varnish

Varnish image based on _million12/varnish_. Proxy arbitrary backends using _envsubst_ from the _gettext_ package to substitute environment variables at startup.

## Config

- __BACKEND_HOST localhost__
- __BACKEND_PORT 3000__
- __VCL_CONFIG /etc/varnish/default.vcl__
- __CACHE_SIZE 64m__
- __VARNISHD_PARAMS -p default_ttl=3600 -p default_grace=3600__

## Run

```
docker-compose run --service-ports -e BACKEND_HOST=google.com -e BACKEND_PORT=80 varnish
```

## Test

```
docker-compose down; docker-compose build; docker-compose run test
```

## API

You can create [Varnish Ban Rules](https://book.varnish-software.com/4.0/chapters/Cache_Invalidation.html#banning) via a http request using the customer HTTP verb BAN and providing the X-Cache-Tags header.

```
curl -v -X BAN localhost:3004 -H "X-Cache-Tags: 123"
```


