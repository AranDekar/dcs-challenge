var cheerio = require('cheerio');

module.exports = function(req, res, next) {
    var $,
        navTree = res.locals.data.navigation = [];

    if (!res.locals.data.fatwireData) return next();

    try {
        $ = cheerio.load(res.locals.data.fatwireData);
    } catch (e) {
        return next();
    }

    $('.tier-1').each(function(index, item) {
        processUL($, item, navTree);
    });

    next();
};

function processUL($, ul, tree) {
    $(ul).children('li').each(function(index, li) {
        var childMenu = $(li).children('ul'),
            childLink = $(li).children('a'),
            menuItem = {
                'text': String(childLink.text() || '').trim(),
                'link': String(childLink.attr('href') || '').trim()
            };

        if ($(li).attr('class') && $(li).attr('class').length) {
            menuItem.listClasses =
                $(li).attr('class').trim().replace(/\s+/, ' ');
        }

        if ($(childLink).attr('class') && $(childLink).attr('class').length) {
            menuItem.linkClasses =
                $(childLink).attr('class').trim().replace(/\s+/, ' ');
        }

        if (childMenu.length) {
            menuItem.children = [];
            processUL($, childMenu, menuItem.children);
        }

        tree.push(menuItem);
    });
}

module.exports.processUL = processUL;
