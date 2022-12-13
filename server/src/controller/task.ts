import { Response } from 'express';
import { AuthorizedRequest } from '../types';
import { API_VERSION } from '../constants';
import * as Task from '../model/task';
import * as Label from '../model/label';
import * as TaskLabel from '../model/taskLabel';
import * as User from '../model/user';
import * as Friend from '../model/friend';
import * as Tag from '../model/tag';
import * as Emoticon from '../model/emoticon';

export const getAllTasks = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const { date } = req.query;
  if (!date) return res.status(400).send({ msg: '날짜를 지정해주세요.' });

  try {
    const tasks = await Task.getAllTasks(userIdx, date as string);
    const result = await Promise.all(
      tasks.map(async (task) => {
        const { idx: taskIdx } = task;
        task.labels = await Label.getAllLabelsByTaskIdx(taskIdx);
        return task;
      })
    );
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
};

export const getAllFriendsTasks = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;
  const { date } = req.query;
  if (!date) return res.status(400).send({ msg: '날짜를 지정해주세요.' });

  try {
    const friendIdx = await User.getIdxByUserId(friendId);
    if (!friendIdx) return res.status(404).send({ msg: '존재하지 않는 사용자예요.' });
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/task?date=${date}`);

    const existFriend = await Friend.existFriend(userIdx, friendIdx);
    if (!existFriend) return res.status(403).send({ msg: '친구가 아닌 사용자의 태스크를 조회할 수 없어요.' });

    const tasks = await Task.getAllTasks(friendIdx, date as string);
    const result = await Promise.all(
      tasks.map(async (task) => {
        const { idx: taskIdx } = task;
        task.labels = await Label.getAllLabelsByTaskIdx(taskIdx);
        return task;
      })
    );
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
};

const MIN_IMPORTANCE = 1;
const MAX_IMPORTANCE = 5;

const TaskBodyKeys = {
  title: 'title',
  date: 'date',
  importance: 'importance',
  lat: 'lat',
  lng: 'lng',
  location: 'location',
  isPublic: 'isPublic',
  startedAt: 'startedAt',
  endedAt: 'endedAt',
  tagIdx: 'tagIdx',
  done: 'done',
  labels: 'labels',
  content: 'content',
} as const;

const TaskColumnKeys = {
  title: 'title',
  date: 'date',
  importance: 'importance',
  lat: 'lat',
  lng: 'lng',
  location: 'location',
  isPublic: 'public',
  startedAt: 'started_at',
  endedAt: 'ended_at',
  tagIdx: 'tag_idx',
  done: 'done',
  content: 'content',
} as const;

const TaskBodyDefaultValues = {
  [TaskBodyKeys.importance]: (MIN_IMPORTANCE + MAX_IMPORTANCE) / 2,
  [TaskBodyKeys.lat]: null,
  [TaskBodyKeys.lng]: null,
  [TaskBodyKeys.location]: null,
  [TaskBodyKeys.isPublic]: true,
  [TaskBodyKeys.tagIdx]: 1,
  [TaskBodyKeys.done]: false,
  [TaskBodyKeys.labels]: [],
  [TaskBodyKeys.content]: null,
} as const;

type TaskBodyKeys = typeof TaskBodyKeys[keyof typeof TaskBodyKeys];
type TaskColumnKeys = typeof TaskColumnKeys[keyof typeof TaskColumnKeys];

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

interface Label {
  labelIdx: number;
  amount: number;
}

const validate = (key: string, value: string | number | boolean | Label[]) => {
  switch (key) {
    case TaskBodyKeys.title: {
      if (typeof value !== 'string') throw new ValidationError('올바른 제목을 입력해주세요.');
      return true;
    }
    case TaskBodyKeys.date: {
      if (typeof value !== 'string') throw new ValidationError('올바른 날짜를 입력해주세요.');
      const regex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
      if (!regex.test(value)) throw new ValidationError('올바른 날짜를 입력해주세요.');
      return true;
    }
    case TaskBodyKeys.importance: {
      return typeof value === 'number' && MIN_IMPORTANCE <= value && value <= MAX_IMPORTANCE;
    }
    case TaskBodyKeys.lat: {
      return typeof value === 'number' && value >= -90 && value <= 90;
    }
    case TaskBodyKeys.lng: {
      return typeof value === 'number' && value >= -180 && value <= 180;
    }
    case TaskBodyKeys.location: {
      return typeof value === 'string';
    }
    case TaskBodyKeys.isPublic: {
      return typeof value === 'boolean';
    }
    case TaskBodyKeys.startedAt:
    case TaskBodyKeys.endedAt: {
      if (typeof value !== 'string') throw new ValidationError('올바른 시간을 입력해주세요.');
      const regex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
      if (!regex.test(value)) throw new ValidationError('올바른 시간을 입력해주세요.');
      return true;
    }
    case TaskBodyKeys.tagIdx: {
      return typeof value === 'number';
    }
    case TaskBodyKeys.done: {
      return typeof value === 'boolean';
    }
    case TaskBodyKeys.labels: {
      if (!(value instanceof Array)) return false;
      value.forEach((label) => {
        if (!label.labelIdx || !label.amount) throw new ValidationError('올바른 라벨 정보를 입력해주세요.');
      });
      return true;
    }
    case TaskBodyKeys.content: {
      return typeof value === 'string';
    }
    default: {
      throw new ValidationError('잘못된 정보가 입력되었어요.');
    }
  }
};

export const createTask = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;

  try {
    Object.values(TaskBodyKeys).forEach((key) => {
      if (!validate(key, req.body[key])) req.body[key] = TaskBodyDefaultValues[key];
    });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  const { title, date, importance, startedAt, endedAt, lat: latitude, lng: longitude, location, isPublic, tagIdx, content, done, labels } = req.body;

  if (startedAt > endedAt) return res.sendStatus(400);

  try {
    const labelValidity = await Label.validateLabels(userIdx, labels);
    if (!labelValidity) return res.status(404).json({ msg: '존재하지 않는 라벨이에요.' });

    const taskIdx = await Task.createTask(userIdx, title, importance, date, startedAt, endedAt, latitude, longitude, location, content, done, isPublic, tagIdx);
    labels.map(({ labelIdx, amount }) => TaskLabel.createTaskLabel(taskIdx, labelIdx, amount));
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const updateTask = async (req: AuthorizedRequest, res: Response) => {
  const bodyKeysCount = Object.keys(req.body).length;
  if (bodyKeysCount === 0) return res.status(200).send({ msg: '수정할 사항이 없어요.' });

  const { userIdx } = req.user;
  const taskIdx = parseInt(req.params.task_idx);
  const { date, done, labels } = req.body;

  const willUpdateTask = bodyKeysCount > 1 || (bodyKeysCount === 1 && !date && done === undefined && !labels);

  const columnValueList = [];
  try {
    Object.values(TaskBodyKeys).forEach((key) => {
      if (req.body[key] === undefined) return;
      if (key === TaskBodyKeys.date || key === TaskBodyKeys.done) return;
      if (!validate(key, req.body[key])) req.body[key] = TaskBodyDefaultValues[key];

      if (key === TaskBodyKeys.labels) return;
      if (req.body[key] === '') req.body[key] = null;

      columnValueList.push({ column: TaskColumnKeys[key], value: req.body[key] });
    });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  try {
    const existTask = await Task.existTask(userIdx, taskIdx);
    if (!existTask) return res.status(404).json({ msg: '존재하지 않는 일정이에요.' });

    if (labels) {
      const labelValidity = await Label.validateLabels(userIdx, labels);
      if (!labelValidity) return res.status(404).json({ msg: '존재하지 않는 라벨이에요.' });
    }

    if (willUpdateTask) await Task.updateTask(taskIdx, columnValueList);

    if (labels) {
      const taskLabels = await TaskLabel.getAllTaskLabelsByTaskIdx(taskIdx);
      await Promise.all(
        taskLabels.map(async ({ label_idx: labelIdx, amount }) => {
          const updateLabelIdx = labels.findIndex((label: Label) => labelIdx === label.labelIdx);
          if (updateLabelIdx === -1) return await TaskLabel.deleteTaskLabel(taskIdx, labelIdx);

          const { amount: updateAmount } = labels[updateLabelIdx];
          if (amount != updateAmount) await TaskLabel.updateTaskLabel(taskIdx, labelIdx, updateAmount);
          labels.splice(updateLabelIdx, 1);
        })
      );

      if (labels.length > 0) {
        await Promise.all(
          labels.map(async ({ labelIdx, amount }) => {
            await TaskLabel.createTaskLabel(taskIdx, labelIdx, amount);
          })
        );
      }
    }
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const updateTaskStatus = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const taskIdx = parseInt(req.params.task_idx);
  const { done, tagIdx } = req.body;

  try {
    const task = await Task.getTaskByIdx(taskIdx);
    if (!task) return res.status(404).json({ msg: '해당 태스크를 찾을 수 있어요.' });
    if (task.user_idx !== userIdx) return res.status(403).json({ msg: '자신의 태스크만 수정할 수 있어요.' });

    let status = 409;
    if (tagIdx) {
      const tag = await Tag.getTagByIdx(tagIdx);
      if (!tag) return res.status(404).json({ msg: '해당 태그를 찾을 수 없어요.' });
      if (tag.user_idx !== userIdx) return res.status(403).json({ msg: '태그 변경은 자신의 태그로만 가능해요.' });
      if (task.tag_idx === tagIdx) return res.status(409).json({ msg: '이미 해당 태그에요.' });
      await Task.updateTask(taskIdx, [{ column: 'tag_idx', value: tagIdx }]);
      status = 206;
    }

    if (done !== undefined) {
      if (task.done === done) return res.sendStatus(status);
      await Task.updateTask(taskIdx, [{ column: 'done', value: done }]);
    }
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

export const deleteTask = async (req: AuthorizedRequest, res: Response) => {
  const { userIdx } = req.user;
  const taskIdx = parseInt(req.params.task_idx);

  try {
    const existTask = await Task.existTask(userIdx, taskIdx);
    if (!existTask) return res.status(404).json({ msg: '존재하지 않는 태스크예요.' });

    await TaskLabel.deleteTaskLabelByTaskIdx(taskIdx);
    await Emoticon.deleteTaskSocialAction(taskIdx);
    await Task.deleteTask(taskIdx);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};
