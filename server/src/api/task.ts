import { Router } from 'express';
import { OkPacket, RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';
import { API_VERSION } from '../constants';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { date } = req.query;
  if (!date) return res.status(400).send({ msg: '날짜를 지정해주세요.' });
  try {
    const tasks = (await executeSql(
      'select task.idx, task.title, task.importance, task.started_at as startedAt, task.ended_at as endedAt, task.lat, task.lng, task.location, task.public as isPublic, task.tag_idx as tagIdx, tag.title as tagName, task.content, task.done from task left join tag on task.tag_idx = tag.idx where task.user_idx = ? and task.date = ?',
      [userIdx, date]
    )) as RowDataPacket;

    const result = await Promise.all(
      tasks.map(async (task: RowDataPacket) => {
        const { idx: taskIdx } = task;
        const labels = await executeSql('select label.idx as labelIdx, label.title, label.color, label.unit, task_label.amount from task_label inner join label on task_label.label_idx = label.idx where task_idx = ?', [taskIdx]);
        task.labels = labels;
        return task;
      })
    );
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
});

router.get('/:user_id', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;
  const { date } = req.query;
  if (!date) return res.status(400).send({ msg: '날짜를 지정해주세요.' });

  try {
    const friend = (await executeSql('select idx from user where user_id = ?', [friendId])) as RowDataPacket;
    if (friend.length === 0) return res.status(404).send({ msg: '존재하지 않는 사용자예요.' });

    const { idx: friendIdx } = friend[0];
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/task?date=${date}`);

    const isNotFriend = ((await executeSql('select * from friendship where (sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)', [userIdx, friendIdx, friendIdx, userIdx])) as RowDataPacket).length === 0;
    if (isNotFriend) return res.status(403).send({ msg: '친구가 아닌 사용자의 태스크를 조회할 수 없어요.' });

    const tasks = (await executeSql(
      'select task.idx, task.title, task.importance, task.started_at as startedAt, task.ended_at as endedAt, task.lat, task.lng, task.location, task.public as isPublic, task.tag_idx as tagIdx, tag.title as tagName, task.content, task.done from task left join tag on task.tag_idx = tag.idx where task.user_idx = ? and task.date = ? and public = true',
      [friendIdx, date]
    )) as RowDataPacket;

    const result = await Promise.all(
      tasks.map(async (task: RowDataPacket) => {
        const { idx: taskIdx } = task;
        const labels = await executeSql('select label.idx as labelIdx, label.title, label.color, label.unit, task_label.amount from task_label inner join label on task_label.label_idx = label.idx where task_idx = ?', [taskIdx]);
        task.labels = labels;
        return task;
      })
    );
    res.json(result);
  } catch {
    res.sendStatus(500);
  }
});

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

router.post('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;

  try {
    Object.values(TaskBodyKeys).forEach((key) => {
      if (!validate(key, req.body[key])) req.body[key] = TaskBodyDefaultValues[key];
    });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  const { title, date, importance, startedAt, endedAt, lat, lng, location, isPublic, tagIdx, content, done, labels } = req.body;

  try {
    if (labels.length > 0) {
      let labelCheckSql = 'select idx from label where user_idx = ? and ';
      const labelCheckValue = [userIdx];

      labels.forEach(async (label: Label, idx: number) => {
        if (idx === 0) labelCheckSql += '(';
        else labelCheckSql += ' or ';
        labelCheckSql += 'idx = ?';
        if (idx === labels.length - 1) labelCheckSql += ')';

        const { labelIdx } = label;
        labelCheckValue.push(labelIdx);
      });

      const notExistLabel = ((await executeSql(labelCheckSql, labelCheckValue)) as RowDataPacket).length != labels.length;
      if (notExistLabel) return res.status(404).json({ msg: '존재하지 않는 라벨이에요.' });
    }

    const result = (await executeSql('insert into task (title, importance, date, started_at, ended_at, lat, lng, location, content, done, public, tag_idx, user_idx) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      title,
      importance,
      date,
      startedAt,
      endedAt,
      lat,
      lng,
      location,
      content,
      done,
      isPublic,
      tagIdx,
      userIdx,
    ])) as OkPacket;

    const taskIdx = result.insertId;
    await Promise.all(
      labels.map(({ labelIdx, amount }) => {
        executeSql('insert into task_label (task_idx, label_idx, amount) value (?, ?, ?)', [taskIdx, labelIdx, amount]);
      })
    );
    res.sendStatus(201);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.patch('/:task_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const taskIdx = req.params.task_idx;
  const { done, tagIdx } = req.body;

  try {
    const [task] = (await executeSql('select * from task where idx = ?', [taskIdx])) as RowDataPacket[];

    if (!task) return res.status(404).json({ msg: '해당 태스크를 찾을 수 있어요.' });
    if (task.user_idx !== userIdx) return res.status(403).json({ msg: '자신의 태스크만 수정할 수 있어요.' });

    let status = 409;
    if (tagIdx) {
      const [tag] = (await executeSql('select user_idx from tag where idx = ?', [tagIdx])) as RowDataPacket[];
      if (!tag) return res.status(404).json({ msg: '해당 태그를 찾을 수 없어요.' });
      if (tag.user_idx !== userIdx) return res.status(403).json({ msg: '태그 변경은 자신의 태그로만 가능해요.' });
      if (task.tag_idx === tagIdx) return res.status(409).json({ msg: '이미 해당 태그에요.' });
      await executeSql('update task set tag_idx = ? where idx = ?', [tagIdx, taskIdx]);
      status = 206;
    }

    if (done) {
      if (task.done === done) return res.sendStatus(status);
      await executeSql('update task set done = ? where idx = ?', [done, taskIdx]);
    }
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
});

export default router;
