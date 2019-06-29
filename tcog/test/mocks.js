module.exports.redisClientPromiseHandler = function(event) {
    return {
        then: function() {
            return {
                error: function() {

                }
            };
        }
    };
};
module.exports.redisClient = {
    on: module.exports.redisClientPromiseHandler,
    hgetall: module.exports.redisClientPromiseHandler,
    hmset: module.exports.redisClientPromiseHandler,
    del: module.exports.redisClientPromiseHandler,
    flushdb: module.exports.redisClientPromiseHandler
};

module.exports.redis = {
    createClient: function(port, host) {
        return module.exports.redisClient;
    }
};

module.exports.EventEmitter = function() {
    return {
        setMaxListeners: function() {},
        once: function() {}
    };
};

module.exports.cache = {
    del: function() {},
    get: function(key, options, cb) { cb(); },
    set: function(key, value, options) {}
};

module.exports.agentHelpers = {
    assembleURL: sinon.stub(),
    decompressQuery: sinon.stub()
};

module.exports.request = function() {};

module.exports.logger = {
    error: function() {},
    info: function() {}
};

module.exports.url = {
    parse: function(url, parseQuery) {
        return {};
    }
};
