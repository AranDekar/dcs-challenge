# Newsgraph

CAPI API GraphQL proxy.

- CAPI version two endpoint: `/graphql/v2`
- CAPI version three endpoint: `/graphql/v3`
- CAPI version three mapped to version two endpoint: `/graphql/v3tov2`
- CAPI version two facade to version three data `/facade/content/v2/methode/:id`


NewsGraph relies upon env vars to identify the CAPI API it needs to read from - CAPI_V3_URL & CAPI_V2_URL.

For example, for the SIT environment:

```

CAPI_V3_URL=https://content-sit.api.news CAPI_V2_URL=https://cdn.newsapi.com.au/sit yarn start
```

Typically, DCS will use Tabula as a caching proxy for CAPI calls, so the start might look like:

```
CAPI_V2_URL=http://tabula.dcs.news.com.au/content-sit.api.news CAPI_V3_URL=http://tabula.dcs.news.com.au/cdn.newsapi.com.au/sit yarn start
``` 

## Development

```
yarn run dev
```

## Test

```
yarn test
```

## Run

```
yarn start
```

## Build

```
yarn run build
```


CAPI Servers

SIT - 'content-sit.api.news'