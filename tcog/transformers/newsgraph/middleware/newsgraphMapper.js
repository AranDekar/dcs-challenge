const _ = require('lodash');
const config = require('../../../conf');

module.exports = (req, res, next) => {
    if (!res.locals.newsgraph) {
        res.locals.newsgraph = {};
    }

    const apiKey = config.products[res.locals.product.name].capiV3APIKey || config.capiV3APIKey;
    res.locals.newsgraph.otherVariables = {
        apiKey: apiKey
    };

    const otherVariables = res.locals.newsgraph.otherVariables,
        variablesOverride = res.locals.display,
        queryVariables = JSON.parse(res.locals.query.variables);

    const graphQLQuery = res.locals.query.query,
        graphQLVariables = JSON.stringify(_.extend(queryVariables, otherVariables, variablesOverride));

    res.locals.newsgraph = {
        query: graphQLQuery,
        variables: graphQLVariables
    };

    next();
};
