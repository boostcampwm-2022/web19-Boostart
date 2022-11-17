import { Router } from 'express';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const rows = await executeSql('select * from task where user_idx = ?', [userIdx]);
  res.json(rows);
});

router.post('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { title, importance, startedAt, endedAt, location, isPublic, tagIdx, labels } = req.body;
  const result = await executeSql('insert into task (title, importance, public, user_idx) values (?, ?, ?, ?)', [title, importance, isPublic, userIdx]);
  res.send(200);
});

export default router;
