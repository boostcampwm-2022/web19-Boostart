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
      'select idx, title, goal.label_idx as labelIdx, goal.amount as goalAmount, ifnull(sum(task_label.amount), 0) as currentAmount, over from goal left join (select label_idx, amount from task_label inner join task on task_label.task_idx = task.idx where user_idx = ? and date = ?) task_label on goal.label_idx = task_label.label_idx where user_idx = ? and date = ? group by idx',
      [userIdx, date, userIdx, date]
    )) as RowDataPacket;
    res.json(goals);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
