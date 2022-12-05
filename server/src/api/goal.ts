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

router.put('/:goal_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const goalIdx = req.params.goal_idx;

  try {
    Object.values(GoalBodyKeys).forEach((key) => validate(key, req.body[key]));
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  const { title, labelIdx, amount, over } = req.body;

  try {
    const existGoal = ((await executeSql('select idx from goal where user_idx = ? and idx = ?', [userIdx, goalIdx])) as RowDataPacket).length > 0;
    if (!existGoal) return res.status(404).json({ msg: '존재하지 않는 목표예요.' });

    const existLabel = ((await executeSql('select idx from label where user_idx = ? and idx = ?', [userIdx, labelIdx])) as RowDataPacket).length > 0;
    if (!existLabel) return res.status(404).json({ msg: '존재하지 않는 라벨이에요.' });

    await executeSql('update goal set title = ?, label_idx = ?, amount = ?, over = ? where idx = ?;', [title, labelIdx, amount, over, goalIdx]);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
