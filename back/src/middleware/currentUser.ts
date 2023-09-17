import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  iat: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return next();
  }

  try {
    const token = req.headers.authorization.split(' ')[1];
    const payload = jwt.verify(token, 'asdf') as any as UserPayload;
    req.currentUser = payload;
  } catch (error) {}

  next();
};
