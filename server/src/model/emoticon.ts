import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';

export const existEmoticon = async (emoticonIdx: number) => {
  return ((await executeSql('select idx from emoticon where idx = ?', [emoticonIdx])) as RowDataPacket).length > 0;
};

export const getAllEmoticonsByTask = async (taskIdx: number) => {
  return await executeSql(
    'select task_social_action.idx, emoticon.value as emoticon, user.user_id as authorName from task_social_action inner join emoticon on task_social_action.emoticon_idx = emoticon.idx inner join user on task_social_action.author_idx = user.idx where task_idx = ?',
    [taskIdx]
  );
};

export const createTaskSocialAction = async (userIdx: number, taskIdx: number, emoticonIdx: number) => {
  await executeSql('insert into task_social_action (task_idx, emoticon_idx, author_idx) values (?, ?, ?);', [taskIdx, emoticonIdx, userIdx]);
};

export const deleteTaskSocialAction = async (taskIdx: number) => {
  await executeSql('delete from task_social_action where task_idx = ?', [taskIdx]);
};
