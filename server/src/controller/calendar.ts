import { Response } from 'express';
import { AuthorizedRequest } from '../types';
import * as Task from '../model/task';
import * as Goal from '../model/goal';
import * as User from '../model/user';
import * as Friend from '../model/friend';
import { API_VERSION } from '../constants';

const CalendarQueryKeys = {
  year: 'year',
  month: 'month',
} as const;

type CalendarQueryKeys = typeof CalendarQueryKeys[keyof typeof CalendarQueryKeys];

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const validate = (key: string, value: string) => {
  switch (key) {
    case CalendarQueryKeys.year: {
      const regex = /^\d{4}$/;
      if (!regex.test(value)) throw new ValidationError('올바른 연도를 입력해주세요.');
      const year = parseInt(value);
      if (isNaN(year)) throw new ValidationError('올바른 연도를 입력해주세요.');
      return true;
    }
    case CalendarQueryKeys.month: {
      const regex = /^([1-9]|1[012])$/;
      if (!regex.test(value)) throw new ValidationError('올바른 연도를 입력해주세요.');
      const month = parseInt(value);
      if (isNaN(month) || month < 1 || month > 12) throw new ValidationError('올바른 달을 입력해주세요.');
      return true;
    }
    default: {
      throw new ValidationError('잘못된 정보가 입력되었어요.');
    }
  }
};

export const getTaskExistenceList = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;

  try {
    Object.values(CalendarQueryKeys).forEach((key) => validate(key, req.query[key] as string));
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  const year = parseInt(req.query.year as string);
  const month = parseInt(req.query.month as string);

  const dateSearchFormat = `${year}-${month}-%`;
  const lastDate = new Date(year, month, 0);
  const lastDay = lastDate.getDate();

  const result = Array.from({ length: lastDay }, () => false);
  try {
    const taskExistenceList = await Task.getTaskExistenceList(userIdx, dateSearchFormat);
    taskExistenceList.forEach(({ date }) => {
      result[parseInt(date) - 1] = true;
    });
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
};

export const getFriendsTaskExistenceList = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;

  try {
    Object.values(CalendarQueryKeys).forEach((key) => validate(key, req.query[key] as string));
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  const year = parseInt(req.query.year as string);
  const month = parseInt(req.query.month as string);

  const dateSearchFormat = `${year}-${month}-%`;
  const lastDate = new Date(year, month, 0);
  const lastDay = lastDate.getDate();

  const result = Array.from({ length: lastDay }, () => false);
  try {
    const friendIdx = await User.getIdxByUserId(friendId);
    if (!friendIdx) return res.status(404).send({ msg: '존재하지 않는 사용자예요.' });
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/calendar/task`);

    const existFriend = await Friend.existFriend(userIdx, friendIdx);
    if (!existFriend) return res.status(403).send({ msg: '친구가 아닌 사용자의 태그를 조회할 수 없어요.' });

    const taskExistenceList = await Task.getTaskExistenceList(friendIdx, dateSearchFormat);
    taskExistenceList.forEach(({ date }) => {
      result[parseInt(date) - 1] = true;
    });
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
};

export const getAverageGoalAchievementRateList = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;

  try {
    Object.values(CalendarQueryKeys).forEach((key) => validate(key, req.query[key] as string));
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  const year = parseInt(req.query.year as string);
  const month = parseInt(req.query.month as string);

  const dateSearchFormat = `${year}-${month}-%`;
  const lastDate = new Date(year, month, 0);
  const lastDay = lastDate.getDate();

  const result = Array.from({ length: lastDay }, () => 0);
  try {
    const averageGoalAchievementRateList = await Goal.getAverageGoalAchievementRate(userIdx, dateSearchFormat);
    averageGoalAchievementRateList.forEach(({ date, averageRate }) => {
      result[parseInt(date) - 1] = parseFloat(averageRate);
    });
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
};

export const getFriendsAverageGoalAchievementRateList = async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;

  try {
    Object.values(CalendarQueryKeys).forEach((key) => validate(key, req.query[key] as string));
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  const year = parseInt(req.query.year as string);
  const month = parseInt(req.query.month as string);

  const dateSearchFormat = `${year}-${month}-%`;
  const lastDate = new Date(year, month, 0);
  const lastDay = lastDate.getDate();

  const result = Array.from({ length: lastDay }, () => 0);
  try {
    const friendIdx = await User.getIdxByUserId(friendId);
    if (!friendIdx) return res.status(404).send({ msg: '존재하지 않는 사용자예요.' });
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/calendar/goal`);

    const existFriend = await Friend.existFriend(userIdx, friendIdx);
    if (!existFriend) return res.status(403).send({ msg: '친구가 아닌 사용자의 태그를 조회할 수 없어요.' });

    const averageGoalAchievementRateList = await Goal.getAverageGoalAchievementRate(friendIdx, dateSearchFormat);
    averageGoalAchievementRateList.forEach(({ date, averageRate }) => {
      result[parseInt(date) - 1] = parseFloat(averageRate);
    });
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
};
