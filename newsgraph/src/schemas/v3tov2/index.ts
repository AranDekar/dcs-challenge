import { makeExecutableSchema } from 'graphql-tools';
import { typeDefs } from './../v2/types';
import { resolvers } from './resolvers';
import { root } from '../v3/root';

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema, root };
