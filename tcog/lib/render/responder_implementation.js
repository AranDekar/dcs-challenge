'use strict';

module.exports = function(pixelHost, JSON, encodeURI) {
    const self = {};

    /**
     * @ngdoc function
     * @name send
     *
     * @description
     * Low level request responder which can be used either directly with Express,
     * or independently.
     *
     * @param {object} req             Reference to HTTP request object
     * @param {object} res             Reference to HTTP response object
     * @param {string} body            The raw response body
     * @param {string} contentType     The type of content to be returned
     *
     * @return {null}
     *
     */

    function send(req, res, body, headers) {
        if (typeof body === 'object') body = JSON.stringify(body);

        let pixel = ~(headers['Content-Type']).indexOf('html');

        if (pixel) {
            pixel = `\n<img class="tcog-pixel" src="${pixelHost}/track` +
                    `${encodeURI(req.url)}" style="opacity:0; height:0px; ` +
                    'width:0px; position:absolute;" width="0" height="0" />\n';

            body = body + pixel;
        }

        res.setHeader('Content-Length', Buffer.byteLength(body, 'utf8'));

        Object.keys(headers).forEach(function(header) {
            res.setHeader(header, headers[header]);
        });

        if (req.method === 'HEAD') return res.end();

        res.end(body);
    }

    /**
     * @ngdoc function
     * @name respond
     *
     * @description
     * Simple content-negotiation responder which proxies send. Note this
     * method also ensure early termination of the response if it has already
     * been sent.
     *
     * @param {object} req          Reference to HTTP request object
     * @param {object} res          Reference to HTTP response object
     * @param {string} document     The document to send
     * @param {number} statusCode   The HTTP status code for the response
     *
     * @return {null}
     *
     */

    function contentType(req, res, document) {
        switch (true) {
            case (res.locals && res.locals.config && !!res.locals.config.contentType):
                return res.locals.config.contentType + '; charset=utf-8';
            case ((decodeURIComponent(req.url)).indexOf('t_contentType=text/plain') >= 0):
            // sometimes we may return a string template but still need to override
            // it's contentType. For example when using Akamai to assemble JSON documents
            // falls through
            case (req.url && req.url.indexOf('t_output=json') >= 0):
            // usually t_output=json is used to return a JSON payload, for the
            // source data however a template may also return an object in the
            // event this occurs, set the correct content-type
            // falls through
            case (typeof document === 'object'):
                return 'text/plain; charset=utf-8';
            default:
                return 'text/html; charset=utf-8';
        }
    }

    function respond(req, res, document, statusCode) {
        if (res.finished) return;
        if (statusCode) res.statusCode = statusCode;

        const headers = res.locals.headers || {};
        headers['Content-Type'] = contentType(req, res, document);

        self.send(req, res, document, headers);
    }

    self.send = send;
    self.respond = respond;

    return self;
};
