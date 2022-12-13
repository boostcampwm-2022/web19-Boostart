import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';

export const existGoal = async (userIdx: number, goalIdx: number) => {
  return ((await executeSql('select idx from goal where user_idx = ? and idx = ?', [userIdx, goalIdx])) as RowDataPacket).length > 0;
};

export const getAverageGoalAchievementRate = async (userIdx: number, dateSearchFormat: string) => {
  const taskLabelSql = 'select date, label_idx, amount from task_label inner join task on task_label.task_idx = task.idx where done = true and user_idx = ? and date like ?';
  const currentAmountSql = 'cast(ifnull(sum(task_label.amount), 0) as unsigned)';
  const dailyRateSql = `select goal.date, case when over then if(${currentAmountSql} / goal.amount > 1, 1, ${currentAmountSql} / goal.amount) when ${currentAmountSql} > goal.amount then 0 else 1 end as rate from goal left join (${taskLabelSql}) task_label on goal.label_idx = task_label.label_idx and goal.date = task_label.date where user_idx = ? and goal.date like ? group by idx, date`;
  return (await executeSql(`select date_format(date, "%d") as date, avg(rate) as averageRate from (${dailyRateSql}) daily_rate group by date`, [userIdx, dateSearchFormat, userIdx, dateSearchFormat])) as RowDataPacket;
};

export const getAllGoals = async (userIdx: number, date: string) => {
  console.log('GETALLGOAL');
  return await executeSql(
    'select idx, title, goal.label_idx as labelIdx, goal.amount as goalAmount, cast(ifnull(sum(task_label.amount), 0) as unsigned) as currentAmount, over from goal left join (select label_idx, amount from task_label inner join task on task_label.task_idx = task.idx where done = true and user_idx = ? and date = ?) task_label on goal.label_idx = task_label.label_idx where user_idx = ? and date = ? group by idx',
    [userIdx, date, userIdx, date]
  );
};

export const createGoal = async (userIdx: number, title: string, date: string, labelIdx: number, amount: number, over: boolean) => {
  await executeSql('insert into goal (user_idx, title, date, label_idx, amount, over) values (?, ?, ?, ?, ?, ?)', [userIdx, title, date, labelIdx, amount, over]);
};

export const updateGoal = async (goalIdx: number, title: string, labelIdx: number, amount: number, over: boolean) => {
  await executeSql('update goal set title = ?, label_idx = ?, amount = ?, over = ? where idx = ?;', [title, labelIdx, amount, over, goalIdx]);
};

export const deleteGoal = async (goalIdx: number) => {
  await executeSql('delete from goal where idx = ?', [goalIdx]);
};
