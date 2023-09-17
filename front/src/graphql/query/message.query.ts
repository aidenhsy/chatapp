import { graphql } from '../__generated__';

export const MESSAGES_QUERY = graphql(/* GraphQL */ `
  query Messages {
    messages {
      id
      message
      user {
        id
        username
      }
    }
  }
`);
