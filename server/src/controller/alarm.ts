import { Response } from 'express';
import { AuthorizedRequest } from '../types';
import * as Alarm from '../model/alarm';

export const getAllAlarms = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;

  try {
    const alarms = await Alarm.getAllAlarms(userIdx);
    res.status(200).json(alarms);
  } catch (error) {
    res.sendStatus(500);
  }
};
