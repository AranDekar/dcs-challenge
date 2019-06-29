'use strict';

const conf = require('./../../../conf'),
    logger = require('./../../../lib/logger'),
    middleware = require('./../../../lib/middleware'),
    agent = require('./../wordpress');

const domainGuard = require('./../domain-guard')(conf.products);

const wordpress = (req, res, next) => {
    const widgetId = req.params.widget_id;

    const wordpressAgent = agent(`${conf.sppAPI}v1/widgets/public/${widgetId}`, 'text/html');
    return wordpressAgent(req, res, next);
};

module.exports = [domainGuard, wordpress, middleware.templateHandler('basic')];
