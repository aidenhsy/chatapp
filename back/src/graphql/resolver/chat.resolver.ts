import { GraphQLError } from 'graphql';
import prisma from '../../config/prisma.config';
import { Resolvers } from '../codegen/__generated__/graphql';
import uniqid from 'uniqid';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

export const chatResolvers: Resolvers = {
  Query: {
    messages: async (_root: any, _args: any, { user }: any) => {
      const messages = await prisma.messages.findMany();
      return messages;
    },
  },

  Mutation: {
    addMessage: async (_root: any, { message }, { user }) => {
      if (!user) {
        throw new GraphQLError('authorized', {
          extensions: { code: 'NOT AUTHORIZED' },
        });
      }

      const newMessage = await prisma.messages.create({
        data: {
          id: uniqid(),
          user_id: user.id,
          message,
        },
      });

      pubSub.publish('MESSAGE_ADDED', { messageAdded: newMessage });

      return {
        id: newMessage.id,
        message: newMessage.message,
        user_id: newMessage.user_id,
      };
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: () => {
        const iterator = pubSub.asyncIterator('MESSAGE_ADDED');
        return {
          [Symbol.asyncIterator]: () => iterator,
        } as AsyncIterable<any>;
      },
    },
  },

  Message: {
    user: async (message) => {
      const user = await prisma.users.findFirst({
        where: {
          id: message.user_id,
        },
      });
      return user;
    },
  },
};
