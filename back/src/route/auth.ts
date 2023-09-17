import { Router, json } from 'express';
import prisma from '../config/prisma.config';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const existUser = await prisma.users.findFirst({
    where: {
      username,
      password,
    },
  });

  if (existUser) {
    const token = jwt.sign({ id: existUser.id }, 'asdf');
    res.status(200).send(token);
  } else {
    res.status(401).send('not authorized');
  }
});

export { router as authRouter };
