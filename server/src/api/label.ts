import { Router } from 'express';
import { OkPacket, RowDataPacket } from 'mysql2';
import { API_VERSION } from '../constants';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

const LabelBodyKeys = {
  title: 'title',
  color: 'color',
  unit: 'unit',
} as const;

type LabelBodyKeys = typeof LabelBodyKeys[keyof typeof LabelBodyKeys];

const validate = (key: LabelBodyKeys, value: string) => {
  switch (key) {
    case LabelBodyKeys.title: {
      if (!(value && typeof value === 'string')) throw new ValidationError('올바른 제목을 입력해주세요.');
      return true;
    }
    case LabelBodyKeys.unit: {
      if (!(value && typeof value === 'string')) throw new ValidationError('올바른 단위를 입력해주세요.');
      return true;
    }
    case LabelBodyKeys.color: {
      const regex = /^#[A-Fa-f0-9]{6}$/;
      if (!regex.test(value)) throw new ValidationError('올바른 색상을 입력해주세요.');
      return true;
    }
    default: {
      throw new ValidationError('잘못된 정보가 입력되었어요.');
    }
  }
};

class ValidationError extends Error {}

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  try {
    const labels = await executeSql(
      'select label.idx, label.title, label.color, label.unit, count(task_label.label_idx) + count(goal.idx) as count from label left join task_label on label.idx = task_label.label_idx left join goal on label.idx = goal.label_idx where label.user_idx = ? group by label.idx',
      [userIdx]
    );
    res.json(labels);
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

router.get('/:user_id', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;

  try {
    const friend = (await executeSql('select idx from user where user_id = ?', [friendId])) as RowDataPacket;
    if (friend.length === 0) return res.status(404).json({ msg: '존재하지 않는 사용자예요.' });

    const { idx: friendIdx } = friend[0];
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/label`);

    const isNotFriend = ((await executeSql('select * from friendship where (sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)', [userIdx, friendIdx, friendIdx, userIdx])) as RowDataPacket).length === 0;
    if (isNotFriend) return res.status(403).json({ msg: '친구가 아닌 사용자의 라벨을 조회할 수 없어요.' });

    const labels = await executeSql('select idx, title, color, unit from label where label.user_idx = ?', [friendIdx]);
    res.json(labels);
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

router.post('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;

  try {
    Object.values(LabelBodyKeys).forEach((key) => {
      validate(key, req.body[key]);
    });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }

  const { title, color, unit } = req.body;

  try {
    const existLabel = ((await executeSql('select idx from label where user_idx = ? and title = ?', [userIdx, title])) as RowDataPacket).length > 0;
    if (existLabel) return res.status(409).json({ msg: '이미 존재하는 라벨이에요.' });

    const { insertId } = (await executeSql('insert into label (title, color, unit, user_idx) values (?, ?, ?, ?)', [title, color, unit, userIdx])) as OkPacket;
    res.status(201).json({ idx: insertId });
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

router.patch('/:label_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const labelIdx = req.params.label_idx;
  const { title, color } = req.body;

  try {
    const [label] = (await executeSql('select title, user_idx from label where idx = ?', [labelIdx])) as RowDataPacket[];
    if (!label || label.user_idx !== userIdx) return res.status(404).json({ msg: '존재하지 않는 라벨이에요.' });

    let status = 200;
    let sql = 'update label set';
    const values = [];

    if (title) {
      const [labelTitleAlreadyExists] = (await executeSql('select idx from label where title = ? and user_idx = ?', [title, userIdx])) as RowDataPacket[];
      if (labelTitleAlreadyExists && label.title !== title) status = 409;
      else {
        sql += ' title = ?';
        values.push(title);
      }
    }
    if (color) {
      if (status === 409) {
        status = 206;
      } else {
        sql += title ? ',' : '';
        status = 200;
      }
      sql += ' color = ?';
      values.push(color);
    }
    sql += ' where idx = ?';
    values.push(labelIdx);

    if (status !== 409 && (title || color)) await executeSql(sql, values);
    res.status(status).json({ msg: status === 409 ? '이미 존재하는 라벨이에요.' : '라벨이 수정되었어요.' });
  } catch (error) {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

router.delete('/:label_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const labelIdx = req.params.label_idx;

  try {
    const notExistLabel = ((await executeSql('select idx from label where user_idx = ? and idx = ?', [userIdx, labelIdx])) as RowDataPacket).length === 0;
    if (notExistLabel) return res.status(404).json({ msg: '존재하지 않는 라벨이에요.' });

    const { labelUsageCount } = ((await executeSql('select count(ifnull(label_idx, 0)) as labelUsageCount from task_label where label_idx = ?', [labelIdx])) as RowDataPacket)[0];
    if (labelUsageCount > 0) return res.status(409).json({ msg: '사용 중인 라벨은 삭제할 수 없어요.' });

    await executeSql('delete from label where user_idx = ? and idx = ?', [userIdx, labelIdx]);
    res.status(200).json({ msg: '라벨이 삭제되었어요.' });
  } catch (error) {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

export default router;
