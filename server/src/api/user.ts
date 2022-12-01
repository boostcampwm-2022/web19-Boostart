import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';
import { DEFAULT_PROFILE } from '../constants';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const userId = `%${req.query.user_id}%`;
  try {
    const users = await executeSql('select idx, user_id as userId, username, profile_img as profileImg from user where user_id LIKE ? and idx != ?', [userId, userIdx]);
    res.json(users);
  } catch {
    res.sendStatus(500);
  }
});

router.get('/me', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  try {
    const [userInfo] = (await executeSql('select user_id as userId, username, profile_img as profileImg from user where idx = ?', [userIdx])) as RowDataPacket[];
    res.json(userInfo);
  } catch {
    res.sendStatus(500);
  }
});

router.patch('/me', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  let { username, profileImg } = req.body;
  if (!username || profileImg === undefined) return res.status(400).json({ msg: '올바른 정보를 입력해주세요.' });
  if (!profileImg) profileImg = DEFAULT_PROFILE;
  try {
    await executeSql('update user set username = ?, profile_img = ? where idx = ?', [username, profileImg, userIdx]);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
