import { Router } from 'express';
import { OkPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const tags = await executeSql('select idx, title, color from tag where user_idx = ?', [userIdx.toString()]);
  res.json(tags);
});

router.post('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { title, color } = req.body;
  try {
    const result = (await executeSql('insert into tag (title, color, user_idx) values (?, ?, ?)', [title, color, userIdx])) as OkPacket;
    res.status(200).send({ idx: result.insertId });
  } catch {
    res.sendStatus(409);
  }
});

export default router;
