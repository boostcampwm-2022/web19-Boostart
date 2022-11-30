import { Router } from 'express';
import { OkPacket, RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

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
  try {
    const existLabel = ((await executeSql('select idx from label where user_idx = ? and title = ?', [userIdx, title])) as RowDataPacket).length > 0;
    if (existLabel) return res.status(409).json({ msg: '이미 존재하는 라벨이에요.' });

    const { insertId } = (await executeSql('insert into label (title, color, unit, user_idx) values (?, ?, ?, ?)', [title, color, unit, userIdx])) as OkPacket;
    res.status(201).send({ idx: insertId });
  } catch {
    res.sendStatus(500);
  }
});

export default router;
