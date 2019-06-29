import { redis } from '../../../../lib/redis';

export default (prefix: string, parentId: string, ids: string[], ttl: number) => {
    const multi = redis.multi();

    for (const id of ids) {
        const memberKey = `${ prefix }-${ parentId }-${ id }`;
        const value = '';

        multi.set(memberKey, value, 'ex', ttl);
    }

    return multi;
};
