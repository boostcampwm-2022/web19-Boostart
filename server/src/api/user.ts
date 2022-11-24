import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const userId = `%${req.query.user_id}%`;
  try {
    const users = await executeSql('select idx, user_id, username, profile_img from user where user_id LIKE ? and idx != ?', [userId, userIdx.toString()]);
    res.json(users);
  } catch {
    res.sendStatus(500);
  }
});

router.get('/me', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  try {
    const [userInfo] = (await executeSql('select user_id, username, profile_img from user where idx = ?', [userIdx.toString()])) as RowDataPacket[];
    res.json(userInfo);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
