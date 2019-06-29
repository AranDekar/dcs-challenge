# DCS Pied Piper Services

- TCOG - template rendering.
- Tabula - http caching proxy.
- CAPI Events Adapter - CAPI sqs events redis bridge. 
- Varnish - reverse proxy cache for TCOG.
- Varnish Events Adapter - for purging stale CAPI content.

## Conventions

Each service can be run with the following commands.

- `yarn install`
- `yarn build` (for Typescript services)
- `yarn start`

\* No all applications support build.
\*\* `yarn start` should in general implement `forever <entry point script>.js`.

## Building Images with The Newscorp Proxy

Newscorp uses a HTTP and HTTPS Proxy for traffic internally. The identity of this server can vary depending on whether you are in the office, on AWS or somewhere else on the VPN.

The proxy value is required for the build step (for yarn, yum, etc. to call out of the network via HTTP/HTTPS).

When

* in the office use `HTTP_PROXY=http://proxy.news.net.au:8080"
* on AWS (digdev) use `HTTP_PROXY=http://proxy-dev.cp1.news.com.au:8080`
* elsewhere, on the VPN use `HTTP_PROXY=` (or just leave these vars blank).

As the HTTP_PROXY is the same as the HTTPS_PROXY, you only end up having to specify the HTTP_PROXY in your environment (see example command below).

It's worth reading about how the proxy args are a special case in Docker: https://docs.docker.com/engine/reference/builder/#predefined-args.

Take the trouble to be aware of using the right proxy value in the right circumstance. If you get this right our docker practice becomes pretty simple.

### Building with docker-compose

```
HTTP_PROXY=http://proxy.news.net.au:8080 docker-compose build
```

### Building with docker

Be aware that docker-compose and docker operate differently when setting build time or environment variables. To set the HTTP_PROXY via a docker command you would, instead, use

```
docker build -f Dockerfile.varnish . --build-arg http_proxy=http://proxy.news.net.au:8080
```

## Bringing up the services 

```
HTTP_PROXY=http://proxy.news.net.au:8080 docker-compose up
```

## Tests

```
 docker-compose run test
```

## Documentation

The /slate directory is used for our documentation - see /slate/source/index.html.md. To run it you will need Ruby 2.3.1 or newer.

```
cd slate
bundle install
bundle exec middleman server
```