import { Router } from 'express';
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
  await executeSql('insert into tag (title, color, user_idx) values (?, ?, ?)', [title, color, userIdx]);
  const newIdx = await executeSql('select last_insert_id()');
  res.status(200).send({ idx: newIdx[0]['last_insert_id()'] });
});

export default router;
