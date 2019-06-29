/**
 *
 * Sumo Logic search exported as csv.
 *
 * _sourceCategory=TCOG-WAF-prod*
 * AND _source = *nginx*
 * | parse regex "(?<method>[A-Z]+)\s(?<url>\S+)\sHTTP/[\d\.]+\"\s(?<status_code>\d+)\s(?<size>[\d-]+)\s\"(?<referrer>.*?)\"\s\"(?<user_agent>.+?)\".*"
 * | parse regex field=url "(?<path>\A[^?]+)"
 * | count(path), first(url) as url group by path
 * | top 1000 url by _count
 *
 */

const request = require('supertest'),
    resolve = require('path').resolve,
    fs = require('fs'),
    parse = require('csv-parse/lib/sync'),
    filename = 'data.csv',
    host = 'localhost:3000',
    timeout = 100;

const path = resolve(__dirname + '/' + filename),
    data = fs.readFileSync(path),
    records = parse(data, { delimiter: ',' });

function product(url) {
    switch (url) {
        case /dailytelegraph/i.test(url): return 'DailyTelegraph';
        case /couriermail/i.test(url): return 'CourierMail';
        case /heraldsun/i.test(url): return 'HeraldSun';
        case /adelaidenow/i.test(url): return 'AdelaideNow';
        case /goldcoastbulletin/i.test(url): return 'GoldCoastBulletin';
        case /nca/i.test(url): return 'newscomau';
        default: return 'tcog';
    }
}

describe('smoketest', () => {
    for (const record of records) {
        let url = record[0],
            count = record[1],
            headers = {};

        if (url === 'url') { continue; }
        if (!/t_product=[^\&]+/i.test(url)) { headers['x-tcog-product'] = product(url); }

        it(`${url} headers: ${JSON.stringify(headers)}`, (done) => {
            setTimeout(() => {
                request(host)
                    .get(url)
                    .set(headers)
                    .expect((res) => {
                        switch (res.statusCode) {
                            case 200: break;
                            case 404: break;
                            default: throw new Error(`res.statusCode: ${res.statusCode}`);
                        }
                    })
                    .end((err, res) => {
                        if (err) return done(err);

                        done();
                    });
            }, timeout);
        });
    }
});
