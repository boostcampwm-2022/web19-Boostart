import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { API_VERSION } from '../constants';
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
      const regex = /^\d{4}$/;
      if (!regex.test(value)) throw new ValidationError('올바른 연도를 입력해주세요.');
      const year = parseInt(value);
      if (isNaN(year)) throw new ValidationError('올바른 연도를 입력해주세요.');
      return true;
    }
    case CalendarQueryKeys.month: {
      const regex = /^([1-9]|1[012])$/;
      if (!regex.test(value)) throw new ValidationError('올바른 연도를 입력해주세요.');
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

    res.json(result);
  } catch {
    res.sendStatus(500);
  }
});

router.get('/task/:user_id', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;

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
    const friend = (await executeSql('select idx from user where user_id = ?', [friendId])) as RowDataPacket;
    if (friend.length === 0) return res.status(404).send({ msg: '존재하지 않는 사용자예요.' });

    const { idx: friendIdx } = friend[0];
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/calendar/task?year=${year}&month=${month}`);

    const isNotFriend = ((await executeSql('select * from friendship where (sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)', [userIdx, friendIdx, friendIdx, userIdx])) as RowDataPacket).length === 0;
    if (isNotFriend) return res.status(403).send({ msg: '친구가 아닌 사용자의 태스크를 조회할 수 없어요.' });

    const datesTaskExists = (await executeSql('select date_format(date, "%d") as date, count(idx) from task where public = true and user_idx = ? and date like ? group by date', [friendIdx, dateSearchFormat])) as RowDataPacket;
    datesTaskExists.forEach(({ date }) => {
      result[parseInt(date) - 1] = true;
    });

    res.json(result);
  } catch {
    res.sendStatus(500);
  }
});

router.get('/goal', authenticateToken, async (req: AuthorizedRequest, res) => {
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

  const result = Array.from({ length: lastDay }, () => 0);
  try {
    const taskLabelSql = 'select date, label_idx, amount from task_label inner join task on task_label.task_idx = task.idx where done = true and user_idx = ? and date like ?';
    const currentAmountSql = 'cast(ifnull(sum(task_label.amount), 0) as unsigned)';
    const dailyRateSql = `select goal.date, case when over then if(${currentAmountSql} / goal.amount > 1, 1, ${currentAmountSql} / goal.amount) when ${currentAmountSql} > goal.amount then 0 else 1 end as rate from goal left join (${taskLabelSql}) task_label on goal.label_idx = task_label.label_idx and goal.date = task_label.date where user_idx = ? and goal.date like ? group by idx, date`;

    const dailyAverageRate = (await executeSql(`select date_format(date, "%d") as date, avg(rate) as averageRate from (${dailyRateSql}) daily_rate group by date`, [userIdx, dateSearchFormat, userIdx, dateSearchFormat])) as RowDataPacket;
    dailyAverageRate.forEach(({ date, averageRate }) => {
      result[parseInt(date) - 1] = parseFloat(averageRate);
    });

    res.json(result);
  } catch {
    res.sendStatus(500);
  }
});

router.get('/goal/:user_id', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;

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

  const result = Array.from({ length: lastDay }, () => 0);
  try {
    const friend = (await executeSql('select idx from user where user_id = ?', [friendId])) as RowDataPacket;
    if (friend.length === 0) return res.status(404).send({ msg: '존재하지 않는 사용자예요.' });

    const { idx: friendIdx } = friend[0];
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/calendar/task?year=${year}&month=${month}`);

    const isNotFriend = ((await executeSql('select * from friendship where (sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)', [userIdx, friendIdx, friendIdx, userIdx])) as RowDataPacket).length === 0;
    if (isNotFriend) return res.status(403).send({ msg: '친구가 아닌 사용자의 태스크를 조회할 수 없어요.' });

    const taskLabelSql = 'select date, label_idx, amount from task_label inner join task on task_label.task_idx = task.idx where done = true and user_idx = ? and date like ?';
    const currentAmountSql = 'cast(ifnull(sum(task_label.amount), 0) as unsigned)';
    const dailyRateSql = `select goal.date, case when over then if(${currentAmountSql} / goal.amount > 1, 1, ${currentAmountSql} / goal.amount) when ${currentAmountSql} > goal.amount then 0 else 1 end as rate from goal left join (${taskLabelSql}) task_label on goal.label_idx = task_label.label_idx and goal.date = task_label.date where user_idx = ? and goal.date like ? group by idx, date`;

    const dailyAverageRate = (await executeSql(`select date_format(date, "%d") as date, avg(rate) as averageRate from (${dailyRateSql}) daily_rate group by date`, [friendIdx, dateSearchFormat, friendIdx, dateSearchFormat])) as RowDataPacket;
    dailyAverageRate.forEach(({ date, averageRate }) => {
      result[parseInt(date) - 1] = parseFloat(averageRate);
    });

    res.json(result);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
