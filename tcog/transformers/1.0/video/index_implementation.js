const logger = require('../../../lib/logger');
module.exports = function(config, agentMiddleware, templateHandler) {
    const root = __dirname + '/../../../',
        self = {},
        videoCategories = require(root + 'conf/video/merged.json');

    self.middleware = [
        function(req, res, next) {
            const vcs = JSON.parse(JSON.stringify(videoCategories));  // ensure we don't mess with the original data

            // domain is active, but the others are legeacy
            const hostname = String(req.query.domain || req.query.td_domain || req.query.site || req.query.td_site || '')
                .trim()
                .toLowerCase()
                .replace(/\..+/, '');

            const site =
                hostname === 'news' ? 'newscomau' : (
                    hostname === 'mercury' ? 'themercury' : (
                        hostname === 'betadailytelegraph' ? 'dailytelegraph' : (
                            hostname === 'the-australian' ? 'theaustralian' : hostname
                        )
                    )
                );

            if (site) {
                res.locals.data = vcs.filter(function(vc) {
                    logger.debug('Err in video transformer: ', { site: site, fullTitle: vc.fullTitle, whiteList: vc.whitelist.indexOf(site), joinedWhiteList: vc.whitelist.join(', ') });
                    return vc.whitelist.indexOf(site) !== -1;
                });
            } else {
                res.locals.data = vcs;
            }
            next();
        },
        templateHandler(root + 'transformers/video/index')
    ];

    self.routes = {
        '/news/video/categories': self.middleware
    };

    return self;
};
