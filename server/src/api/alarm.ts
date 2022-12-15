import { Router } from 'express';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

export const alarmRouter = Router();

alarmRouter.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  try {
    const alarms = await executeSql('select type, user.user_id as publisherId, content as title from alarm inner join user on user.idx = alarm.publisher_idx where receiver_idx = ? and status = false order by alarm.idx desc', [userIdx]);
    res.status(200).json(alarms);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
