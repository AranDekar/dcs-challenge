var keys = [
        'body',
        'cookies',
        'fresh',
        'host',
        'httpVersion',
        'ip',
        'ips',
        'originalMethod',
        'params',
        'path',
        'protocol',
        'query',
        'route',
        'secure',
        'signedCookies',
        'subdomains',
        'xhr'
    ],
    scrutinise = function(req, res, next) {
        var doc = 'Headers: \n\n';
        Object.keys(req.headers).sort().forEach(function(key) {
            doc += key + ': ' + req.header(key) + '\n';
        });

        doc += '\n\nRequest: \n\n';

        module.exports.keys.forEach(function(key) {
            doc += key + ': ' + JSON.stringify(req[key]) + '\n';
        });

        res.set('Content-Type', 'text/plain');
        res.status(200).send(doc);
    };

scrutinise.keys = keys;
module.exports = scrutinise;
