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
  const result = await executeSql('insert into tag (title, color, user_idx) values (?, ?, ?)', [title, color, userIdx]);
  res.status(200).send({ idx: result.insertId });
});

router.delete('/:tag_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const tagIdx = req.params.tag_idx;

  try {
    await executeSql('delete from tag where user_idx = ? and idx = ?', [userIdx.toString(), tagIdx]);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(403);
  }
});

export default router;
