import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { date } = req.query;
  if (!date) return res.status(400).send({ msg: '날짜를 지정해주세요.' });
  try {
    const goals = (await executeSql(
      'select goal.idx, goal.title, goal.label_idx as labelIdx, goal.amount as goalAmount, sum(task_label.amount) as currentAmount, goal.over from goal inner join task_label on goal.label_idx = task_label.label_idx inner join task on task_label.task_idx = task.idx where goal.user_idx = ? and task.date = ? group by goal.idx',
      [userIdx, date]
    )) as RowDataPacket;
    res.json(goals);
  } catch {
    res.sendStatus(500);
  }
});

export default router;