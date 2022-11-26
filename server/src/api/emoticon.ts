import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/task/:task_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const taskIdx = req.params.task_idx;
  try {
    const notExistTask = ((await executeSql('select idx from task where idx = ? and user_idx = ?', [taskIdx.toString(), userIdx.toString()])) as RowDataPacket).length === 0;
    if (notExistTask) return res.status(404).json({ msg: '존재하지 않는 태스크예요.' });

    const emoticons = await executeSql(
      'select task_social_action.idx, emoticon.value as emoticon, user.user_id as author_name from task_social_action inner join emoticon on task_social_action.emoticon_idx = emoticon.idx inner join user on task_social_action.author_idx = user.idx where task_idx = ?',
      [taskIdx.toString()]
    );
    res.json(emoticons);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
