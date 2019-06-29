'use strict';

import { readFileSync, writeFileSync } from 'fs';
import { eachLimit } from 'async';
import * as request from 'request';
import * as IORedis from 'ioredis';

const urls: String[] = [];
const report: any = {};

// 1. Extract data from article-urls.txt
let data = readFileSync('./test/data/article-urls.txt');
let lines = data.toString().split('\n');

// lines in articles-url.txt require a t_product be appended.
lines.forEach((line, cb) => {
    line = `${ line }?t_product=tcog`;
    urls.push(line);
});

// 2. Extract data from prod-urls.txt
data = readFileSync('./test/data/prod-urls.txt');
lines = data.toString().split('\n');

// lines in prod-url.txt need no extra formatting
lines.forEach((line, cb) => {
    urls.push(line);
});

// // 3. Extract data from urls.txt
// data = readFileSync('./test/data/urls.txt');
// lines = data.toString().split('\n');

// // lines in urls.txt need to cut off the trailing classifier which follows a tab
// lines.forEach((line, cb) => {
//     const linePieces = line.split(/\t/);
//     urls.push(linePieces[0]);
// });

function appendToReport(report: any, statusCode: string, url: string) {
    if (!report[statusCode]) {
        report[statusCode] = [];
    }

    report[statusCode].push(url);
}

let call = (url: string, cb: Function) => {
    const options = {
        method: 'GET'
    };

    url = `http://localhost:3000${ url }`;

    request(url, options, (err: Error, res: any, body: any) => {
        if (err) {
            console.log('Err: ', err.toString());
            return cb(err);
        }

        console.log('url: ', url, ' -> ', res.statusCode);
        appendToReport(report, res.statusCode, url);
        setTimeout(cb, 1000);
    });
};

eachLimit(urls, 1, call, (err: Error) => {
    if (err) {
        console.log('err');
    } else {
        console.log('Updating keys in redis to never expire ...');

        // now set every key value to persist in Redis
        const redis = new IORedis('localhost');
        redis.keys('*', (err: Error, keys: any) => {
            eachLimit(keys, 5, (key, cb) => {
                redis.persist(key, cb);
                console.log('Persisting key: ', key);
            }, (err) => {
                if (err) {
                    console.log(`Error persisting key ${ err.toString() } `);
                }
            });
        });

        console.log('Writing report ... \n');
        writeFileSync('./integration-test-manifest.json', JSON.stringify(report));
        console.log('done');
    }
});
