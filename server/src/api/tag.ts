import { Router } from 'express';
import { OkPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const tags = await executeSql('select tag.idx as idx, tag.title as title, tag.color as color, count(task.idx) as count from tag left join task on task.tag_idx = tag.idx where tag.user_idx = ? group by tag.idx', [userIdx.toString()]);
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
