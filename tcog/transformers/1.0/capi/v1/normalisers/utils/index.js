var _ = require('lodash');

exports.containsCollection = function(results) {
    return _.some(results, function(item) {
        return item.contentType === 'COLLECTION';
    });
};
