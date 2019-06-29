import { expect } from 'chai';
import * as v2json from '../fixtures/capi/v2/active.json';
import * as v3json from '../fixtures/capi/v3/active.json';
import transform from '../../src/adapter/transform';
import { Message } from 'aws-sdk/clients/sqs';

describe('#transform', () => {
    for (const test of [["v2", v2json], ["v3", v3json]]) {
        const version = test[0],
            json = test[1];

        describe(`${version}`, () => {
                it('converts status', () => {
                    const input: Message = { Body: JSON.stringify(json) };
                    const output = transform(input);
            
                    expect(JSON.parse(output).kind).to.equal('UPDATE');
                });
        });
    }
});
