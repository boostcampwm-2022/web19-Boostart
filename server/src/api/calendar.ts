import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

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
    const taskLabelSql = 'select label_idx, amount from task_label inner join task on task_label.task_idx = task.idx where done = true and user_idx = ? and date like ?';
    const currentAmountSql = 'cast(ifnull(sum(task_label.amount), 0) as unsigned)';
    const dailyRateSql = `select date, case when over then (${currentAmountSql} / goal.amount) when ${currentAmountSql} > goal.amount then 0 else 1 end as rate from goal left join (${taskLabelSql}) task_label on goal.label_idx = task_label.label_idx where user_idx = ? and date like ? group by idx`;

    const dailyAverageRate = (await executeSql(`select date_format(date, "%d") as date, avg(rate) as averageRate from (${dailyRateSql}) daily_rate group by date`, [userIdx, dateSearchFormat, userIdx, dateSearchFormat])) as RowDataPacket;
    dailyAverageRate.forEach(({ date, averageRate }) => {
      result[parseInt(date) - 1] = parseFloat(averageRate);
    });

    res.json(result);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
