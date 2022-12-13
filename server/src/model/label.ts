import { RowDataPacket, OkPacket } from 'mysql2';
import { executeSql } from '../db';
import { setSetSyntax } from './util';

export const existLabelByIdx = async (userIdx: number, labelIdx: number) => {
  return ((await executeSql('select idx from label where user_idx = ? and idx = ?', [userIdx, labelIdx])) as RowDataPacket).length > 0;
};

interface Label {
  labelIdx: number;
  amount: number;
}

export const validateLabels = async (userIdx: number, labels: Label[]) => {
  if (labels.length === 0) return true;

  let labelCheckSql = 'select idx from label where user_idx = ? and ';
  const labelCheckValue = [userIdx];

  labels.forEach(async (label: Label, idx: number) => {
    if (idx === 0) labelCheckSql += '(';
    else labelCheckSql += ' or ';
    labelCheckSql += 'idx = ?';
    if (idx === labels.length - 1) labelCheckSql += ')';

    labelCheckValue.push(label.labelIdx);
  });

  return ((await executeSql(labelCheckSql, labelCheckValue)) as RowDataPacket).length != labels.length;
};

export const existLabelByTitle = async (userIdx: number, title: string) => {
  return ((await executeSql('select idx from label where user_idx = ? and title = ?', [userIdx, title])) as RowDataPacket).length > 0;
};

export const getLabelUsageCountByIdx = async (labelIdx: number) => {
  const { labelUsageCount } = ((await executeSql('select count(ifnull(label_idx, 0)) as labelUsageCount from task_label where label_idx = ?', [labelIdx])) as RowDataPacket)[0];
  return labelUsageCount;
};

export const getLabelByIdx = async (labelIdx: number) => {
  const [label] = (await executeSql('select title, user_idx from label where idx = ?', [labelIdx])) as RowDataPacket[];
  return label;
};

export const getAllLabelsByUserIdx = async (userIdx: number) => {
  return await executeSql('select label.idx, label.title, label.color, label.unit, count(task_label.label_idx) as count from label left join task_label on label.idx = task_label.label_idx where label.user_idx = ? group by label.idx', [userIdx]);
};

export const getAllLabelsByTaskIdx = async (taskIdx: number) => {
  return await executeSql('select label.idx as labelIdx, label.title, label.color, label.unit, task_label.amount from task_label inner join label on task_label.label_idx = label.idx where task_idx = ?', [taskIdx]);
};

export const createLabel = async (userIdx: number, title: string, color: string, unit: string) => {
  const { insertId: labelIdx } = (await executeSql('insert into label (title, color, unit, user_idx) values (?, ?, ?, ?)', [title, color, unit, userIdx])) as OkPacket;
  return labelIdx;
};

export const updateLabel = async (labelIdx: number, columnValueList: { column: string; value: any }[]) => {
  const updateValues = [];
  const updateSql = `update label ${setSetSyntax(columnValueList, updateValues)} where idx = ?`;
  updateValues.push(labelIdx);
  console.log(updateSql);
  console.log(updateValues);
  await executeSql(updateSql, updateValues);
};

export const deleteLabel = async (labelIdx: number) => {
  await executeSql('delete from label where idx = ?', [labelIdx]);
};
