import { Router } from 'express';
import { OkPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const rows = await executeSql('select * from task where user_idx = ?', [userIdx.toString()]);
  res.json(rows);
});

const MIN_IMPORTANCE = 1;
const MAX_IMPORTANCE = 5;
const validateImportance = (importance: number) => {
  return typeof importance === 'number' && importance >= MIN_IMPORTANCE && importance <= MAX_IMPORTANCE;
};
const validateLatitude = (lat: number) => {
  return typeof lat === 'number' && lat >= -90 && lat <= 90;
};
const validateLongitude = (lng: number) => {
  return typeof lng === 'number' && lng >= -180 && lng <= 180;
};

const DEFAULT_TAG_INDEX = 1;

const validateTitle = (title: string) => {
  return typeof title === 'string';
};
const validateDate = (date: string) => {
  const regex = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
  return regex.test(date);
};
const validateIsPublic = (isPublic: boolean) => {
  return typeof isPublic === 'boolean';
};
const validateTime = (time: string) => {
  const regex = /^([01][0-9]|2[0-3]):([0-5][0-9])$/;
  return regex.test(time);
};
const validateTagIdx = (tagIdx: number) => {
  return typeof tagIdx === 'number';
};
const validateDone = (done: boolean) => {
  return typeof done === 'boolean';
};
// TODO: implement
const validateLabels = (labels: any[]) => {
  return false;
};

router.post('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  let { title, date, importance, startedAt, endedAt, lat, lng, isPublic, tagIdx, content, done, labels } = req.body;

  if (!validateTitle(title)) return res.status(400).send({ msg: '제목을 입력해주세요.' });
  if (!validateDate(date)) return res.status(400).send({ msg: '날짜를 입력해주세요.' });
  if (!validateImportance(importance)) importance = (MIN_IMPORTANCE + MAX_IMPORTANCE) / 2;
  if (!validateTime(startedAt)) startedAt = null;
  if (!validateTime(endedAt)) endedAt = null;
  if (!validateLatitude(lat)) lat = null;
  if (!validateLongitude(lng)) lng = null;
  if (!validateIsPublic(isPublic)) isPublic = false;
  if (!validateTagIdx(tagIdx)) tagIdx = DEFAULT_TAG_INDEX;
  if (!validateLongitude(content)) content = null;
  if (!validateDone(done)) done = false;
  if (!validateLabels(labels)) labels = [];

  try {
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

export default router;
