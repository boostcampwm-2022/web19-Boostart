import { Router } from 'express';
import { OkPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { date } = req.query;
  if (!date) return res.status(400).send({ msg: '날짜를 지정해주세요.' });
  const rows = await executeSql('select * from task where user_idx = ? and date = ?', [userIdx, date]);
  res.json(rows);
});

const MAX_IMPORTANCE = 5;
const validateImportance = (importance: number) => {
  return importance <= MAX_IMPORTANCE;
};
const validateLatitude = (lat: number) => {
  return lat >= -90 && lat <= 90;
};
const validateLongitude = (lng: number) => {
  return lng >= -180 && lng <= 180;
};

router.post('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { title, importance, startedAt, endedAt, lat, lng, isPublic, tagIdx, content, done, date, labels } = req.body;

  if (!validateImportance(importance)) res.sendStatus(400);
  if (!validateLatitude(lat)) res.sendStatus(400);
  if (!validateLongitude(lng)) res.sendStatus(400);

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
