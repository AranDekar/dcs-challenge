'use strict';

module.exports = function(logger, render, _, moment, configs, TCOG_HOST) {
    /**
     * @ngdoc function
     * @name templateHandler
     *
     * @description
     * Creates a request middleware for a specified default template and sets,
     * default view context if specified.
     *
     * @param {string} defaultTemplate  A default template to use
     * @param {object} routeCtx         Represents the view context to be used when
     *                                  rending the view
     *
     * @return {function}
     *
     */

    var self = function templateHandler(defaultTemplate, routeCtx) {
        routeCtx = routeCtx || {};

        const fn = function templateHandlerMiddleware(req, res) {
            var locals = res.locals,
                viewCtx = {
                    'display': locals.display,
                    'data': locals.data,
                    'query': locals.query,
                    'product': locals.product,
                    'config': locals.config,
                    'host': TCOG_HOST,
                    'moment': moment,
                    'url': req.url
                },

                // Templates are specified using the t_template parameter,
                // Should a tc_templateconfig paremeter be specified and it maps
                // to a template config with a style property this value will
                // not override t_template.

                template = locals.config.template,
                templateConfig = locals.config.templateconfig;

            // merge contexts together for use within template processing. Note,
            // denotes precedence.

            // 1. templateConfig: template specific context  |
            // 2. routeCtx      : route specific context     |
            // 3. viewCtx       : default context            v

            templateConfig = self.getTemplateConfig(templateConfig);
            viewCtx = _.merge(viewCtx, routeCtx, templateConfig);

            template = template || templateConfig.style || defaultTemplate;

            logger.debug(viewCtx, 'Rendering template "' + template + '"');

            render(req, res, req.next, template, viewCtx);
        };

        return fn;
    };

    /**
     * @ngdoc function
     * @name getTemplateConfig
     *
     * @description
     * Returns a template config which can be used for overriding / or simplifying
     * the selection of a template or setting a templates display paramters
     *
     * @param {string} conf  The name of the template config to use
     *
     * @return {object}
     *
     * @example
     *
     *    {
     *        "timestamp": true,
     *        "thumbnail": true,
     *        "style": "extended"
     *    }
     *
     *
     */

    function getTemplateConfig(configName) {
    // Use of hasOwnProperty is here in order to avoid exploitation of
    // tcog via bracket-parameter access. See:
    // https://blog.liftsecurity.io/2015/01/15/the-dangers-of-square-bracket-notation
        if (configName &&
            Object.hasOwnProperty.call(configs, configName) &&
            configs[configName] &&
            configs[configName].config) {
            return configs[configName].config;
        }

        return {};
    }

    self.getTemplateConfig = getTemplateConfig;
    self.render = render;

    return self;
};
