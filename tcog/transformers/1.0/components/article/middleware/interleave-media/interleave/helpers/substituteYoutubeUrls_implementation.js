'use strict';

module.exports = function() {
    /**
     * @ngdoc function
     *
     * @name substituteYoutubeUrls
     *
     * @description
     * Substitues youtube urls for media elements with contentType 'IFRAME'
     * to enable embedding
     *
     * @param  {object} paragraph
     *
     * @return {object}
     *
     */
    return function substituteYoutubeUrls(paragraph) {
        if (paragraph.contentType !== 'IFRAME') {
            return paragraph;
        }

        if (paragraph.iframeUrl &&
                paragraph.iframeUrl.match(/youtube.com\/watch/i)) {
            var mediaId = paragraph.iframeUrl.match(/v=([^&]+)/i);
            if (mediaId && mediaId[1]) {
                paragraph.iframeUrl = '//www.youtube.com/embed/' + mediaId[1];
            }
        }

        return paragraph;
    };
};
