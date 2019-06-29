'use strict';

module.exports = () => {
    /**
     * @ngdoc function
     * @name routerEnforcer
     *
     * @description
     * Prevents the rendering of content when it is not of type article or
     * gallery
     *
     * @param {object}   req   standard express/http request object
     * @param {object}   res   standard express/http response object
     * @param {function} next  Callback to continue chain
     *
     */

    return function contentEnforcerMiddleware(req, res, next) {
        let data = res.locals.data || {},
            contentType = data.contentType,

            isValidContent = contentType === 'NEWS_STORY' ||
                             contentType === 'IMAGE_GALLERY' ||
                             contentType === 'PROMO';

        if (isValidContent) { return next(); }

        if (data) {
            return res.status(404).end(JSON.stringify({
                message: 'Content not available.',
                code: '404',
                raw: JSON.stringify(data)
            }));
        } else {
            return res.status(404).end(JSON.stringify({
                message: 'Content not available.',
                code: '404',
                raw: 'none'
            }));
        }
    };
};
