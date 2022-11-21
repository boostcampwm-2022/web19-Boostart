import { Router } from 'express';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const rows = await executeSql('select * from task where user_idx = ?', [userIdx.toString()]);
  res.json(rows);
});

router.post('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { title, importance, startedAt, endedAt, lat, lng, isPublic, tagIdx, content, done, date, labels } = req.body;
  const result = await executeSql('insert into task (title, importance, date, started_at, ended_at, lat, lng, content, done, public, tag_idx, user_idx) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    title,
    importance,
    date,
    startedAt,
    endedAt,
    lat,
    lng,
    content,
    done,
    isPublic,
    tagIdx,
    userIdx,
  ]);

  const taskIdx = result.insertId;
  await Promise.all(
    labels.map(({ labelIdx, amount }) => {
      executeSql('insert into task_label (task_idx, label_idx, amount) value (?, ?, ?)', [taskIdx, labelIdx, amount]);
    })
  );
  res.sendStatus(200);
});

export default router;
