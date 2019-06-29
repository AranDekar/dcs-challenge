import { expect } from 'chai';
import serialize from '../../../../src/cache/lib/serialize';

const jsonApiResponse: Tabula.JsonApiResponse = {
    body: '{ "msg": "an object"}',
    url: 'http://random.json.api?b=2&a=1',
    headers: { 'content-type': 'application/json' },
    status: 200,
    jsonBody: { 'msg': 'an object' }
};

describe('JsonApiResponse serializer', () => {
    it('should return stringified JSON from JsonApiResponse', () => {
        const result = serialize(jsonApiResponse);
        expect(result).to.equal('{"body":"{ \\"msg\\": \\"an object\\"}","url":"http://random.json.api?b=2&a=1","headers":{"content-type":"application/json"},"status":200,"jsonBody":{"msg":"an object"}}');
    });
});
