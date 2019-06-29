#!/usr/bin/env ts-node

/**
 *  Retrieve a list of currently persisted keys. You can optionally provide a pattern to match.
 *
 *  usage:
 *
 *      ts-node ./src/bin/redis/keys.ts
 *
 *      or
 *
 *      ts-node ./src/bin/redis/keys.ts default*
 */
import { redis } from './../../lib/redis';

const pattern = process.argv[2] || '*';

const keys = redis.keys(pattern, (err: Error, res: Array<String>) => {
    console.log(res);
    redis.disconnect();
});


