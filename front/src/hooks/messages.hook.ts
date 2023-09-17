import { ADD_MESSAGE_MUTATION } from '@/graphql/mutation/message.mutation';
import { MESSAGES_QUERY } from '@/graphql/query/message.query';
import { MESSAGE_ADDED_SUBSCRIPTION } from '@/graphql/subscription/message.subscription';
import { useMutation, useQuery, useSubscription } from '@apollo/client';

export const useMessages = () => {
  const { data, loading, error, refetch } = useQuery(MESSAGES_QUERY, {
    notifyOnNetworkStatusChange: true,
  });
  useSubscription(MESSAGE_ADDED_SUBSCRIPTION, {
    onData: ({ client, data }) => {
      const newMessage = data.data?.message;
      client.cache.updateQuery({ query: MESSAGES_QUERY }, (oldData) => {
        if (oldData?.messages && newMessage)
          return { messages: [...oldData?.messages, newMessage] };
      });
    },
  });
  return {
    messagesData: data?.messages,
    messagesLoading: loading,
    messagesError: error,
    messagesRefetch: refetch,
  };
};

export const useAddMessage = () => {
  const [mutate, { loading, error, data }] = useMutation(ADD_MESSAGE_MUTATION);
  const addMessage = async (message: string) => {
    const { data } = await mutate({
      variables: {
        message,
      },
      // update: (cache, { data }) => {
      //   console.log('data', data);
      //   const newMessage = data?.addMessage;
      //   cache.updateQuery({ query: MESSAGES_QUERY }, (oldData) => {
      //     if (oldData?.messages && newMessage)
      //       return { messages: [...oldData?.messages, newMessage] };
      //   });
      // },
    });
    return data;
  };

  if (error) {
    console.log(error);
  }

  return {
    addMessage,
    addMessageLoading: loading,
    addMessageData: data,
    addMessageError: Boolean(error),
  };
};
