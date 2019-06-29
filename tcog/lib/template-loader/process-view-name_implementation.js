module.exports = function() {
    var exported = {};

    /**
     * @ngdoc function
     * @name processViewName
     *
     * @description
     * Process a view and extract the adapter it should use and the normalised
     * view path
     *
     *
     * @param {string}   fallback    The fallback path for view resolution
     * @param {string}   view        The un-normalised path to the view
     * @param {object}   adapters    An array of names for possible adapters
     * @param {function} callback    Return error or result to parent
     *
     * @returns
     *
     * @example
     *
     *    (error?, adapter, view);
     *    (null, 'core', 'normalized/view/path');
     *
     */

    return function processViewName(view, adapters, callback) {
        var adapter, validAdapter;

        // deconstruct a view path into its respective parts
        // eg: ( adapter/some/path/to/a/view ) => ['adapter', 'some', .... ]

        view = view.split(/[/]+/i).filter(function(item) {
            return item.length > 0;
        });

        adapter = view[0];
        validAdapter = ~adapters.indexOf(adapter);

        if (validAdapter) {
            view = view.slice(1).join('/');
            return callback(null, adapter, view);
        }

        // If the adapter wasn't valid, we assume this is a 'core' template,
        // loaded from the filesystem derived map.
        callback(null, 'core', view.join('/'));
    };
};
