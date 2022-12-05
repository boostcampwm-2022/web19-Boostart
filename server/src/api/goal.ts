import { Router } from 'express';
import { RowDataPacket } from 'mysql2';
import { API_VERSION } from '../constants';
import { executeSql } from '../db';
import { AuthorizedRequest } from '../types';
import { authenticateToken } from '../utils/auth';

const router = Router();

router.get('/:user_id', authenticateToken, async (req: AuthorizedRequest, res) => {
  const { userIdx } = req.user;
  const { user_id: friendId } = req.params;
  const { date } = req.query;
  if (!date) return res.status(400).send({ msg: '날짜를 지정해주세요.' });

  try {
    const friend = (await executeSql('select idx from user where user_id = ?', [friendId])) as RowDataPacket;
    if (friend.length === 0) return res.status(404).send({ msg: '존재하지 않는 사용자예요.' });

    const { idx: friendIdx } = friend[0];
    if (userIdx === friendIdx) return res.redirect(`/api/${API_VERSION}/goal?date=${date}`);

    const isNotFriend = ((await executeSql('select * from friendship where (sender_idx = ? and receiver_idx = ?) or (sender_idx = ? and receiver_idx = ?)', [userIdx, friendIdx, friendIdx, userIdx])) as RowDataPacket).length === 0;
    if (isNotFriend) return res.status(403).send({ msg: '친구가 아닌 사용자의 목표를 조회할 수 없어요.' });

    const goals = (await executeSql(
      'select goal.idx, goal.title, goal.label_idx as labelIdx, goal.amount as goalAmount, sum(task_label.amount) as currentAmount, goal.over from goal inner join task_label on goal.label_idx = task_label.label_idx inner join task on task_label.task_idx = task.idx where goal.user_idx = ? and task.date = ? group by goal.idx',
      [friendIdx, date]
    )) as RowDataPacket;
    res.json(goals);
  } catch {
    res.sendStatus(500);
  }
});

export default router;
