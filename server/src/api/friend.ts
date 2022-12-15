import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  try {
    const users = await executeSql(
      'select idx, user_id as userId, username, profile_img as profileImg from user inner join friendship on idx = sender_idx or idx = receiver_idx where idx != ? and (receiver_idx = ? or sender_idx = ?) and accepted = true',
      [userIdx, userIdx, userIdx]
    );
    res.json(users);
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

router.get('/request', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  try {
    const users = await executeSql('select idx, user_id as userId, username, profile_img as profileImg from user inner join friendship on idx = sender_idx where receiver_idx = ? and accepted = false', [userIdx]);
    res.json(users);
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

router.delete('/:user_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const friendIdx = req.params.user_idx;
  try {
    const { affectedRows } = (await executeSql('delete from friendship where ((sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)) and accepted = true', [userIdx, friendIdx, friendIdx, userIdx])) as RowDataPacket;

    if (affectedRows === 0) return res.status(404).json({ msg: '존재하지 않는 친구예요.' });
    res.status(200).json({ msg: '친구가 삭제되었어요.' });
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

router.put('/request/:user_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const friendIdx = req.params.user_idx;

  if (userIdx === parseInt(friendIdx)) return res.status(409).json({ msg: '스스로에게 친구 요청을 할 수 없어요.' });

  const notExistUser = ((await executeSql('select idx from user where idx = ?', [friendIdx])) as RowDataPacket).length === 0;
  if (notExistUser) return res.status(404).json({ msg: '존재하지 않는 사용자예요.' });

  try {
    const friendRequest = (await executeSql('select * from friendship where (sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)', [userIdx, friendIdx, friendIdx, userIdx])) as RowDataPacket;

    if (friendRequest.length === 0) {
      await executeSql('insert into friendship (sender_idx, receiver_idx, accepted) values (?, ?, false)', [userIdx, friendIdx]);
      return res.status(201).json({ msg: '친구 요청을 보냈어요.' });
    }

    const { sender_idx: senderIdx, accepted } = friendRequest[0];

    if (accepted) return res.status(409).json({ msg: '이미 친구예요.' });
    if (senderIdx === userIdx) return res.status(409).json({ msg: '이미 친구 요청을 보냈어요.' });

    await executeSql('update friendship set accepted = true where sender_idx = ? and receiver_idx = ?', [friendIdx, userIdx]);
    return res.status(200).json({ msg: '이미 나에게 친구 요청을 보낸 사용자예요. 자동으로 친구가 되었어요.' });
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

router.patch('/accept/:user_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const friendIdx = req.params.user_idx;
  try {
    const { affectedRows } = (await executeSql('update friendship set accepted = true where receiver_idx = ? and sender_idx = ? and accepted = false', [userIdx, friendIdx])) as RowDataPacket;
    if (affectedRows === 0) return res.status(404).json({ msg: '존재하지 않는 친구 요청이에요.' });
    res.status(200).json({ msg: '친구가 되었어요.' });
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

router.delete('/accept/:user_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const friendIdx = req.params.user_idx;
  try {
    const { affectedRows } = (await executeSql('delete from friendship where receiver_idx = ? and sender_idx = ? and accepted = false', [userIdx, friendIdx])) as RowDataPacket;
    if (affectedRows === 0) return res.status(404).json({ msg: '존재하지 않는 친구 요청이에요.' });
    res.status(200).json({ msg: '친구 요청을 거절했어요.' });
  } catch {
    res.status(500).json({ msg: '서버 에러가 발생했어요.' });
  }
});

export default router;
