// jscs:disable maximumLineLength

/**
* @ngdoc function
* @name deconstructArticleURL
*
* @description
* Takes the URL for the current article, and parses it to extract key data such
* as the story ID, slug, attempts to determine the section it came from, the
* fatwire Section ID, attempts to determine whether the story came from fatwire
* or methode, and generates an `upstreamID`, which is used to fetch the story
* from CAPI.
*
* The article URL is plucked from the request parameters.
*
* @param {object}   req  The node/express request object
* @param {object}   res  The node/express response object
* @param {function} next Callback to invoke the next middleware function.
*
* @return {function}
*
*/

var MATCH_FATWIRE_WITH_FATWIRE_SECTION = /^(story|photos|gallery)\-[a-z0-9]+\-\d{13}$/i,
    MATCH_FATWIRE_WITHOUT_SECTION = /^(story|photos|gallery)\-\d{13}$/i,
    MATCH_FATWIRE_BARE_ID = /^\d{13}$/,
    // Methode
    MATCH_METHODE_WITH_FATWIRE_SECTION =
        /^(story|photos|gallery)\-[a-z0-9]+\-[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}$/i,
    MATCH_METHODE_WITHOUT_SECTION =
        /^(story|photos|gallery)\-[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}$/i,
    MATCH_METHODE_BARE_ID =
        /^[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}$/i,
    // CAPI
    MATCH_FATWIRE_CAPI_HYBRID_ID =
        /^(story|photos|gallery)\-[a-z0-9]+\-[a-f0-9]{32}$/i,
    MATCH_CAPI_BARE_ID = /^[a-f0-9]{32}$/i;

module.exports =
    function deconstructArticleURL(req, res, next) {
        var id, origin, originString, sectionID,
            articleURL = req.params[0],
            urlParts = articleURL.split(/\/+/).filter(function(part) {
                return part && part.length > 0;
            }),
            originalUri = '/' + urlParts.join('/'),
            contentType,

            // The story ID is always the last item in the URL
            storyIDParts = urlParts.pop();

        // This part matches each of the currently supported ID/section formats
        if (storyIDParts.match(MATCH_FATWIRE_WITH_FATWIRE_SECTION)) {
            storyIDParts = storyIDParts.split('-').slice(1);
            sectionID = parseInt(storyIDParts.shift(), 36);
            id = storyIDParts.pop();
            origin = 'fatwire';
        } else if (storyIDParts.match(MATCH_METHODE_WITH_FATWIRE_SECTION)) {
            storyIDParts = storyIDParts.split('-').slice(1);
            sectionID = parseInt(storyIDParts.shift(), 36);
            id = storyIDParts.join('-');
            origin = 'methode';
        } else if (storyIDParts.match(MATCH_FATWIRE_WITHOUT_SECTION)) {
            storyIDParts = storyIDParts.split('-').slice(1);
            sectionID = null;
            id = storyIDParts.pop();
            origin = 'fatwire';
        } else if (storyIDParts.match(MATCH_METHODE_WITHOUT_SECTION)) {
            storyIDParts = storyIDParts.split('-').slice(1);
            sectionID = null;
            id = storyIDParts.join('-');
            origin = 'methode';
        } else if (storyIDParts.match(MATCH_METHODE_BARE_ID)) {
            sectionID = null;
            id = storyIDParts;
            origin = 'methode';
        } else if (storyIDParts.match(MATCH_FATWIRE_BARE_ID)) {
            sectionID = null;
            id = storyIDParts;
            origin = 'fatwire';
        } else if (storyIDParts.match(MATCH_CAPI_BARE_ID)) {
            sectionID = null;
            id = storyIDParts;
            origin = 'capi';

            contentType = urlParts[urlParts.length - 1];

            if (contentType && contentType.match(/^(news-story|image-gallery)/)) {
                urlParts.pop();
            }
        } else if (storyIDParts.match(MATCH_FATWIRE_CAPI_HYBRID_ID)) {
            storyIDParts = storyIDParts.split('-').slice(1);
            sectionID = parseInt(storyIDParts.shift(), 36);
            id = storyIDParts.join('-');
            origin = 'capi';
        } else {
        // Match CAPI response
            return (
                res
                    .status(404)
                    .end('{"message":"Content doesn\'t exist","code":404}'));
        }

        res.locals.config = res.locals.config || {};
        res.locals.config.articleURL = {
            'uri': originalUri,
            'slug': urlParts.pop(),
            'section': urlParts,
            'sectionID': sectionID,
            'id': id,
            'origin': origin,
            'upstreamID': origin === 'capi' ? id : 'origin:' + origin + '.' + id
        };

        next();
    };
