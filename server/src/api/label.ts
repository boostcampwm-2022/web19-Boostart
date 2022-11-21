import { Router } from 'express';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const labels = await executeSql('select * from label where user_idx = ?', [userIdx.toString()]);
  res.json(labels);
});

export default router;
