var config = require('../../conf'),
    version = require('../../package.json').version;

module.exports = function(req, res, next) {
    if (req.query['t_stack']) {
        res.setHeader('X-TCOG-Version', version);
        res.setHeader('X-TCOG-Node-Version', config.nodeVersion);
        res.setHeader('X-TCOG-Environment', config.env);
    }
    next();
};
