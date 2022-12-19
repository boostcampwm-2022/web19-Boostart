import jwt from 'jsonwebtoken';
import { TOKEN_SECRET } from '../constants';
import { AuthorizedRequest } from '../types/index';
import { Response, NextFunction } from 'express';

export const generateAccessToken = (data: object) => {
  return jwt.sign(data, TOKEN_SECRET, { expiresIn: '1800s' });
};

export const authenticateToken = (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) return res.sendStatus(401);

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    if (!user.userIdx) return res.sendStatus(401);

    req.user = user;
    next();
  });
};
