import { makeExecutableSchema } from 'graphql-tools';
import { root } from './root';
import { typeDefs } from './types';
import { resolvers } from './resolvers';

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema, root };
