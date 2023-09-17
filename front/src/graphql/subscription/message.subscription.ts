import { graphql } from '../__generated__';

export const MESSAGE_ADDED_SUBSCRIPTION = graphql(/* GraphQL */ `
  subscription MessageAddedSubscription {
    message: messageAdded {
      id
      user {
        username
      }
      message
    }
  }
`);
