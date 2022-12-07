import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

const CalendarQueryKeys = {
  year: 'year',
  month: 'month',
} as const;

type CalendarQueryKeys = typeof CalendarQueryKeys[keyof typeof CalendarQueryKeys];

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const validate = (key: string, value: string) => {
  switch (key) {
    case CalendarQueryKeys.year: {
      const year = parseInt(value);
      if (isNaN(year)) throw new ValidationError('올바른 연도를 입력해주세요.');
      return true;
    }
    case CalendarQueryKeys.month: {
      const month = parseInt(value);
      if (isNaN(month) || month < 1 || month > 12) throw new ValidationError('올바른 달을 입력해주세요.');
      return true;
    }
    default: {
      throw new ValidationError('잘못된 정보가 입력되었어요.');
    }
  }
};

router.get('/task', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;

  try {
    Object.values(CalendarQueryKeys).forEach((key) => validate(key, req.query[key] as string));
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  const year = parseInt(req.query.year as string);
  const month = parseInt(req.query.month as string);

  const dateSearchFormat = `${year}-${month}-%`;
  const lastDate = new Date(year, month, 0);
  const lastDay = lastDate.getDate();

  const result = Array.from({ length: lastDay }, () => false);
  try {
    const datesTaskExists = (await executeSql('select date_format(date, "%d") as date, count(idx) from task where user_idx = ? and date like ? group by date', [userIdx, dateSearchFormat])) as RowDataPacket;
    datesTaskExists.forEach(({ date }) => {
      result[parseInt(date) - 1] = true;
    });

    res.send(result);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
