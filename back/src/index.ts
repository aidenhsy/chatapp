import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import { currentUser } from './middleware/currentUser';
import apolloServerConfig, { schema } from './config/apollo-server.config';
import { authRouter } from './route/auth';
import { useServer as useWsServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { createServer as createHttpServer } from 'node:http';

dotenv.config();

const app = express();

const apolloServer = new ApolloServer(apolloServerConfig);

app.use(cors(), express.json());

app.use(authRouter);

app.get('/', async (_req, res) => {
  res.send('hello this is working');
});

const start = async () => {
  await apolloServer.start();

  app.use(
    '/graphql',
    currentUser,
    apolloMiddleware(apolloServer, {
      context: async ({ req }) => {
        return { user: req.currentUser };
      },
    })
  );

  const httpServer = createHttpServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  useWsServer({ schema }, wsServer);

  httpServer.listen(6001, () => {
    console.log('listening on 6001');
  });
};

start();
