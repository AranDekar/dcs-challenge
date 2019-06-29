'use strict';

import { expect } from 'chai';
import * as request from 'request';
import { readFile, readFileSync } from 'fs';

const urlFile = './test/data/urls';
const URL_POSTFIX = '?t_product=DailyTelegraph&domain=dailytelegraph.com.au';

// describe('legacy article URLS', () => {
//     const data = readFileSync(urlFile);
//     const lines = data.toString().split(/\n/);
//     lines.forEach((line) => {
//         const url = `${ process.env.TCOG_URL }${ line }${ URL_POSTFIX }`;
//         it(`${ url }`, (done) => {
//             request(url, (err, response, body) => {
//                 expect(err).to.be.null;
//                 expect(response.statusCode).to.equal(200);
//                 done();
//             });
//         });
//     });
// });
