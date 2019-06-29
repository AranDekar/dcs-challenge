import * as request from 'request';
import { eachLimit, eachSeries } from 'async';
import * as R from 'ramda';

// load the manifest json file dynamically
const manifestFile: string = <string>process.argv[2];
const manifest = require(manifestFile);

const data = <JsonMap>manifest;

let passedCount = 0, failedCount = 0;

// see https://github.com/Microsoft/TypeScript/issues/1897
type AnyJson =  boolean | number | string | null | JsonArray | JsonMap;
interface JsonMap {  [key: string]: AnyJson; }
interface JsonArray extends Array<AnyJson> {}

const exclusions: RegExp[] = [
    /\/news\/config\/conf/,
    /\/metadata/,
    /\/content-metadata/,
    /\/fatwire/
];

const inclusions: RegExp[] = [
    /t_product=consumer-commerce/
];

const statusCodeRunner = (code: string, cb: Function) => {
    console.log('Beginning run for ', code, '... \n\n\n');

    const urls: string[] = <string[]> data[code];

    const testUrl = (url: string, cb: Function) => {
        const matcher = (exclusion: RegExp): boolean => {
            return exclusion.test(url);
        };

        if (R.any(matcher)(exclusions)) {
            return cb();
        }

        if (!R.any(matcher)(inclusions)) {
            return cb();
        }

        request(url, { timeout: 1000 }, (err: Error, res: any, body: any) => {
            if (err) {
                console.log(`❌ Error on ${ url } - `, err.message, '\n\n');
                process.exit(2);
                return cb(err);
            }

            if (res.headers['x-cache'] != 'HIT') {
                console.log('Cache MISS on ', url, ' stopping. \n\n');
                cb('Cache MISS on ', url, ' stopping. \n\n');
                return process.exit(2);
            }

            if (code != res.statusCode) {
                console.log(`❌ ${ url }. \n${ code } != ${ res.statusCode }\n${ res.body }`);
                failedCount++;
                return cb(err);
            } else {
                console.log(`✅ ${ url }.`);
                passedCount++;
                return cb();
            }
        });
    };

    eachLimit(urls, 1, testUrl, (err) => {
        console.log(`Completed run for ${ code }`);

        if (err) {
            console.log(`Error on ${ code }: ${ err }`);
            return cb(err);
        } else {
            return cb();
        }
    });
};

const statusCodes = Object.keys(data);

eachSeries(statusCodes,  statusCodeRunner, (err: Error) => {
    console.log(`Result: ✅ ${ passedCount } ❌ ${ failedCount }`);

    if (err || failedCount > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
});

