var agent = require('./agent'),
    guard = require('./middleware/guard')(),
    // clean up params
    normalizeParams = require('./middleware/normalizeParams')(),
    // amazon s3 does not return a content-type of application/json
    // this middleware is required to ensure it is correctly parsed
    toJSON = require('./middleware/toJSON')(),
    render = require('../../lib/middleware/').templateHandler;

var agentRequest = function(req, res, next) {
    if (!req.params.path) { return next(); }
    return guard(req, res, function(err) {
        if (err) { return next(err); }
        return agent('{{ params.resource }}/{{ params.path }}')(req, res, next);
    });
};

module.exports = [normalizeParams, agentRequest, toJSON, render('component/resource/default')];
