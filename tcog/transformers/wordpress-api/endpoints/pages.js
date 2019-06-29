'use strict';

const conf = require('./../../../conf'),
    logger = require('./../../../lib/logger'),
    middleware = require('./../../../lib/middleware'),
    agent = require('./../wordpress');

const domainGuard = require('./../domain-guard')(conf.products);

const wordpress = agent(`${conf.sppAPI}v1/pages`, 'application/json');

module.exports = [domainGuard, wordpress, middleware.templateHandler('basic')];
