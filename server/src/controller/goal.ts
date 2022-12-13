import { Response } from 'express';
import { AuthorizedRequest } from '../types';
import { API_VERSION } from '../constants';
import * as Goal from '../model/goal';
import * as User from '../model/user';
import * as Friend from '../model/friend';
import * as Label from '../model/label';

export const getAllGoals = async (req: AuthorizedRequest, res: Response) => {
  console.log('gETALL');
  const { userIdx } = req.user;
  const { date } = req.query;
  console.log(userIdx, date);
  console.log(req.query);
  if (!date) return res.status(400).send({ msg: '날짜를 지정해주세요.' });
  console.log('MCMCM');
  try {
    console.log('HEYLEL');
    const goals = await Goal.getAllGoals(userIdx, date as string);
    console.log(goals);
    res.json(goals);
  } catch {
    res.sendStatus(500);
  }
};

export const getAllFriendsGoals = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;
  const { date } = req.query;
  if (!date) return res.status(400).send({ msg: '날짜를 지정해주세요.' });

  try {
    const friendIdx = await User.getIdxByUserId(friendId);
    if (!friendIdx) return res.status(404).send({ msg: '존재하지 않는 사용자예요.' });
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/goal?date=${date}`);

    const existFriend = await Friend.existFriend(userIdx, friendIdx);
    if (!existFriend) return res.status(403).send({ msg: '친구가 아닌 사용자의 목표를 조회할 수 없어요.' });

    const goals = await Goal.getAllGoals(friendIdx, date as string);
    res.json(goals);
  } catch {
    res.sendStatus(500);
  }
};

const GoalBodyKeys = {
  title: 'title',
  date: 'date',
  labelIdx: 'labelIdx',
  amount: 'amount',
  over: 'over',
} as const;

type GoalBodyKeys = typeof GoalBodyKeys[keyof typeof GoalBodyKeys];

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const validate = (key: string, value: string | number | boolean) => {
  switch (key) {
    case GoalBodyKeys.title: {
      if (typeof value !== 'string') throw new ValidationError('올바른 제목을 입력해주세요.');
      return true;
    }
    case GoalBodyKeys.date: {
      if (typeof value !== 'string') throw new ValidationError('올바른 날짜를 입력해주세요.');
      const regex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
      if (!regex.test(value)) throw new ValidationError('올바른 날짜를 입력해주세요.');
      return true;
    }
    case GoalBodyKeys.labelIdx: {
      if (typeof value !== 'number') throw new ValidationError('올바른 라벨을 입력해주세요.');
      return true;
    }
    case GoalBodyKeys.amount: {
      if (typeof value !== 'number') throw new ValidationError('올바른 목표량을 입력해주세요.');
      return true;
    }
    case GoalBodyKeys.over: {
      if (typeof value !== 'boolean') throw new ValidationError('올바른 목표 타입을 입력해주세요.');
      return true;
    }
    default: {
      throw new ValidationError('잘못된 정보가 입력되었어요.');
    }
  }
};

export const createGoal = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;

  try {
    Object.values(GoalBodyKeys).forEach((key) => validate(key, req.body[key]));
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  const { title, date, labelIdx, amount, over } = req.body;

  try {
    const existLabel = await Label.existLabelByIdx(userIdx, labelIdx);
    if (!existLabel) return res.status(404).json({ msg: '존재하지 않는 라벨이에요.' });

    await Goal.createGoal(userIdx, title, date, labelIdx, amount, over);
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const updateGoal = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const goalIdx = parseInt(req.params.goal_idx);

  try {
    Object.values(GoalBodyKeys).forEach((key) => validate(key, req.body[key]));
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  const { title, labelIdx, amount, over } = req.body;

  try {
    const existGoal = await Goal.existGoal(userIdx, goalIdx);
    if (!existGoal) return res.status(404).json({ msg: '존재하지 않는 목표예요.' });

    const existLabel = await Label.existLabelByIdx(userIdx, labelIdx);
    if (!existLabel) return res.status(404).json({ msg: '존재하지 않는 라벨이에요.' });

    await Goal.updateGoal(goalIdx, title, labelIdx, amount, over);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
};

export const deleteGoal = async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const goalIdx = parseInt(req.params.goal_idx);

  try {
    const existGoal = Goal.existGoal(userIdx, goalIdx);
    if (!existGoal) return res.status(404).json({ msg: '존재하지 않는 목표예요.' });

    await Goal.deleteGoal(goalIdx);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
};
