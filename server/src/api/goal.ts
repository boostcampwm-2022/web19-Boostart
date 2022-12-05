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

router.delete('/:goal_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const goalIdx = req.params.goal_idx;

  try {
    const existGoal = ((await executeSql('select idx from goal where user_idx = ? and idx = ?', [userIdx, goalIdx])) as RowDataPacket).length > 0;
    if (!existGoal) return res.status(404).json({ msg: '존재하지 않는 목표예요.' });

    await executeSql('delete from goal where idx = ?', [goalIdx]);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
