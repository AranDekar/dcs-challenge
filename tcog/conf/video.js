const fs = require('fs');
const path = require('path');
const logger = require('../lib/logger');

function readVideoCategories(next) {
    fs.readFile(path.join(__dirname, 'video', 'merged.tsv'), 'utf8', function(err, data) {
        if (err) return next(err);
        const table = [],
            rows = data.toString().replace(/\r/g, '').split('\n'),
            headers = rows[0].split('\t'),
            arrayFields = [];
        rows.slice(1).forEach(function(row) {
            const columns = row.split('\t'),
                data = {};
            headers.forEach(function(header, index) {
                const existingValue = data[header], newValue = columns[index].trim();
                if (newValue) {
                    if (header === 'whitelist') {
                        if (typeof existingValue === 'undefined') {
                            data[header] = [];
                        }
                        if (newValue === 'metros') {
                            data[header].push('dailytelegraph', 'heraldsun', 'adelaidenow', 'couriermail', 'perthnow');
                        } else if (newValue === 'regionals') {
                            data[header].push('goldcoastbulletin', 'geelongadvertiser', 'mercury', 'cairnspost', 'townsvillebulletin', 'ntnews');
                            // the WeeklyTimesNow regional is not above as it is an exceptional case
                            // and instead it is handled by the normal push below
                        } else {
                            data[header].push(newValue.toLowerCase());
                        }
                    } else {
                        if (typeof existingValue === 'undefined') {
                            data[header] = newValue;
                        } else if (Array.isArray(existingValue)) {
                            data[header].push(newValue);
                        } else {
                            data[header] = [existingValue, newValue];
                            arrayFields.push(header);
                        }
                    }
                }
            });
            table.push(data);
        });

        // ensure array fields are consistently array fields
        arrayFields.forEach(function(arrayField) {
            table.forEach(function(row) {
                if (Array.isArray(row[arrayField]) === false) {
                    row[arrayField] = [row[arrayField]];
                }
            });
        });

        // add pid, add fullTitle, add cssClass
        table.forEach(function(row) {
            if (row.child_name) {
                const prow = table.find(function(prow) {
                    return !prow.child_name && prow.parent_name === row.parent_name;
                });
                row.pid = prow.id;
                row.fullTitle = row.parent_name + '/' + row.child_name;
                row.title = row.child_name;
            } else {
                row.fullTitle = row.parent_name;
                row.title = row.parent_name;
            }
            row.cssClass = row.parent_name.toLowerCase().replace(/\s/g, '-').replace(/&/g, '%26').replace(/\W/g, '-');
            row.linkPath = row.fullTitle.replace(/\s/g, '-').replace(/&/g, '%26');
        });

        // add cids
        table.forEach(function(row) {
            if (!row.child_name) {
                row.cids = table.filter(function(crow) {
                    return crow.pid === row.id;
                }).map(function(crow) {
                    return crow.id;
                });
            }
        });

        // sort
        const sortedTable = table.sort(function(aRow, bRow) {
            const a = aRow.position.split('.'), b = bRow.position.split('.');
            const result = parseInt(a[0], 10) - parseInt(b[0], 10);
            if (result === 0) {
                return parseInt(a[1], 10) - parseInt(b[1], 10);
            } else {
                return result;
            }
        });

        // complete
        return next(null, sortedTable);
    });
}

readVideoCategories(function(err, table) {
    if (err) throw err;
    const pretty = require('util').inspect(table, false, 5, true), json = JSON.stringify(table, null, '  ');
    logger.debug(pretty);
    fs.writeFile(path.join(__dirname, 'video', 'merged.json'), json, logger.debug);
});
