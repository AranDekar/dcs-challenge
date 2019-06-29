module.exports = function(logger) {
    // transformations to deal with deprecations and renaming
    function prefixParameters(url, query, prefix, pattern, remove) {
        var matcher = new RegExp(pattern);
        Object.keys(query).forEach(function(key) {
            if (matcher.test(key)) {
                if (remove) {
                    query[prefix + key.replace(remove, '')] = query[key];
                } else {
                    query[prefix + key] = query[key];
                }

                delete query[key];

                logger.debug({
                    event: 'deprecatedParam',
                    url: url,
                    param: key,
                    note: 'Key should be prefixed with ' + prefix
                });
            }
        });
    }

    function renameParameter(url, query, legacyParameter, newName) {
        if (query[legacyParameter]) {
            query[newName] = query[legacyParameter];
            delete query[legacyParameter];

            logger.debug({
                event: 'deprecatedParam',
                url: url,
                param: legacyParameter,
                note: 'Renamed key to ' + newName
            });
        }
    }

    return function(req, res, next) {
    // 0 rename display vars (notice it is not a prefix ending with ':')
        prefixParameters(req.url, req.query, 't_', '^product$');

        // 1 rename display vars
        prefixParameters(req.url, req.query, 'td_', '^display:.*$', 'display:');

        // 2 rename layout
        if (req.params.format) {
            req.query['t_layout'] = req.params.format;
            delete req.params.format;

            logger.debug({
                event: 'deprecatedParam',
                url: req.url,
                param: 'format',
                note: 'format parameter renamed to t_layout'
            });
        }

        // 4 rename `subkey` parameter to `t_subkey` (for metadata)
        prefixParameters(req.url, req.query, 'tc_', '^key$');

        // 5 rename `subkey` parameter to `t_subkey` (for metadata)
        prefixParameters(req.url, req.query, 'tc_', '^subkey$');

        // 6 rename `t_dateHeader` parameter to `t_subkey` (for metadata)
        renameParameter(req.url, req.query, 't_dateHeader', 'td_date_header');

        // the legacy 'template' var was never used. Reinstate later if an API needs it.
        if (req.params.template) {
            delete req.params.template;

            logger.debug({
                event: 'deprecatedParam',
                url: req.url,
                param: 'template',
                note: 'The legacy template param was never used.'
            });
        }

        // 7. retire the venerable tcog prefix (just in case)
        // rename `tcog` parameter to `t_` (for metadata)
        prefixParameters(req.url, req.query, 'td_', '^tcog:display', 'tcog:display:');

        renameParameter(req.url, req.query, 'td_dateHeader', 'td_date_header');
        renameParameter(req.url, req.query, 'td_module-header', 'td_module_header');
        renameParameter(req.url, req.query, 'td_module-classes', 'td_module_classes');

        // 9 rename `td_style` parameter to `t_template`
        // This is an edge case
        renameParameter(req.url, req.query, 'td_style', 't_template');

        // 10. template renaming
        if (req.query['t_template'] === 'popular') {
            req.query['t_template'] = 'popular-footer';

            logger.debug({
                event: 'deprecatedParam',
                url: req.url,
                param: 't_template',
                note: "t_template value 'popular' renamed to 'popular-footer'"
            });
        }

        // 11. rename arbitrary and remaining params prefixed with 'tcog:' to the t_ prefix
        prefixParameters(req.url, req.query, 't_', '^tcog:', 'tcog:');

        // 12. last, rename `esi` to `t_esi`
        prefixParameters(req.url, req.query, 't_', '^esi$');
        next();
    };
};
