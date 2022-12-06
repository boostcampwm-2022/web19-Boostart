import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { API_VERSION } from '../constants';
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
      'select idx, title, goal.label_idx as labelIdx, goal.amount as goalAmount, cast(ifnull(sum(task_label.amount), 0) as unsigned) as currentAmount, over from goal left join (select label_idx, amount from task_label inner join task on task_label.task_idx = task.idx where user_idx = ? and date = ?) task_label on goal.label_idx = task_label.label_idx where user_idx = ? and date = ? group by idx',
      [userIdx, date, userIdx, date]
    )) as RowDataPacket;
    res.json(goals);
  } catch {
    res.sendStatus(500);
  }
});

router.get('/:user_id', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;
  const { date } = req.query;
  if (!date) return res.status(400).send({ msg: '날짜를 지정해주세요.' });

  try {
    const friend = (await executeSql('select idx from user where user_id = ?', [friendId])) as RowDataPacket;
    if (friend.length === 0) return res.status(404).send({ msg: '존재하지 않는 사용자예요.' });

    const { idx: friendIdx } = friend[0];
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/goal?date=${date}`);

    const isNotFriend = ((await executeSql('select * from friendship where (sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)', [userIdx, friendIdx, friendIdx, userIdx])) as RowDataPacket).length === 0;
    if (isNotFriend) return res.status(403).send({ msg: '친구가 아닌 사용자의 목표를 조회할 수 없어요.' });

    const goals = (await executeSql(
      'select idx, title, goal.label_idx as labelIdx, goal.amount as goalAmount, ifnull(sum(task_label.amount), 0) as currentAmount, over from goal left join (select label_idx, amount from task_label inner join task on task_label.task_idx = task.idx where user_idx = ? and date = ?) task_label on goal.label_idx = task_label.label_idx where user_idx = ? and date = ? group by idx',
      [friendIdx, date, friendIdx, date]
    )) as RowDataPacket;
    res.json(goals);
  } catch {
    res.sendStatus(500);
  }
});

const GoalBodyKeys = {
  title: 'title',
  date: 'date',
  labelIdx: 'labelIdx',
  amount: 'amount',
  over: 'over',
} as const;

type GoalBodyKeys = typeof GoalBodyKeys[keyof typeof GoalBodyKeys];

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const validate = (key: string, value: string | number | boolean) => {
  switch (key) {
    case GoalBodyKeys.title: {
      if (typeof value !== 'string') throw new ValidationError('올바른 제목을 입력해주세요.');
      return true;
    }
    case GoalBodyKeys.date: {
      if (typeof value !== 'string') throw new ValidationError('올바른 날짜를 입력해주세요.');
      const regex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
      if (!regex.test(value)) throw new ValidationError('올바른 날짜를 입력해주세요.');
      return true;
    }
    case GoalBodyKeys.labelIdx: {
      if (typeof value !== 'number') throw new ValidationError('올바른 라벨을 입력해주세요.');
      return true;
    }
    case GoalBodyKeys.amount: {
      if (typeof value !== 'number') throw new ValidationError('올바른 목표량을 입력해주세요.');
      return true;
    }
    case GoalBodyKeys.over: {
      if (typeof value !== 'boolean') throw new ValidationError('올바른 목표 타입을 입력해주세요.');
      return true;
    }
    default: {
      throw new ValidationError('잘못된 정보가 입력되었어요.');
    }
  }
};

router.post('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;

  try {
    Object.values(GoalBodyKeys).forEach((key) => validate(key, req.body[key]));
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  const { title, date, labelIdx, amount, over } = req.body;

  try {
    const existLabel = ((await executeSql('select idx from label where user_idx = ? and idx = ?', [userIdx, labelIdx])) as RowDataPacket).length > 0;
    if (!existLabel) return res.status(404).json({ msg: '존재하지 않는 라벨이에요.' });

    await executeSql('insert into goal (user_idx, title, date, label_idx, amount, over) values (?, ?, ?, ?, ?, ?)', [userIdx, title, date, labelIdx, amount, over]);
    res.sendStatus(201);
  } catch (error) {
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
