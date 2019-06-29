import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as graphqlHTTP from 'express-graphql';
import * as cors from 'cors';
import * as debug from 'debug';

import { schema as v2, root as v2Root } from './schemas/v2';
import { schema as v3ToV2, root as v3ToV2Root } from './schemas/v3tov2';
import { schema as v3, root as v3Root } from './schemas/v3';
import { router as facade } from './facade/router';
import { middleware as healthcheck } from './lib/healthcheck';

function formatError(error: Error) {
  debug('newsgraph')(error);

  return { message: error.message, stack: error.stack };
}

function initialize(overrideRoot?: any) {
  const app = express();

  app.use(cors());
  app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));
  app.use(bodyParser.json({limit: '1mb'}));

  app.use('/healthcheck', healthcheck);

  app.use('/graphql/v2', graphqlHTTP((req) => ({
    schema: v2,
    rootValue: overrideRoot || v2Root,
    graphiql: true,
    formatError: formatError
  })));

  app.use('/graphql/v3', graphqlHTTP((req) => ({
    schema: v3,
    rootValue: overrideRoot || v3Root,
    graphiql: true,
    formatError: formatError
  })));

  app.use('/graphql/v3tov2', graphqlHTTP((req) => ({
    schema: v3ToV2,
    rootValue: overrideRoot || v3ToV2Root,
    graphiql: true,
    formatError: formatError
  })));

  app.use('/facade', facade);

  app.get('/', (req, res) => { res.send('Newsgraph'); });

  return app;
}

export { initialize };
