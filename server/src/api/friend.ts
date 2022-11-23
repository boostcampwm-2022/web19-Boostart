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

export default router;
