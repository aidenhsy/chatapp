import { useAddMessage, useMessages } from '@/hooks/messages.hook';
import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const { messagesData } = useMessages();
  const { addMessage } = useAddMessage();
  console.log(messagesData);

  const [text, setText] = useState('');

  const handleSend = async (message: string) => {
    const data = await addMessage(message);
    console.log('Message added', data?.addMessage);
    setText('');
  };

  return (
    <>
      <Head>
        <title>GraphQL Chat</title>
      </Head>
      <main className="flex flex-col space-y-5 bg-blue-200 h-[100vh] p-20">
        <div className="text-3xl font-bold">Chat as Alice</div>
        <div className="h-[50vh] bg-white rounded-lg p-5 space-y-3 overflow-y-auto">
          {messagesData &&
            messagesData.map((m) => (
              <div className="flex" key={m?.id}>
                <span className="w-14">{m?.user?.username}</span>
                <span>{m?.message}</span>
              </div>
            ))}
        </div>
        <div className="h-[10vh] bg-white rounded-lg p-5 flex justify-between">
          <input
            className="border w-[75%] h-full px-2 rounded-lg"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={async () => await handleSend(text)}
            className="w-[20%] bg-green-400 rounded-lg"
          >
            Send
          </button>
        </div>
      </main>
    </>
  );
}
