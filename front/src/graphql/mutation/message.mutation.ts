import { graphql } from '../__generated__';

export const ADD_MESSAGE_MUTATION = graphql(/* GraphQL */ `
  mutation AddMessage($message: String) {
    addMessage(message: $message) {
      id
      message
      user {
        username
      }
      user_id
    }
  }
`);
