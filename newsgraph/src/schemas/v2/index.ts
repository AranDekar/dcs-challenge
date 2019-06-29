import { addResolveFunctionsToSchema } from 'graphql-tools';
import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs } from './types';
import { resolvers } from './resolvers';
import { root } from './root';

const schema = makeExecutableSchema({ typeDefs });
addResolveFunctionsToSchema(schema, resolvers);

export { schema, root };
