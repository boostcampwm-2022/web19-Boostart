import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest, PutEmoticonRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/task/:task_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const taskIdx = req.params.task_idx;
  try {
    const [task] = (await executeSql('select user_idx from task where idx = ?', [taskIdx])) as RowDataPacket[];
    if (!task) return res.status(404).json({ msg: '존재하지 않는 일정이에요.' });

    const { user_idx: taskAuthorIdx } = task;
    if (userIdx !== taskAuthorIdx) {
      const isFriend =
        ((await executeSql('select * from friendship where accepted = true and ((sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?))', [userIdx, taskAuthorIdx, taskAuthorIdx, userIdx])) as RowDataPacket).length > 0;
      if (!isFriend) return res.status(403).json({ msg: '친구가 아닌 사용자의 정보를 조회할 수 없어요.' });
    }

    const emoticons = await executeSql(
      'select task_social_action.idx, emoticon.value as emoticon, user.user_id as authorName from task_social_action inner join emoticon on task_social_action.emoticon_idx = emoticon.idx inner join user on task_social_action.author_idx = user.idx where task_idx = ?',
      [taskIdx]
    );
    res.json(emoticons);
  } catch {
    res.sendStatus(500);
  }
});

router.put('/task/:task_idx', authenticateToken, async (req: PutEmoticonRequest, res) => {
  const { userIdx, userId } = req.user;
  const taskIdx = req.params.task_idx;
  const { emoticon } = req.body;
  try {
    if (!emoticon) return res.sendStatus(400);

    const notExistTask = ((await executeSql('select idx from task where idx = ?', [taskIdx])) as RowDataPacket).length === 0;
    if (notExistTask) return res.status(404).json({ msg: '존재하지 않는 일정이에요.' });

    const notExistEmoticon = ((await executeSql('select idx from emoticon where idx = ?', [emoticon])) as RowDataPacket).length === 0;
    if (notExistEmoticon) return res.status(404).json({ msg: '존재하지 않는 이모티콘이에요.' });

    console.log(`유저 ${userIdx}가 ${taskIdx}번 태스크에 ${emoticon}을 남겼어요.`);

    const redirectURI = '#'; // todo;

    await executeSql('insert into task_social_action (task_idx, emoticon_idx, author_idx) values (?, ?, ?);', [taskIdx, emoticon, userIdx]);

    // todo: 한방 쿼리..?
    const { receiverIdx, title } = (await executeSql('select user_idx as receiverIdx, title from task where idx = ?', [taskIdx]))[0];
    const { receiverId } = (await executeSql('select user_id as receiverId from user where idx = ?', [receiverIdx]))[0];

    await executeSql(`insert into alarm (publisher_idx, receiver_idx, type, content, redirect, status) values (?, ?, '${AlarmType.TASK_EMOTICON}', ?, '${redirectURI}', false)`, [userIdx, receiverIdx, title]);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

export const AlarmType = {
  TASK_EMOTICON: 'task_emoticon',
  DIARY_EDIT: 'diary_edit',
} as const;

export default router;
