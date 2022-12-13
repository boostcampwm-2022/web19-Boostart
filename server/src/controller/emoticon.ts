import { Response } from 'express';
import { AuthorizedRequest, PutEmoticonRequest } from '../types';
import * as Emoticon from '../model/emoticon';
import * as Task from '../model/task';

export const getAllEmoticonsByTask = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const taskIdx = parseInt(req.params.task_idx);

  try {
    const existTask = await Task.existTask(userIdx, taskIdx);
    if (!existTask) return res.status(404).json({ msg: '존재하지 않는 일정이에요.' });

    const emoticons = await Emoticon.getAllEmoticonsByTask(taskIdx);
    res.json(emoticons);
  } catch {
    res.sendStatus(500);
  }
};

export const sendEmoticonToTask = async (req: PutEmoticonRequest, res: Response) => {
  const { userIdx } = req.user;
  const taskIdx = parseInt(req.params.task_idx);
  const { emoticon } = req.body;

  try {
    if (!emoticon) return res.sendStatus(400);

    const existTask = await Task.existTask(null, taskIdx);
    if (!existTask) return res.status(404).json({ msg: '존재하지 않는 일정이에요.' });

    const existEmoticon = await Emoticon.existEmoticon(emoticon);
    if (!existEmoticon) return res.status(404).json({ msg: '존재하지 않는 이모티콘이에요.' });

    await Emoticon.createTaskSocialAction(userIdx, taskIdx, emoticon);
    res.sendStatus(201);
  } catch {
    res.sendStatus(500);
  }
};
