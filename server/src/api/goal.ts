import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

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

export default router;
