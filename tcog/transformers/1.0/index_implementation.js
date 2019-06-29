module.exports = function(capi, video, metadata, foxsports, foxsportsPulse,
    componentsVideo, componentsArticle,
    componentsSPPImageResolver, componentsAuthor, charbeatAPI,
    archiveComments, vidora) {
    return ([
        capi,
        video,
        metadata,
        foxsports,
        foxsportsPulse,
        componentsVideo,
        componentsArticle,
        componentsSPPImageResolver,
        componentsAuthor,
        charbeatAPI,
        archiveComments
    ].reduce(function flatten(result, transformer) {
    // support transformer collections
        return result.concat(transformer);
    }, []));
};
