/**
 * Instrumentation.
 */
import * as newrelic from "newrelic";

/**
 * Module dependencies.
 */
import { Message } from 'aws-sdk/clients/sqs';
import getLogger from 'dcs-logger';
import transformV2 from './transform/v2';
import transformV3 from './transform/v3';

const logger = getLogger();

const map = function(input: any): CAPIEventsAdapter.ExternalEvent {
  switch (input.capiVersion) {
    case 'v3': 
      return transformV3(input);
    default: 
      return transformV2(input);
  }
}

export default function(message: Message): string {
  const input = JSON.parse(message.Body);

  logger.debug('input: ', input);

  const output = map(input);

  logger.debug('output: ', output);

  console.log('[CapiEventsAdapter] publish: ', output.sourceId)
  
  newrelic.addCustomAttributes({id: output.sourceId});

  return JSON.stringify(output);
}
