const _ = require('lodash'),
    T_PREFIX = 't_',
    TD_PREFIX = 'td_',
    TC_PREFIX = 'tc_';

module.exports = (req, res, next) => {
    const filterParamsFn = (value, key) => { return !(key.startsWith(T_PREFIX) || key.startsWith(TD_PREFIX) || key.startsWith(TC_PREFIX)); };
    const query = _.pickBy(req.query, filterParamsFn);

    res.locals.vidoraQuery = query;

    return next();
};
