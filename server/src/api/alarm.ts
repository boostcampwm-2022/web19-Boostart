import { Router } from 'express';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

export const alarmRouter = Router();

alarmRouter.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  try {
    const alarms = await executeSql('select type, publisher_idx as publisherIdx, content as title from alarm where receiver_idx = ? and status = false order by idx desc', [userIdx]);
    res.status(200).json(alarms);
  } catch (error) {
    res.sendStatus(500);
  }
});
