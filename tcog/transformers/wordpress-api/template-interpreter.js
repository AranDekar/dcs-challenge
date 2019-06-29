const _ = require('lodash');

_.templateSettings.interpolate = /\{\{(.+?)\}\}/g;

module.exports = (url, req) => {
    if (url.includes('{{')) {
        url = _.template(url)(req);
    }

    return url;
};
