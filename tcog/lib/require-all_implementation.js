module.exports = function(fs, string, require) {
    var self = function requireAll(path, options) {
        var jsFileExtension = /\.js$/,
            filesToRequire = self.fs.readdirSync(path);

        return (
            filesToRequire
                .filter(function(file) {
                    if (file === 'index.js' || !jsFileExtension.test(file)) return;

                    if (options && options.ignore) {
                        return !options.ignore.some(function(ignoreString) {
                            return file.indexOf(ignoreString) > -1;
                        });
                    }

                    return true;
                })
                .reduce(function(accumulator, file) {
                    var name =
                        string(file)
                            .replace(jsFileExtension, '')
                            .camelize();

                    accumulator[name] = self.require(path + '/' + file);

                    return accumulator;
                }, {})
        );
    };

    self.fs = fs;
    self.require = require;

    return self;
};
