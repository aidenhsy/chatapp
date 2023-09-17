import {
  ApolloClient,
  ApolloLink,
  createHttpLink,
  concat,
  InMemoryCache,
  split,
} from '@apollo/client';
import { getCookie } from 'cookies-next';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient as createWsClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { Kind, OperationTypeNode } from 'graphql';

const authLink = new ApolloLink((operation, forward) => {
  const accessToken = getCookie('token');
  const headersFromContext = operation.getContext().headers || {}; // Get headers from the context
  if (accessToken) {
    operation.setContext({
      headers: {
        ...headersFromContext,
        Authorization: accessToken,
      },
    });
  } else {
    operation.setContext({
      headers: {
        ...headersFromContext,
      },
    });
  }
  return forward(operation);
});

const httpLink = concat(
  authLink,
  createHttpLink({
    uri: `http://localhost:6001/graphql`,
  })
);

const wsLink = new GraphQLWsLink(
  createWsClient({
    url: `ws://localhost:6001/graphql`,
  })
);

export const apolloClient = new ApolloClient({
  link: split(isSubscription, wsLink, httpLink),
  cache: new InMemoryCache(),
});

function isSubscription(operation: any) {
  const definition = getMainDefinition(operation.query);
  return (
    definition.kind === Kind.OPERATION_DEFINITION &&
    definition.operation === OperationTypeNode.SUBSCRIPTION
  );
}
