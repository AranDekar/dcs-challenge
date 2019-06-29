'use strict';

module.exports = function(basePath, bunyan, config, fs, path, pid) {
    const streams = function(config) {
        switch (config.env) {
            default:
                return [{
                    stream: process.stdout,
                    level: config.logLevel
                }];
        }
    };

    function logger(config) {
        return bunyan.createLogger({
            name: 'tcog',
            serializers: bunyan.stdSerializers,
            streams: streams(config)
        });
    }

    return logger(config);
};
