# Deck Events Adapter

HTTP Endpoint to invalidate Deck content from cache.

## Run

```
yarn start
```

## Test

```
yarn test
```

## Config

```
REDIS_PUB_SUB_HOST
```

The Redis host to connect.

```
REDIS_PUB_SUB_CHANNEL
```

The Redis channel to publish.

```
PORT
```

The HTTP port to listen on.

## Endpoints

Provides HTTP interface to create Deck content events to invalidate cache.

```
/deck/:id
```

HTTP POST -> Redis Pub/Sub Content Changed Message. Where `:id` is the Deck id.

```
/healthcheck
```

Returns HTTP 200 if connected to Redis.

## Architecture

```
                   HTTP Post /deck/:id

                           +
                           |
                           v

                  +-------------------+
                  |Deck Events Adapter|
                  +-------------------+

                           +
                           |
                           v

                        Publish

                           +
                           |
                           v

                        +-----+
                        |Redis|
                        +-----+

                           +
                           |
                           v

                       Subscribe

                           +
+----------------------+   |   +------+
|Varnish Events Adapter| <-+-> |Tabula|
+----------------------+       +------+

            +
            |
            v

       HTTP BAN /

            +
            |
            v

        +-------+
        |Varnish|
        +-------+
```




