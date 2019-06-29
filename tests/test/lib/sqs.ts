import * as supertest from 'supertest';

const host = 'fake-sqs:9494';

function createQueue(name: string, awsAccessKeyId: string, cb: supertest.CallbackHandler): void {
    supertest(`http://${ host }`)
        .post('/')
        .send('Action=CreateQueue')
        .send(`QueueName=${ name }`)
        .send(`AWSAccessKeyId=${ awsAccessKeyId }`)
        .expect(200)
        .end(cb);
}

function createMessage(name: string, messageBody: string, awsAccessKeyId: string, cb: supertest.CallbackHandler) {
    supertest(`http://${ host }`)
        .post('/')
        .send('Action=SendMessage')
        .send(`QueueUrl=${ getUrl(name) }`)
        .send(`MessageBody=${ messageBody }`)
        .send(`AWSAccessKeyId=${ awsAccessKeyId }`)
        .expect(200)
        .end(cb);
}

function getUrl(name: string): string {
    return `http://${ host }/${ name }`;
}

export { createQueue, createMessage, getUrl };

