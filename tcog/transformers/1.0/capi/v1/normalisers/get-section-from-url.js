var url = require('url');

module.exports = function normalise(locals) {
    if (locals.data.results) {
    // Attempt to get a section name for each item in a list
        locals.data.results.forEach(getSectionForResult);
    }

    // But also get the section name for the main document if applicable.
    getSectionForResult(locals.data);

    return locals;
};

function getSectionForResult(result) {
    // Results without a link cannot give us a section link/name
    if (!result.link) return;

    // Parse the URL and extract the section components
    var storyPath = url.parse(result.link).path,

    // Split up the story path into chunks from which to extract the
    // category
        pathParts =
            storyPath.split(/\//ig)
                .filter(function(part) {
                    return !!part;
                })
                .reverse(),

        // We trim off two chunks of the URL — the slug and the fatwire ID.
        categoryParts = pathParts.slice(2).reverse();

    if (!categoryParts.length) return;

    result.sectionLink = '/' + categoryParts.join('/');

    // Create a human readable name from the section link
    result.sectionName =
        categoryParts[categoryParts.length - 1].split(/\-/ig)
            .filter(function(part) {
                return !!part;
            })
            .map(function(part) {
                return part[0].toUpperCase() + part.substr(1);
            })
            .join(' ');
}

module.exports.getSectionForResult = getSectionForResult;
