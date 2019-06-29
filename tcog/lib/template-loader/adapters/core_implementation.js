module.exports = function(npath, viewMap, jade, viewBasePath) {
    /**
     * @ngdoc function
     * @name loadCoreTemplate
     *
     * @description
     * This provides a standardised way of loading and compiling Jade templates,
     * returning a code string to be loaded within the context of node-vm.
     *
     * @param {string}     path        The path to the view
     * @param {function}   callback    Handles error or success
     *
     */

    var self = function loadCoreTemplate(path, callback) {
    // Using hasOwnProperty to guard against potential vulnerabilities
    // with bracket-property access in JS.
    // https://blog.liftsecurity.io/2015/01/15/the-dangers-of-square-bracket-notation
        if (!Object.hasOwnProperty.call(viewMap, path)) { return callback(new Error("Template doesn't exist in map.")); }

        return self.compileJade(path, viewMap[path], callback);
    };

    /**
     * @ngdoc function
     * @name resolveLegacyPath
     *
     * @description
     * Handles paths which may contain 'node_modules' and correctly resolves
     * them relative to the current known base path.
     *
     * @param {string}     path        The path to the view
     *
     */

    function resolveLegacyPath(path) {
        var nodeModules = ~path.indexOf('node_modules'),
            filename = nodeModules
                ? npath.resolve(viewBasePath, npath.relative(viewBasePath, path))
                : npath.join(viewBasePath, path);

        filename = filename + '.jade';

        return filename;
    }

    /**
     * @ngdoc function
     * @name compileJade
     *
     * @description
     * Compiles a string to a Jade template
     *
     * @param {string}     path        The path to the view
     * @param {string}     output      A raw Jade template
     * @param {function}   callback    Handles error or success
     *
     */

    function compileJade(path, output, callback) {
        var code,
            filename = self.resolveLegacyPath(path);

        try {
            code = jade.compileClient(output, {
                'filename': filename
            }) + '\noutput = template(data);';
        } catch (err) {
            return callback(err);
        }

        callback(null, code);
    }

    self.compileJade = compileJade;
    self.resolveLegacyPath = resolveLegacyPath;

    return self;
};
