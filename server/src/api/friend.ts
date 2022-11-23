import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  try {
    const users = await executeSql('select idx, user_id, username, profile_img from user inner join friendship on idx = sender_idx or idx = receiver_idx where idx != ? and (receiver_idx = ? or sender_idx = ?) and accepted = true', [
      userIdx.toString(),
      userIdx.toString(),
      userIdx.toString(),
    ]);
    res.json(users);
  } catch {
    res.sendStatus(500);
  }
});

router.get('/request', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  try {
    const users = await executeSql('select idx, user_id, username, profile_img from user inner join friendship on idx = sender_idx where receiver_idx = ? and accepted = false', [userIdx.toString()]);
    res.json(users);
  } catch {
    res.sendStatus(500);
  }
});

router.delete('/:user_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const friendIdx = req.params.user_idx;
  try {
    const { affectedRows } = (await executeSql('delete from friendship where ((sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)) and accepted = true', [
      userIdx.toString(),
      friendIdx.toString(),
      friendIdx.toString(),
      userIdx.toString(),
    ])) as RowDataPacket;

    if (affectedRows === 0) return res.status(404).json({ msg: '존재하지 않는 친구예요.' });
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

router.put('/request/:user_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const friendIdx = req.params.user_idx;

  if (userIdx.toString() === friendIdx) return res.status(404).json({ msg: '스스로에게 친구 요청을 할 수 없어요.' });

  const notExistUser = ((await executeSql('select idx from user where idx = ?', [friendIdx.toString()])) as RowDataPacket).length === 0;
  if (notExistUser) return res.status(404).json({ msg: '존재하지 않는 사용자예요.' });

  try {
    const friendRequest = (await executeSql('select * from friendship where (sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)', [
      userIdx.toString(),
      friendIdx.toString(),
      friendIdx.toString(),
      userIdx.toString(),
    ])) as RowDataPacket;

    if (friendRequest.length === 0) {
      await executeSql('insert into friendship (sender_idx, receiver_idx, accepted) values (?, ?, false)', [userIdx.toString(), friendIdx.toString()]);
      return res.sendStatus(200);
    }

    const { sender_idx: senderIdx, accepted } = friendRequest[0];

    if (accepted) return res.status(404).json({ msg: '이미 친구예요.' });
    if (senderIdx === userIdx) return res.status(404).json({ msg: '이미 친구 요청을 보냈어요.' });

    await executeSql('update friendship set accepted = true where sender_idx = ? and receiver_idx = ?', [friendIdx.toString(), userIdx.toString()]);
    return res.status(200).json({ msg: '이미 나에게 친구 요청을 보낸 사용자예요. 자동으로 친구가 되었어요.' });
  } catch {
    res.sendStatus(500);
  }
});

router.patch('/accept/:user_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const friendIdx = req.params.user_idx;
  try {
    const { affectedRows } = (await executeSql('update friendship set accepted = true where receiver_idx = ? and sender_idx = ? and accepted = false', [userIdx.toString(), friendIdx.toString()])) as RowDataPacket;
    if (affectedRows === 0) return res.status(404).json({ msg: '존재하지 않는 친구 요청이에요.' });
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

router.delete('/accept/:user_idx', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const friendIdx = req.params.user_idx;
  try {
    const { affectedRows } = (await executeSql('delete from friendship where receiver_idx = ? and sender_idx = ? and accepted = false', [userIdx.toString(), friendIdx.toString()])) as RowDataPacket;
    if (affectedRows === 0) return res.status(404).json({ msg: '존재하지 않는 친구 요청이에요.' });
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
