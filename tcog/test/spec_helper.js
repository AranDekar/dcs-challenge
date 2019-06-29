'use strict';

const tcog = require('../service'),
    conf = require('./../conf'),
    _ = require('lodash'),
    request = require('request'),
    port = 3002,
    tcogHost = `http://127.0.0.1:${port}`;

let serverRunning = false;

module.exports = {
    tcog: {
        start: (done) => {
            if (serverRunning) {
                return done();
            }

            serverRunning = true;
            tcog.listen(port, function() {
                console.log(`Express (tcog) running on ${port}`);
                return done();
            });
        },
        request: (route, cb) => {
            const reqOptions = typeof route !== 'object' ? { url: route } : route;
            reqOptions.url = `${tcogHost}${reqOptions.url}`;
            request(reqOptions, cb);
        }
    }
};
