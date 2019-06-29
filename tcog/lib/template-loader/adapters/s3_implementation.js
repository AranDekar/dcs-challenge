module.exports = function(request, JSON, config) {
    /**
     * @ngdoc function
     * @name loadS3Template
     *
     * @description
     * This provides a standardised way of loading and compiling Jade templates,
     * which have been fetched from a remote S3 source which returns a code string
     * to be loaded within the context of node-vm.
     *
     * @param {string}     path        The path to the view
     * @param {function}   callback    Handles error or success
     *
     */

    var self = function loadS3Template(path, callback) {
    // expand shortend template path to full
    //
    // eg: from chronicle-quest/article/index
    //     to   chronicle/quest/latest/templates/article/index.json
    //
    // eg: from chronicle/quest/article/index
    //     to   chronicle/latest/templates/quest/article/index.json
    //
    // eg: from chronicle_quest/article/index.json
    //     to   chronicle/quest/latest/templates/article/index.json
    //
    // eg: from chronicle_quest/article/index@v2.0.0
    //     to   chronicle/quest/v2.0.0/templates/article/index.json

        path = path.split('@');

        var version = path[1] || 'latest';

        path = path[0].split('/');
        path = path.shift().replace(/-/g, '/') + '/' + version + '/templates/' + path.join('/');
        path = '/' + path + '.json';

        self._requestFromRemote(path, callback);
    };

    /**
     * @ngdoc function
     * @name _requestFromRemote
     *
     * @description
     * Request a remote template via request and delegate handling of
     * response to self._handleResponse
     *
     * @param {string}     template    The path to the remote template
     * @param {function}   callback    Handles error or success
     *
     */

    self._requestFromRemote = function _requestFromRemote(path, callback) {
    // construct remote request path
    //
    // eg: http://<host>/chronicle-quest/latest/templates/article/index.json

        var uri = config.api.template + path,
            handler = self._handleResponse.bind(null, path, callback);
        request(uri, handler);
    };

    /**
     * @ngdoc function
     * @name _handleResponse
     *
     * @description
     * Handles a remote request response, calling back with an error or a template
     * string for later processing
     *
     * @param {string}      path        The path to the remote template
     * @param {function}    callback    Handles error or success
     * @param {object}      req         Reference to HTTP request object
     * @param {object}      res         Reference to HTTP response object
     * @param {string}      body        The raw response body
     *
     */

    self._handleResponse = function _handleResponse(path, callback, err, res, body) {
        var code;

        if (err || res.statusCode >= 400) {
            return callback(err ||
                new Error('Unable to fetch remote template "' + path + '"'));
        }

        try {
            code = 'var template = ' + JSON.parse(body).template + ';\noutput = template(data);';
        } catch (parseError) {
            return callback(parseError);
        }

        callback(null, code);
    };

    return self;
};
