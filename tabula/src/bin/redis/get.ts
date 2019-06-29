#!/usr/bin/env ts-node

/**
 *  Retrieve the uncompressed value from a given key.
 *
 *  usage:
 *
 *      ts-node ./src/bin/redis/get.ts "default-http://dailytelegraph.com.au/spp-api//v1/template?domain=dailytelegraph.com.au&path=components.header.header&w_device=desktop&w_section=newslocal%2Fmosman-daily%27%2C"
 */
import { redis } from './../../lib/redis';

redis.get(process.argv[2], (err, res) => {
    console.log(res);
    redis.disconnect();
});
