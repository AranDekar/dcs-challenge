/**
 * Maps an array of recommended content from Vidora into res.locals.newsgraph.variables
 * for upstream use.
 */

module.exports = (req, res, next) => {
    let vidoraIds;
    res.locals.newsgraph = {};

    if (res.locals.vidora) {
        vidoraIds = res.locals.vidora.map(function(item) {
            return item['id'];
        });
        res.locals.newsgraph.otherVariables = {
            ids: vidoraIds
        };
    } else {
        return next();
    }

    next();
};
