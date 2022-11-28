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
    const notExistTask = ((await executeSql('select idx from task where idx = ? and user_idx = ?', [taskIdx.toString(), userIdx.toString()])) as RowDataPacket).length === 0;
    if (notExistTask) return res.status(404).json({ msg: '존재하지 않는 일정이에요.' });

    const emoticons = await executeSql(
      'select task_social_action.idx, emoticon.value as emoticon, user.user_id as author_name from task_social_action inner join emoticon on task_social_action.emoticon_idx = emoticon.idx inner join user on task_social_action.author_idx = user.idx where task_idx = ?',
      [taskIdx.toString()]
    );
    res.json(emoticons);
  } catch {
    res.sendStatus(500);
  }
});

router.put('/task/:task_idx', authenticateToken, async (req: PutEmoticonRequest, res) => {
  const { userIdx } = req.user;
  const taskIdx = req.params.task_idx;
  const { emoticon } = req.body;
  try {
    if (!emoticon) return res.sendStatus(400);

    const notExistTask = ((await executeSql('select idx from task where idx = ?', [taskIdx])) as RowDataPacket).length === 0;
    if (notExistTask) return res.status(404).json({ msg: '존재하지 않는 일정이에요.' });

    const notExistEmoticon = ((await executeSql('select idx from emoticon where idx = ?', [emoticon.toString()])) as RowDataPacket).length === 0;
    if (notExistEmoticon) return res.status(404).json({ msg: '존재하지 않는 이모티콘이에요.' });

    await executeSql('insert into task_social_action (task_idx, emoticon_idx, author_idx) values (?, ?, ?);', [taskIdx, emoticon.toString(), userIdx.toString()]);
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
