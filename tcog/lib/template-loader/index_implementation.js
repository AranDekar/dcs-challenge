const opsgenie = require('./../opsgenie');
const logger = require('../logger');

module.exports = function(npath, logger, sandbox, processViewName, adapters, now) {
    /**
     * @ngdoc function
     * @name loadTemplate
     *
     * @description
     * Public interface to facilitate the loading of templates for use by tcog.
     *
     * @param {string}   fallback    The fallback path for view resolution
     * @param {string}   view        The un-normalised path to the view
     * @param {object}   data        The data passed to the view
     * @param {function} callback    Return error or result to parent
     *
     * @returns  {null}  null
     *
     */
    const self = function loadTemplate(fallback, view, data, callback) {
        processViewName(view, Object.keys(adapters), function(err, adapter, view) {
            if (err) return callback(err);

            self._load(adapter, view, data, function(err, rendered) {
                if (err) return callback(err);
                callback(null, rendered);
            });
        });
    };

    /**
     * @ngdoc function
     * @name load
     *
     * @description
     * Internal function which encapsulates the loading of templates internal to tcog,
     * based upon a named adapter which provides a variable means of loading templates
     * in different ways.
     *
     * @param {string}   adapter     The name of the view adapter to use
     * @param {string}   view        The path to the view
     * @param {object}   data        The data to pass to the view
     * @param {function} callback    Return error or rendered result to calling parent
     *
     * @returns  {null}  null
     *
     */

    function load(adapter, view, data, callback) {
        var tenMinutes = 6e5,
            cacheKey = adapter + '/' + view,
            cached = self.templates[cacheKey],
            state = cached ? 'stale' : 'fresh',
            cantExpire = adapter === 'core' || adapter === 'external',
            stillFresh;

        logger.debug({
            'adapter': adapter,
            'view': view
        }, 'Loading ' + state + ' view - path: ' + view + ' adapter: ' + adapter);

        // scenarios
        // cached & can't expire
        // cached & still fresh
        // cached & not fresh & can expire
        // not cached & adapter throws error
        // not cached & adapter returns template & recached

        if (cached) {
            stillFresh = cached.timestamp && cached.timestamp > (now() - tenMinutes);

            if (cantExpire || stillFresh) {
                return self.processTemplate(cached, data, callback);
            }

            // Set cache timestamp to prevent concurrent requests going upstream
            cached.timestamp = now();
        }

        adapters[adapter](view, function adapterCallback(err, template) {
            if (err) {
                return callback(err);
            }

            cached = self.templates[cacheKey] = sandbox(cacheKey, template);
            cached.timestamp = now();
            self.processTemplate(cached, data, callback);
        });
    }

    /**
     * @ngdoc function
     * @name processTemplate
     *
     * @description
     * Process a template and capture success or failure.
     *
     * @param {function} template    Template processer function
     * @param {object}   data        The context to pass to processor
     * @param {function} callback    Callback to handle error or success
     *
     * @returns {null}
     *
     */

    function processTemplate(template, data, cb) {
        var output;

        try {
            output = template(data);
        } catch (err) {
            const notificationData = {
                product: data.config.product,
                url: data.url,
                template: data.config.template
            };

            opsgenie(err, notificationData, (err) => {
                if (err) {
                    logger.error({ err: err }, 'Unable to send template error to opsgenie');
                }
            });

            return cb(err);
        }

        cb(null, output);
    }

    self._load = load;
    self.processTemplate = processTemplate;
    self.templates = {};

    return self;
};
