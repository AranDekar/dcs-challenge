var defaultEnv = 'development',
    configs = ['envs', 'products'],

    envs = [
        'awsdev',
        'development',
        'perf',
        'production',
        'regression',
        'sit',
        'staging',
        'test'
    ];

module.exports = function(NODE_ENV, load, merge, join) {
    var currentEnv = NODE_ENV || defaultEnv,
        config = {},
        conf = {};

    configs.forEach(function(item) {
        var cfg = {
            default: load(join(item, defaultEnv + '.json'))
        };

    // a default config must always exist. Should a config for the
    // current environment be missing it will allways use the default
    // config

        try {
            cfg.current = load(join(item, currentEnv + '.json'));
        } catch (err) {
            cfg.current = {};
        }

        config[item] = merge({}, cfg.default, cfg.current);
    });

    // normalize

    conf = config.envs;
    conf.env = currentEnv;
    conf.nodeVersion = process.versions.node;
    conf.products = conf.products || {};
    conf.products = merge(conf.products, config.products);

    // legacy product config to be deprecated with capi v3 migration.

    Object.keys(config.products).forEach((name) => {
        conf.products[name].apiKey = conf.products[name].capiV2APIKey;
        conf.products[name].imageApiKey = conf.products[name].capiV2APIImageKey;
        conf.products[name].configApiKey = conf.products[name].capiV2APIConfigKey;
        conf.products[name].apiKeyArticle = conf.products[name].capiV2APIProductArticleKey;
    });

    envs.forEach(function(name) {
        var envFuncName = name.charAt(0).toUpperCase() + name.slice(1);
        conf['is' + envFuncName] = function() {
            return conf.env === name;
        };
    });

    return conf;
};
