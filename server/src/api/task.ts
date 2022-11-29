import { Router } from 'express';
import { OkPacket, RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { date } = req.query;
  if (!date) return res.status(400).send({ msg: '날짜를 지정해주세요.' });
  const rows = await executeSql('select content, done, ended_at as endedAt, idx, importance, lat, lng, started_at as startedAt, tag_idx as tagIdx, title, public as isPublic from task where user_idx = ? and date = ?', [userIdx, date]);
  res.json(rows);
});

const MIN_IMPORTANCE = 1;
const MAX_IMPORTANCE = 5;

const TaskBodyKeys = {
  title: 'title',
  date: 'date',
  importance: 'importance',
  lat: 'lat',
  lng: 'lng',
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
  [TaskBodyKeys.isPublic]: true,
  [TaskBodyKeys.tagIdx]: 1,
  [TaskBodyKeys.done]: false,
  [TaskBodyKeys.labels]: [],
  [TaskBodyKeys.content]: null,
} as const;

type TaskBodyKeys = typeof TaskBodyKeys[keyof typeof TaskBodyKeys];

const validate = (key, value) => {
  switch (key) {
    case TaskBodyKeys.title: {
      if (typeof value !== 'string') {
        throw new ValidationError('올바른 제목을 입력해주세요.');
      }
      return true;
    }
    case TaskBodyKeys.date: {
      const regex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
      if (!regex.test(value)) {
        throw new ValidationError('올바른 날짜를 입력해주세요.');
      }
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
    case TaskBodyKeys.isPublic: {
      return typeof value === 'boolean';
    }
    case TaskBodyKeys.startedAt:
    case TaskBodyKeys.endedAt: {
      const regex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
      if (!regex.test(value)) {
        throw new ValidationError();
      }
      return true;
    }
    case TaskBodyKeys.tagIdx: {
      return typeof value === 'number';
    }
    case TaskBodyKeys.done: {
      return typeof value === 'boolean';
    }
    case TaskBodyKeys.labels: {
      value.forEach((label) => {
        if (!label.labelIdx || !label.amount) throw new ValidationError('올바른 라벨 정보를 입력해주세요.');
      });
      return true;
    }
    case TaskBodyKeys.content: {
      return typeof value === 'string';
    }
    default: {
      throw new ValidationError();
    }
  }
};

class ValidationError extends Error {}

router.post('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;

  try {
    Object.values(TaskBodyKeys).forEach((key) => {
      if (!validate(key, req.body[key])) req.body[key] = TaskBodyDefaultValues[key];
    });
  } catch (error) {
    return res.status(400).send({ msg: error.message });
  }

  const { title, date, importance, startedAt, endedAt, lat, lng, isPublic, tagIdx, content, done, labels } = req.body;

  let labelCheckSql = 'select idx from label where user_idx = ? and ';
  const labelCheckValue = [userIdx];

  labels.forEach(async (label, idx) => {
    if (idx === 0) labelCheckSql += '(';
    else labelCheckSql += ' or ';
    labelCheckSql += 'idx = ?';
    if (idx === labels.length - 1) labelCheckSql += ')';

    const { labelIdx } = label;
    labelCheckValue.push(labelIdx);
  });

  try {
    const notExistLabel = ((await executeSql(labelCheckSql, labelCheckValue)) as RowDataPacket).length != labels.length;
    if (notExistLabel) return res.status(404).json({ msg: '존재하지 않는 라벨이에요.' });

    const result = (await executeSql('insert into task (title, importance, date, started_at, ended_at, lat, lng, content, done, public, tag_idx, user_idx) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      title,
      importance,
      date,
      startedAt,
      endedAt,
      lat,
      lng,
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
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
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
