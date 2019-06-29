module.exports = function(readdirSync, readFileSync, statSync, scanDirectory) {
    /**
     * @ngdoc function
     * @name loadCoreTemplatesFromDisk
     *
     * @description
     * This function recursively scans a directory for jade templates, and
     * loads them into a map, organised (keyed) by their filepath.
     *
     * This allows us to avoid exposing the filesystem to dynamic input.
     *
     * @param {string} directory    the directory to scan
     * @param {object} map          the map in which to store the scan result
     *
     * @returns {object} map        a map of the template source
     *
     */

    function loadCoreTemplatesFromDisk(basePath) {
        return (function recursiveLoader(path, map) {
            var currentPath = basePath + '/' + path.join('/'),
                viewData;

            if (statSync(currentPath).isDirectory()) {
                readdirSync(currentPath).forEach(function(item) {
                    recursiveLoader(path.concat([item]), map);
                });
            } else if (currentPath.match(/\.jade$/i)) {
                viewData = readFileSync(currentPath, 'utf8');

                // Because this was originally set up to load templates out of
                // the `common` folder in the past,
                if (path[0] === 'common') {
                    map[path.slice(1).join('/').replace(/\.jade$/i, '')] = viewData;
                } else {
                    map['../' + path.join('/').replace(/\.jade$/i, '')] = viewData;
                }
            }

            return map;
        })([], {});
    }

    return loadCoreTemplatesFromDisk(scanDirectory);
};
