import { RowDataPacket, OkPacket } from 'mysql2';
import { executeSql } from '../db';

export const existTag = async (userIdx: number, tagIdx: number) => {
  return ((await executeSql('select idx from tag where user_idx = ? and idx = ?', [userIdx, tagIdx])) as RowDataPacket).length > 0;
};

export const getTagUsageCount = async (tagIdx: number) => {
  return ((await executeSql('select idx from task where tag_idx = ?', [tagIdx])) as RowDataPacket).length;
};

export const getTagByIdx = async (tagIdx: number) => {
  const [tag] = (await executeSql('select user_idx from tag where idx = ?', [tagIdx])) as RowDataPacket[];
  return tag;
};

export const getAllTags = async (userIdx: number) => {
  return await executeSql('select tag.idx, tag.title, tag.color, count(task.idx) as count from tag left join task on task.tag_idx = tag.idx where tag.user_idx = ? group by tag.idx', [userIdx]);
};

export const createTag = async (userIdx: number, title: string, color: string) => {
  const { insertId: tagIdx } = (await executeSql('insert into tag (title, color, user_idx) values (?, ?, ?)', [title, color, userIdx])) as OkPacket;
  return tagIdx;
};

export const updateTag = async (userIdx: number, tagIdx: number, color: string) => {
  await executeSql('update tag set color = ? where idx = ? and user_idx = ?', [color, tagIdx, userIdx]);
};

export const deleteTag = async (userIdx: number, tagIdx: number) => {
  await executeSql('delete from tag where user_idx = ? and idx = ?', [userIdx, tagIdx]);
};
