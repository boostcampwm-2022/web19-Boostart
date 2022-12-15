import { Router } from 'express';
import { OkPacket, RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';
import { API_VERSION } from '../constants';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const tags = await executeSql('select tag.idx as idx, tag.title as title, tag.color as color, count(task.idx) as count from tag left join task on task.tag_idx = tag.idx where tag.user_idx = ? group by tag.idx', [userIdx]);
  res.json(tags);
});

router.get('/:user_id', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;

  try {
    const friend = (await executeSql('select idx from user where user_id = ?', [friendId])) as RowDataPacket;
    if (friend.length === 0) return res.status(404).json({ msg: '존재하지 않는 사용자예요.' });

    const { idx: friendIdx } = friend[0];
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/tag`);

    const isNotFriend = ((await executeSql('select * from friendship where (sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)', [userIdx, friendIdx, friendIdx, userIdx])) as RowDataPacket).length === 0;
    if (isNotFriend) return res.status(403).json({ msg: '친구가 아닌 사용자의 태그를 조회할 수 없어요.' });

    const tags = await executeSql('select tag.idx, tag.title, tag.color, count(task.idx) as count from tag left join task on task.tag_idx = tag.idx where tag.user_idx = ? group by tag.idx', [friendIdx]);

    res.json(tags);
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

router.post('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { title, color } = req.body;
  try {
    const result = (await executeSql('insert into tag (title, color, user_idx) values (?, ?, ?)', [title, color, userIdx])) as OkPacket;
    res.status(200).json({ idx: result.insertId });
  } catch {
    res.status(409).json({ msg: '태그를 생성할 수 없어요.' });
  }
});

router.post('/color/:tag_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const tagIdx = req.params.tag_idx;
  const { color } = req.body;
  try {
    await executeSql('update tag set color = ? where idx = ? and user_idx = ?', [color, tagIdx, userIdx]);
    res.status(200).json({ msg: '태그 수정이 완료되었어요.' });
  } catch {
    res.status(403).json({ msg: '태그를 수정할 수 없어요.' });
  }
});

router.delete('/:tag_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const tagIdx = req.params.tag_idx;

  try {
    const notExistTag = ((await executeSql('select idx from tag where user_idx = ? and idx = ?', [userIdx, tagIdx])) as RowDataPacket).length === 0;
    if (notExistTag) return res.status(404).json({ msg: '존재하지 않는 태그예요.' });

    const tagUsageCount = ((await executeSql('select idx from task where tag_idx = ?', [tagIdx])) as RowDataPacket).length;
    if (tagUsageCount > 0) return res.status(409).json({ msg: '사용 중인 태그는 삭제할 수 없어요.' });

    await executeSql('delete from tag where user_idx = ? and idx = ?', [userIdx, tagIdx]);
    res.status(200).json({ msg: '태그가 삭제되었어요.' });
  } catch (error) {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

export default router;
