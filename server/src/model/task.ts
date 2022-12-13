import { RowDataPacket, OkPacket } from 'mysql2';
import { executeSql } from '../db';
import { setSetSyntax } from './util';

export const existTask = async (userIdx: number, taskIdx: number) => {
  if (userIdx) return ((await executeSql('select idx from task where idx = ? and user_idx = ?', [taskIdx, userIdx])) as RowDataPacket).length > 0;
  return ((await executeSql('select idx from task where idx = ?', [taskIdx])) as RowDataPacket).length > 0;
};

export const getTaskExistenceList = async (userIdx: number, dateSearchFormat: string) => {
  return (await executeSql('select date_format(date, "%d") as date, count(idx) from task where user_idx = ? and date like ? group by date', [userIdx, dateSearchFormat])) as RowDataPacket;
};

export const getTaskByIdx = async (taskIdx: number) => {
  const [task] = (await executeSql('select * from task where idx = ?', [taskIdx])) as RowDataPacket[];
  return task;
};

export const getAllTasks = async (userIdx: number, date: string) => {
  return (await executeSql(
    'select task.idx, task.title, task.importance, task.started_at as startedAt, task.ended_at as endedAt, task.lat, task.lng, task.location, task.public as isPublic, task.tag_idx as tagIdx, tag.title as tagName, task.content, task.done from task left join tag on task.tag_idx = tag.idx where task.user_idx = ? and task.date = ?',
    [userIdx, date]
  )) as RowDataPacket;
};

export const createTask = async (
  userIdx: number,
  title: string,
  importance: number,
  date: string,
  startedAt: string,
  endedAt: string,
  latitude: number,
  longitude: number,
  location: string,
  content: string,
  done: boolean,
  isPublic: boolean,
  tagIdx: number
) => {
  const { insertId: idx } = (await executeSql('insert into task (title, importance, date, started_at, ended_at, lat, lng, location, content, done, public, tag_idx, user_idx) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    title,
    importance,
    date,
    startedAt,
    endedAt,
    latitude,
    longitude,
    location,
    content,
    done,
    isPublic,
    tagIdx,
    userIdx,
  ])) as OkPacket;
  return idx;
};

export const updateTask = async (taskIdx: number, columnValueList: { column: string; value: any }[]) => {
  const updateValues = [];
  const updateSql = `update task ${setSetSyntax(columnValueList, updateValues)} where idx = ?`;
  updateValues.push(taskIdx);
  await executeSql(updateSql, updateValues);
};

export const deleteTask = async (taskIdx: number) => {
  await executeSql('delete from task where idx = ?', [taskIdx]);
};
