import * as crypto from 'crypto';

export namespace Checksum {
    export const make = (orig: string): string => {
        return crypto.createHash('md5').update(orig, 'utf8').digest('hex');
    };
}
