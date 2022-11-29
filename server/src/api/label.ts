import { Router } from 'express';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';
import { OkPacket } from 'mysql2';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  try {
    const labels = await executeSql('select label.idx, label.title, label.color, label.unit, count(task_label.label_idx) as count from label left join task_label on label.idx = task_label.label_idx where label.user_idx = ? group by label.idx', [
      userIdx,
    ]);
    res.json(labels);
  } catch {
    res.sendStatus(500);
  }
});

router.post('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { title, color, unit } = req.body;
  const result = (await executeSql('insert into label (title, color, unit, user_idx) values (?, ?, ?, ?)', [title, color, unit, userIdx])) as OkPacket;
  res.status(200).send({ idx: result.insertId });
});

export default router;
