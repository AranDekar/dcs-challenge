import * as supertest from 'supertest';

function invoke(cb: supertest.CallbackHandler) {
    supertest('http://localhost:3003')
        .get(`/handle?redisHost=redis&redisChannel=content&sqsUrl=http://fake-sqs:9494/test-queue`)
        .expect(200)
        .end(cb);
}

export { invoke };
