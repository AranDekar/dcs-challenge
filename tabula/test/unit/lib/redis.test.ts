import { expect } from 'chai';
import { exec } from 'child_process';
import * as Redis from '../../../src/lib/redis';

const client = Redis.create();
const host = process.env.REDIS_HOST || 'localhost';

describe.skip('Redis', () => {
    describe('#set', () => {
        it('should compress data (requires telnet installed)', (done) => {
            client.set('hello', 'world', (error, result) => {
                exec(`{ echo "GET hello"; sleep 0.1; } | telnet ${ host } 6379`, (error, stdout, stderr) => {
                    expect(stdout).to.include('yvPL8pJAQBDEXc6BQAAAA==');

                    done();
                });
            });
        });
    });

    describe('#get', () => {
        it('should uncompress data', (done) => {
            client.get('hello', (error, result) => {
                expect(result).to.eq('world');

                done();
            });
        });
    });
});

