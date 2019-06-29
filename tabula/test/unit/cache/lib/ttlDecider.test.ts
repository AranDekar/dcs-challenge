import { ttlDecider } from '../../../../src/cache/lib/ttlDecider';
import { expect } from 'chai';

describe('#TTLDecider', () => {
    it('set ttl to 300 when status is 404', (done) => {
        const ttl = ttlDecider('RESOURCE', 404);
        expect(ttl).to.equals(300);
        done();
    });

    it('set ttl to 600 when status is 400', (done) => {
        const ttl = ttlDecider('RESOURCE', 400);
        expect(ttl).to.equals(600);
        done();
    });

    it('set ttl to 600 when status is 410', (done) => {
        const ttl = ttlDecider('RESOURCE', 410);
        expect(ttl).to.equals(600);
        done();
    });

    it('set ttl to 600 when status is 500', (done) => {
        const ttl = ttlDecider('ERROR', 500);
        expect(ttl).to.equals(600);
        done();
    });

    it('set ttl to 900 otherwise', (done) => {
        const ttl = ttlDecider('RESOURCE', 200);
        expect(ttl).to.equals(900 * 16);
        done();
    });

    it('set ttl to 300 if SEARCH', (done) => {
        const ttl = ttlDecider('SEARCH', 200);
        expect(ttl).to.equals(300);
        done();
    });

    it('set ttl to 30 if V3_SEARCH', (done) => {
        const ttl = ttlDecider('V3_SEARCH', 200);
        expect(ttl).to.equals(30);
        done();
    });

    it('set ttl to 300 if V2_COLLECTION', (done) => {
        const ttl = ttlDecider('V2_COLLECTION', 200);
        expect(ttl).to.equals(300);
        done();
    });
});
