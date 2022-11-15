import jwt from 'jsonwebtoken';
import { tokenSecret } from '../constants';
import { AuthorizedRequest } from '../types/index';
import { Response, NextFunction } from 'express';

export const generateAccessToken = (data: object) => {
  return jwt.sign(data, tokenSecret, { expiresIn: '1800s' });
};

export const authenticateToken = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) return res.sendStatus(401);

  jwt.verify(token, tokenSecret, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
};
