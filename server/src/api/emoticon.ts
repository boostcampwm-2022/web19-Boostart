import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest, PutEmoticonRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

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
