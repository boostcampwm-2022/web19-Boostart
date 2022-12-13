import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';

export const getAllTaskLabelsByTaskIdx = async (taskIdx: number) => {
  return (await executeSql('select * from task_label where task_idx = ?', [taskIdx])) as RowDataPacket;
};

export const createTaskLabel = async (taskIdx: number, labelIdx: number, amount: number) => {
  await executeSql('insert into task_label (task_idx, label_idx, amount) value (?, ?, ?)', [taskIdx, labelIdx, amount]);
};

export const updateTaskLabel = async (taskIdx: number, labelIdx: number, amount: number) => {
  await executeSql('update task_label set amount = ? where task_idx = ? and label_idx = ?', [amount, taskIdx, labelIdx]);
};

export const deleteTaskLabel = async (taskIdx: number, labelIdx: number) => {
  await executeSql('delete from task_label where task_idx = ? and label_idx = ?', [taskIdx, labelIdx]);
};

export const deleteTaskLabelByTaskIdx = async (taskIdx: number) => {
  await executeSql('delete from task_label where task_idx = ?', [taskIdx]);
};
