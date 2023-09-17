import { ApolloServerOptions, BaseContext } from '@apollo/server';
import { readFileSync } from 'fs';
import { merge } from 'lodash';
import { chatResolvers } from '../graphql/resolver/chat.resolver';
import { makeExecutableSchema } from '@graphql-tools/schema';

const attendanceSchema = readFileSync(
  './src/graphql/schema/chat.schema.graphql',
  {
    encoding: 'utf-8',
  }
);

const typeDefs = [attendanceSchema];

const resolvers = merge(chatResolvers);

export const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServerConfig: ApolloServerOptions<BaseContext> = {
  typeDefs,
  resolvers,
};

export default apolloServerConfig;
