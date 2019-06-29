'use strict';

module.exports = function(pickRelated) {
    /**
     * @ngdoc function
     *
     * @name augmentNode
     *
     * @description
     * Augment a node by enhancing attributes based upon the
     * defined class="capi-<type>" using related items for values
     *
     * @param  {Object}    locals   provides access to the request locals
     * @param  {Object}    node     dom node
     *
     * @return {object}
     *
     */
    return function augmentNode(locals, node) {
        if (!node.attribs || !node.attribs.capiid) { return node; }

        var id = node.attribs.capiid,
            className = node.attribs.class,

            domain = locals.query && locals.query.domain ||
                      locals.product && locals.product.domain,

            related = locals.data && locals.data.related || {},
            asset = pickRelated(related, { id: id }) || {},

            domainLinks,
            link;

        // expose embedType for related assets

        asset.embedType = className;

        // capi-link for now but could provide scope for
        // different augmentations in the future and may warrant
        // a future refactor

        if (className !== 'capi-link') { return node; }

        node.attribs['data-id'] = id; // convert id to a nicer attribute

        domainLinks = asset.domainLinks || [];

        // get the correct link for the currently requested
        // site

        link = domainLinks.filter(function(link) {
            return link.name === domain;
        })[0];

        link = link && link.link || asset.link;

        if (link) {
            node.attribs.href = link;
        }

        delete node.attribs.capiid; // do not permit futher processing upon return

        return node;
    };
};
