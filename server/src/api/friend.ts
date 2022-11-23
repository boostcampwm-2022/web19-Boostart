import { Router } from 'express';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  try {
    const users = await executeSql('select idx, user_id, username, profile_img from user inner join friendship on idx = sender_idx or idx = receiver_idx where idx != ? and (receiver_idx = ? or sender_idx = ?) and accepted = true', [
      userIdx.toString(),
      userIdx.toString(),
      userIdx.toString(),
    ]);
    res.json(users);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
