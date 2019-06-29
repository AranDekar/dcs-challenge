/**
* @ngdoc function
* @name templateConfigsLoader
*
* @description
* Loads legacy template configs from the disk, to create a safely accessible
* map.
*
* @param {function} readdirSync    Function from node core, for reading
*                                  directory contents
* @param {function} readFileSync   Function from node core, for reading file
*                                  contents
*
* @return {object}
*
*/

var templateConfigsLoader = function(readdirSync, readFileSync) {
    var safeTemplateConfigsByPath = {};

    function isJsonFile(filename) {
        return /\.json$/i.exec(filename);
    }

    function stripJsonExtension(filename) {
        return filename.replace(/\.json$/i, '');
    }

    function recreateTemplatePath(map, name) {
        map[name] = readFileSync(__dirname + '/templates/' + name + '.json');
        return map;
    }

    safeTemplateConfigsByPath =
        readdirSync(__dirname + '/templates')
            .filter(isJsonFile)
            .map(stripJsonExtension)
            .reduce(recreateTemplatePath, safeTemplateConfigsByPath);

    return safeTemplateConfigsByPath;
};

module.exports = templateConfigsLoader;
