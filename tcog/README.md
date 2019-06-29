# tcog

`tcog` facilitates the transformation and normalisation of downstream APIs into usable renderable content fragments.

> The term `tcog` is derived from the [Transformers](http://en.wikipedia.org/wiki/Transformers) franchise — a T-cog is the fictional device that enables the eponymous robots to transform.

## setup

Inside your cloned tcog directory:

1. Install [nvm](https://github.com/creationix/nvm) then install the node version for our project via: `nvm install`
2. Install redis using something like [homebrew](https://brew.sh): `brew install redis`
4. You probably want to also install an editorconfig plugin for your editor:
    1. [VSCode](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
    2. [Atom](https://atom.io/packages/editorconfig)

To facilitate testing TCOG with docker we have an alias for redis. We also have a mock-api for testing. Please add two entries to your /etc/hosts file as such:

```
127.0.0.1 redis
127.0.0.1 mock-api
```

This means we can refer to the redis server as a service that can resolve to localhost or a docker image (see docker-compose-yml).    

## linting

Inside your cloned tcog directory:

1. For linting we use [eslint](http://eslint.org) with [feross/standard](https://github.com/feross/eslint-config-standard) with a few customisations
2. Linting can be performed via `make lint` or `yarn run lint`, use `yarn run lint:verbose` to display warnings
3. You probably want to also install an [eslint plugin for your editor](http://eslint.org/docs/user-guide/integrations):
    1. [VSCode](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## development

In each terminal, run `nvm use` to use the correct node version for our project.

To get started with development:

1. In one terminal, start the redis server: `redis-server`
2. In another terminal, start the mock server: `yarn run mock`
3. In another terminal, start tcog server: `node run.js`

To run a specific test suite, such as `./test/.../content-metadata/index_spec.js`:

``` sh
env NODE_ENV=test ./node_modules/.bin/mocha ./test/unit/_unit.global.js ./test/integration/transformers/components/content-metadata/index_spec.js
```

To run test suites:

1. In one terminal, start the redis server.
1. In another terminal, start the mock server: `yarn run mock`
2. In another terminal, run desired test suite:
    1. For the entire test suite: `yarn test` (forwards to `make test`)
    2. For the unit test suite: `yarn run test:unit`
    3. For the integration test suite: `yarn run test:integration`
    4. For the regression test suite: `yarn run test:regression`


You can also run the following:

- To stop the mock server: `yarn run mock:stop` - useful if you are getting EADDR in use errors


There is also a `makefile` which delegates to `./build/*.mk` files. Make help available via: `make help`. These files are planned to be cleaned and/or removed.



## architecture

This is the process for loading the app:

1. yarn start loads `./run.js` which loads `./conf` and sends it to `./lib/app`
    1. `./lib/app` loads cache, conf, init-handler, logger, middleware, worker, and does:
        1. create tcog event emitter instance
        2. set `tcog.{requestHandler, server, worker, run, stop}`
            1. requestHandler - is an instance of initHandler `./lib/init-handler` which uses recursion to do the following:
                1. run the middlewares:
                    1. middleware `normalizeRequestUrl`
                    2. package `cors`
                    3. middleware `trackingPixelEndpoint`
                    4. middleware `fresh`
                    5. custom `cacheMiddleware`
                    6. middleware `requestInitialiser`
                    7. middleware `product`
                2. and finally run the `workerMiddleware` from `./lib/worker/index` which is loaded as the completion callback of the rest
            1. server - a placeholder for the created server
            2. worker (appears unused) - the `./lib/worker` require, powers the router
                1. `./lib/worker/index` loads in `./lib/worker/spawn-pool`, `./lib/worker/coalesce`, `./lib/render/helpers:cacheIfOk`
                    1. `./lib/worker/spawn-pool` boots a `./lib/worker/worker` per CPU and returns `sendToPool` which is used to send them messages
                    2. `./lib/worker/index` uses `sendToPool` in its `serviceRequest` which is used by its returned `workerMiddleware`
                3. `./lib/worker/worker` does:
                    1. sets `res.app` (appears unused) to the router `./lib/lib/worker/router`, the router then:
                        1. uses the middlewares:
                            1. middleware `requestInitialiser`
                            2. middleware `product`
                            3. `cacheIdRecorder`
                            4. `deprecateParams`
                            5. `queryProcessor`
                            6. `requireProduct` and `deprecateParams` for each transformer and their routes
                        1. add the routes:
                            1. `/` to templateHandler middleware
                            2. `/cache/info/:id` to cacheInfo
                            3. `/healthcheck` to healhcheck
                            4. `/robots.txt`
                            5. `/scrutinise` to scrutinise middleware
                            6. 404 and 500 status code repsonder middlewares
                    2. also defines `res.{end, finished, getHEader, headers, req, send, setHeader, status, statusCode, write, writeHeader}`
                        1. todo it probably defines these again as the express dependency is not forwarded to the worker
            1. run - method that creates the server around `requestHandler` and listens
            2. stop - method that stops the server
        3. catches uncaughtExceptions for logging
    1. `./run.js` then calls `./lib/app:tcog.run` which starts the server


## configuration

Server configuration is located in `./conf`. These are used to configure our server environment.

Application configuration is located in `./config/envs`. These generally specify app configuration that are universal across products.

Product configuration is located in `./conf/products`. These generally specify API keys and endpoints that are specific to particular products.

Template configuration is locatated in `./config/templates`. @todo @nicholasf will be able to explain.

Configuration is loaded by `./conf/index_implementation.js` and used as a `conf` variable. The loading process works as so:

- `conf.env` is the specified environment, which is `NODE_ENV` or `development`
- `conf.nodeVersion` is `process.versions.node`, used for the homepage and stack logging
- `conf.envs` is the merged configuration of `./conf/envs/development` and `./conf/envs/${NODE_ENV || 'development'}`
- `conf.products` is the merged configuration of `./conf/products/development` and `./conf/products/${t_product || 'development'}`
- `conf.is${env}()` returns true if the `conf.env` is `${env}`

Running tcog with the `regression` environment will use the local mock-server. Content previously requested will be responded from the mock-server first, should it not exist then it will be fetched from production to be cached and used subsequently.


## contribute

Want to report a bug, request a feature, or help us build `tcog`? Check out our in depth guide to [contributing]() to `tcog`

## authorship

Ensure your global git config is configured correctly with your normal git/github/personal details:

``` sh
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --global github.user your-github-username
```

Then inside the `tcog` repo directory, configure the repository to use your newscorp email:

``` sh
git config user.email "your.name@news.com.au"
```

Add your newscorp email to your [github emails](https://github.com/settings/emails) and verify it.
